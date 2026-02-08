import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft, Play, Pause, SkipBack, SkipForward, Check, X as XIcon,
  Volume2, RotateCcw,
} from 'lucide-react'
import { stopSpeaking, loadTTSSettings } from '../lib/tts'

/**
 * 听歌填字 —— 听力模块
 *
 * 功能：
 *  1. 专辑封面 + 歌曲信息
 *  2. TTS 逐行朗读歌词（真正的音频播放）
 *  3. 歌词填空 —— 需要用户听清并填写缺失的单词
 *  4. 播放控制：上一句/下一句/播放/暂停
 *  5. 自动评分和反馈
 *
 * 技术方案：
 *  - 使用 SpeechSynthesis (TTS) 朗读每行歌词
 *  - 当朗读到当前填空行时自动高亮
 *  - 用户填写后实时判断对错
 */

// ===== 歌词数据结构 =====
interface LyricLine {
  /** 完整歌词文本 */
  fullText: string
  /** 需要填空的单词（如果有的话） */
  blankWord?: string
  /** 给用户看的带空白的歌词 */
  displayText: string
}

// ===== 歌曲列表 =====
const songs = [
  {
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    emoji: '🎵',
    gradient: 'from-[#FF6B6B] to-[#FF8400]',
    shadowColor: 'rgba(255,132,0,0.3)',
    lyrics: [
      { fullText: "The club isn't the best place to find a lover", blankWord: 'lover', displayText: "The club isn't the best place to find a ___" },
      { fullText: "So the bar is where I go", blankWord: 'go', displayText: "So the bar is where I ___" },
      { fullText: "Me and my friends at the table doing shots", blankWord: 'shots', displayText: "Me and my friends at the table doing ___" },
      { fullText: "Drinking fast and then we talk slow", blankWord: 'slow', displayText: "Drinking fast and then we talk ___" },
      { fullText: "Come over and start up a conversation with just me", blankWord: 'conversation', displayText: "Come over and start up a ___ with just me" },
      { fullText: "And trust me I'll give it a chance now", blankWord: 'chance', displayText: "And trust me I'll give it a ___ now" },
      { fullText: "Take my hand, stop, put Van the Man on the jukebox", blankWord: undefined, displayText: "Take my hand, stop, put Van the Man on the jukebox" },
      { fullText: "And then we start to dance, and now I'm singing like", blankWord: 'dance', displayText: "And then we start to ___, and now I'm singing like" },
    ] as LyricLine[],
  },
  {
    title: 'Someone Like You',
    artist: 'Adele',
    emoji: '🎶',
    gradient: 'from-[#8B5CF6] to-[#6366F1]',
    shadowColor: 'rgba(139,92,246,0.3)',
    lyrics: [
      { fullText: "I heard that you're settled down", blankWord: 'settled', displayText: "I heard that you're ___ down" },
      { fullText: "That you found a girl and you're married now", blankWord: 'married', displayText: "That you found a girl and you're ___ now" },
      { fullText: "I heard that your dreams came true", blankWord: 'dreams', displayText: "I heard that your ___ came true" },
      { fullText: "Guess she gave you things I didn't give to you", blankWord: 'give', displayText: "Guess she gave you things I didn't ___ to you" },
      { fullText: "Old friend, why are you so shy?", blankWord: 'shy', displayText: "Old friend, why are you so ___?" },
      { fullText: "Ain't like you to hold back or hide from the light", blankWord: 'light', displayText: "Ain't like you to hold back or hide from the ___" },
      { fullText: "Never mind, I'll find someone like you", blankWord: 'someone', displayText: "Never mind, I'll find ___ like you" },
      { fullText: "I wish nothing but the best for you too", blankWord: 'best', displayText: "I wish nothing but the ___ for you too" },
    ] as LyricLine[],
  },
]

// ===== 填空状态 =====
type BlankStatus = 'locked' | 'active' | 'correct' | 'wrong'

export default function ListenFillPage() {
  const navigate = useNavigate()

  // ===== 歌曲选择 =====
  const [songIndex] = useState(0) // 可以后续做歌曲切换
  const song = songs[songIndex]

  // ===== 播放状态 =====
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentLineIndex, setCurrentLineIndex] = useState(0) // 当前朗读到的行
  const isPlayingRef = useRef(false)
  const currentLineRef = useRef(0)

  // ===== 填空状态 =====
  const [blankStatuses, setBlankStatuses] = useState<BlankStatus[]>(
    song.lyrics.map((line, i) => {
      if (!line.blankWord) return 'correct' // 无填空的行直接标记为正确
      return i === 0 ? 'active' : 'locked'
    })
  )
  const [userInputs, setUserInputs] = useState<Record<number, string>>({})
  const [activeInput, setActiveInput] = useState('')
  const [score, setScore] = useState({ correct: 0, wrong: 0 })

  // ===== 找到第一个 active 的填空行索引 =====
  const activeLineIndex = blankStatuses.findIndex(s => s === 'active')

  // 同步 ref
  useEffect(() => { isPlayingRef.current = isPlaying }, [isPlaying])
  useEffect(() => { currentLineRef.current = currentLineIndex }, [currentLineIndex])

  // ===== 朗读指定行 =====
  const speakLine = useCallback((index: number) => {
    if (index >= song.lyrics.length) {
      setIsPlaying(false)
      return
    }

    const line = song.lyrics[index]
    setCurrentLineIndex(index)

    // 使用 SpeechSynthesis 朗读
    if (!('speechSynthesis' in window)) return

    stopSpeaking()

    const settings = loadTTSSettings()
    const utterance = new SpeechSynthesisUtterance(line.fullText)
    utterance.lang = settings.accent
    utterance.rate = settings.rate * 0.85 // 稍微放慢，方便听歌填字
    utterance.volume = settings.volume
    utterance.pitch = 1

    // 匹配语音
    const voices = window.speechSynthesis.getVoices()
    const bestVoice = voices.find(v => v.lang === settings.accent)
      || voices.find(v => v.lang.startsWith('en'))
    if (bestVoice) utterance.voice = bestVoice

    // 朗读完当前行后，自动进入下一行
    utterance.onend = () => {
      if (isPlayingRef.current) {
        // 延迟 0.5 秒后播放下一行
        setTimeout(() => {
          if (isPlayingRef.current) {
            const nextIdx = currentLineRef.current + 1
            if (nextIdx < song.lyrics.length) {
              speakLine(nextIdx)
            } else {
              setIsPlaying(false) // 全部播放完毕
            }
          }
        }, 500)
      }
    }

    utterance.onerror = () => {
      // 出错时也尝试继续
      if (isPlayingRef.current) {
        const nextIdx = currentLineRef.current + 1
        if (nextIdx < song.lyrics.length) {
          setTimeout(() => speakLine(nextIdx), 300)
        } else {
          setIsPlaying(false)
        }
      }
    }

    window.speechSynthesis.speak(utterance)
  }, [song.lyrics])

  // ===== 播放/暂停 =====
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false)
      stopSpeaking()
    } else {
      setIsPlaying(true)
      speakLine(currentLineIndex)
    }
  }, [isPlaying, currentLineIndex, speakLine])

  // ===== 上一句 =====
  const prevLine = useCallback(() => {
    const prev = Math.max(0, currentLineIndex - 1)
    stopSpeaking()
    setCurrentLineIndex(prev)
    if (isPlaying) {
      speakLine(prev)
    }
  }, [currentLineIndex, isPlaying, speakLine])

  // ===== 下一句 =====
  const nextLine = useCallback(() => {
    const next = Math.min(song.lyrics.length - 1, currentLineIndex + 1)
    stopSpeaking()
    setCurrentLineIndex(next)
    if (isPlaying) {
      speakLine(next)
    }
  }, [currentLineIndex, song.lyrics.length, isPlaying, speakLine])

  // ===== 重新朗读当前行（点击喇叭） =====
  const replayCurrentLine = useCallback((lineIndex: number) => {
    stopSpeaking()
    speakLine(lineIndex)
  }, [speakLine])

  // ===== 提交填空答案 =====
  const submitAnswer = useCallback(() => {
    if (activeLineIndex < 0) return
    const line = song.lyrics[activeLineIndex]
    if (!line.blankWord) return

    const userAnswer = activeInput.trim().toLowerCase()
    const correctAnswer = line.blankWord.toLowerCase()
    const isCorrect = userAnswer === correctAnswer

    // 更新状态
    setBlankStatuses(prev => {
      const newStatuses = [...prev]
      newStatuses[activeLineIndex] = isCorrect ? 'correct' : 'wrong'

      // 解锁下一个填空行
      const nextBlank = newStatuses.findIndex((s, i) => i > activeLineIndex && s === 'locked')
      if (nextBlank >= 0) {
        newStatuses[nextBlank] = 'active'
      }
      return newStatuses
    })

    // 记录用户输入
    setUserInputs(prev => ({ ...prev, [activeLineIndex]: activeInput.trim() }))

    // 更新分数
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      wrong: prev.wrong + (isCorrect ? 0 : 1),
    }))

    // 清空输入
    setActiveInput('')
  }, [activeLineIndex, activeInput, song.lyrics])

  // ===== 重新开始 =====
  const restart = useCallback(() => {
    stopSpeaking()
    setIsPlaying(false)
    setCurrentLineIndex(0)
    setBlankStatuses(song.lyrics.map((line, i) => {
      if (!line.blankWord) return 'correct'
      return i === 0 ? 'active' : 'locked'
    }))
    setUserInputs({})
    setActiveInput('')
    setScore({ correct: 0, wrong: 0 })
  }, [song.lyrics])

  // ===== 组件卸载时停止 =====
  useEffect(() => {
    return () => { stopSpeaking() }
  }, [])

  // ===== 播放进度 =====
  const progress = song.lyrics.length > 0
    ? ((currentLineIndex + 1) / song.lyrics.length) * 100
    : 0

  // ===== 总填空数 =====
  const totalBlanks = song.lyrics.filter(l => l.blankWord).length
  const isAllDone = !blankStatuses.includes('locked') && !blankStatuses.includes('active')

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      {/* ===== Header ===== */}
      <div className="flex items-center gap-3 px-5 py-4">
        <button onClick={() => { stopSpeaking(); navigate(-1) }} className="p-1">
          <ChevronLeft size={24} className="text-[var(--color-foreground)]" />
        </button>
        <h1 className="text-[18px] font-bold text-[var(--color-foreground)] font-secondary">听歌填字</h1>
        {/* 分数显示 */}
        <div className="ml-auto flex items-center gap-3 text-[12px]">
          <span className="text-[var(--color-success)] font-bold">✓ {score.correct}</span>
          <span className="text-[var(--color-error)] font-bold">✗ {score.wrong}</span>
        </div>
      </div>

      {/* ===== 专辑封面 + 信息 ===== */}
      <div className="flex flex-col items-center px-5 mb-5">
        <div className={`w-[140px] h-[140px] rounded-[20px] bg-gradient-to-br ${song.gradient} flex items-center justify-center mb-3`}
          style={{ boxShadow: `0 8px 30px ${song.shadowColor}` }}>
          <span className="text-[52px]">{song.emoji}</span>
        </div>
        <h2 className="text-[18px] font-bold text-[var(--color-foreground)]">{song.title}</h2>
        <p className="text-[13px] text-[var(--color-muted)]">{song.artist}</p>
      </div>

      {/* ===== 播放进度条 ===== */}
      <div className="px-8 mb-3">
        <div className="h-1 bg-[var(--color-background-secondary)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-[var(--color-muted)]">
            第 {currentLineIndex + 1} / {song.lyrics.length} 行
          </span>
          <span className="text-[10px] text-[var(--color-muted)]">
            {score.correct + score.wrong} / {totalBlanks} 已填
          </span>
        </div>
      </div>

      {/* ===== 播放控制 ===== */}
      <div className="flex items-center justify-center gap-8 mb-4">
        <button className="p-2 active:scale-90 transition-transform" onClick={prevLine}>
          <SkipBack size={22} className="text-[var(--color-foreground)]" />
        </button>
        <button
          onClick={togglePlay}
          className="w-14 h-14 rounded-full bg-[var(--color-primary)] flex items-center justify-center active:scale-95 transition-transform"
        >
          {isPlaying
            ? <Pause size={24} className="text-white" />
            : <Play size={24} className="text-white ml-1" />
          }
        </button>
        <button className="p-2 active:scale-90 transition-transform" onClick={nextLine}>
          <SkipForward size={22} className="text-[var(--color-foreground)]" />
        </button>
      </div>

      {/* ===== 歌词填空区域 ===== */}
      <div className="flex-1 px-5 overflow-y-auto pb-8">
        <h3 className="text-[14px] font-bold text-[var(--color-foreground)] mb-3 font-secondary">歌词填空</h3>
        <div className="space-y-3">
          {song.lyrics.map((line, i) => {
            const status = blankStatuses[i]
            const isCurrentlyReading = currentLineIndex === i
            const parts = line.displayText.split('___')

            return (
              <div key={i} className={`p-3 rounded-[var(--radius-sm)] transition-all ${
                isCurrentlyReading
                  ? 'ring-2 ring-[var(--color-primary)]/40'
                  : ''
              } ${
                status === 'active'
                  ? 'bg-[var(--color-primary-light)] border border-[var(--color-primary)]/30'
                  : status === 'correct' && line.blankWord
                    ? 'bg-[var(--color-success)]/5'
                    : status === 'wrong'
                      ? 'bg-[var(--color-error)]/5'
                      : status === 'locked'
                        ? 'bg-[var(--color-background-secondary)] opacity-60'
                        : 'bg-[var(--color-background-secondary)]/50'
              }`}>
                <div className="flex items-start gap-2">
                  {/* 朗读按钮 —— 点击可重新朗读这行 */}
                  <button
                    className="p-1 shrink-0 mt-0.5 active:scale-90 transition-transform"
                    onClick={() => replayCurrentLine(i)}
                  >
                    <Volume2 size={14} className={
                      isCurrentlyReading && isPlaying
                        ? 'text-[var(--color-primary)]'
                        : 'text-[var(--color-muted)]'
                    } />
                  </button>

                  {/* 歌词内容 */}
                  <p className="text-[14px] text-[var(--color-foreground)] leading-relaxed flex-1">
                    {!line.blankWord ? (
                      // 无填空行：直接显示
                      <span>{line.fullText}</span>
                    ) : (
                      <>
                        {parts[0]}
                        {status === 'active' ? (
                          // 当前活跃的填空
                          <span className="inline-flex items-center gap-1">
                            <input
                              type="text"
                              value={activeInput}
                              onChange={(e) => setActiveInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') submitAnswer()
                              }}
                              className="inline-block w-[120px] mx-1 px-2 py-0.5 border-b-2 border-[var(--color-primary)] bg-transparent text-[var(--color-primary)] font-semibold outline-none text-center"
                              placeholder="填写..."
                              autoFocus
                            />
                            <button
                              onClick={submitAnswer}
                              className="px-2 py-0.5 bg-[var(--color-primary)] text-white rounded text-[11px] font-bold active:scale-90 transition-transform"
                            >
                              确认
                            </button>
                          </span>
                        ) : status === 'correct' ? (
                          // 答对了
                          <span className="inline-flex items-center gap-1 mx-1 px-2 py-0.5 bg-[var(--color-success)]/10 rounded text-[var(--color-success)] font-semibold">
                            {line.blankWord} <Check size={12} />
                          </span>
                        ) : status === 'wrong' ? (
                          // 答错了（显示用户答案 + 正确答案）
                          <span className="inline-flex items-center gap-1 mx-1">
                            <span className="px-2 py-0.5 bg-[var(--color-error)]/10 rounded text-[var(--color-error)] font-semibold line-through">
                              {userInputs[i] || '?'}
                            </span>
                            <span className="px-2 py-0.5 bg-[var(--color-success)]/10 rounded text-[var(--color-success)] font-semibold">
                              {line.blankWord}
                            </span>
                            <XIcon size={12} className="text-[var(--color-error)]" />
                          </span>
                        ) : (
                          // 锁定状态
                          <span className="inline-block mx-1 w-[80px] border-b border-dashed border-[var(--color-muted)] text-center text-[var(--color-muted)]">
                            ···
                          </span>
                        )}
                        {parts[1]}
                      </>
                    )}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* ===== 完成提示 ===== */}
        {isAllDone && (
          <div className="mt-6 p-4 bg-[var(--color-card)] rounded-[var(--radius-md)] text-center" style={{ boxShadow: 'var(--shadow-card)' }}>
            <p className="text-[24px] mb-2">🎉</p>
            <p className="text-[16px] font-bold text-[var(--color-foreground)] mb-1">填写完毕！</p>
            <p className="text-[13px] text-[var(--color-muted)] mb-3">
              正确 {score.correct} / 错误 {score.wrong} / 总共 {totalBlanks}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={restart}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--color-background-secondary)] rounded-[var(--radius-sm)] text-[13px] font-semibold text-[var(--color-foreground)]"
              >
                <RotateCcw size={14} /> 重新来过
              </button>
              <button
                onClick={() => { stopSpeaking(); navigate(-1) }}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] rounded-[var(--radius-sm)] text-[13px] font-semibold text-white"
              >
                返回听力中心
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
