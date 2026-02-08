import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft, Play, Pause, SkipForward, SkipBack, Volume2,
  ChevronRight, VolumeX,
} from 'lucide-react'
import { useAudioPlayer, textToSegments, type AudioSegment } from '../hooks/useAudioPlayer'

/**
 * 随行听 —— 听力模块
 *
 * 功能：
 *  1. "正在播放" 卡片 —— 真正的 TTS 播放器
 *  2. 分类标签：推荐 / TED / 新闻 / 课程 / 学习
 *  3. 内容列表（标题、来源、时长、难度）
 *  4. 点击内容即可切换播放
 *
 * 技术方案：
 *  - 使用 SpeechSynthesis (TTS) 朗读英文文本内容
 *  - 每条内容附带英文脚本（真实学习素材）
 *  - 播放进度实时追踪
 */

// ===== 分类标签 =====
const categories = ['推荐', 'TED', '新闻', '课程', '学习']

// ===== 内容列表 —— 附带真实英文朗读脚本 =====
const contentList = [
  {
    title: 'The Power of Vulnerability',
    source: 'TED Talk · Brené Brown',
    duration: '3:20',
    difficulty: 'B1',
    vocab: 45,
    thumb: '🎤',
    category: 'TED',
    // 真实 TED 演讲片段（公共领域概述/改写）
    script: `Connection is why we're here. It's what gives purpose and meaning to our lives. The ability to feel connected is neurobiologically how we're wired. It's why we're here. In order for connection to happen, we have to allow ourselves to be seen, really seen. Vulnerability is not weakness. It is our most accurate measurement of courage. To be vulnerable, to let ourselves be seen, to be honest. When we numb vulnerability, we numb joy, we numb gratitude, we numb happiness. Vulnerability is the birthplace of innovation, creativity, and change. To create is to make something that has never existed before. There's nothing more vulnerable than that.`,
  },
  {
    title: 'How AI is Transforming Education',
    source: 'TED Talk · Sal Khan',
    duration: '2:45',
    difficulty: 'B2',
    vocab: 62,
    thumb: '🤖',
    category: 'TED',
    script: `Artificial intelligence is not going to replace teachers. But teachers who use AI will replace teachers who don't. The real power of AI in education is personalization. Every student learns at a different pace. Some need more time with fractions. Others need more practice with reading comprehension. AI tutors can adapt to each student's needs in real time, providing the right challenge at the right moment. This is not about replacing human connection. It's about amplifying it. When AI handles the repetitive aspects of teaching, teachers are free to do what they do best: inspire, mentor, and connect with students on a human level.`,
  },
  {
    title: 'BBC World News Update',
    source: 'BBC News',
    duration: '2:00',
    difficulty: 'B2',
    vocab: 38,
    thumb: '📰',
    category: '新闻',
    script: `Good evening. Here are the top stories from around the world. Global leaders have gathered in Geneva for the annual climate summit, where discussions focused on reducing carbon emissions by thirty percent over the next decade. In technology news, a major breakthrough in quantum computing was announced today, with researchers demonstrating a system that can solve complex problems in minutes rather than years. Meanwhile, the international space station successfully completed its latest orbital adjustment, preparing for a new series of scientific experiments. In economic news, markets showed steady growth across Asia and Europe, with technology stocks leading the gains.`,
  },
  {
    title: 'English Grammar in Context',
    source: 'Cambridge Course',
    duration: '2:15',
    difficulty: 'A2',
    vocab: 20,
    thumb: '📚',
    category: '课程',
    script: `Today, we're going to learn about the present perfect tense. The present perfect is formed with "have" or "has" plus the past participle. For example: "I have visited Paris." "She has finished her homework." We use the present perfect to talk about experiences in our life. "Have you ever tried sushi?" "I have never been to Australia." We also use it for actions that started in the past and continue now. "I have lived here for five years." "She has worked at this company since two thousand twenty." Remember: we use "for" with a period of time, and "since" with a specific point in time.`,
  },
  {
    title: 'Daily English Conversation',
    source: 'Learning Podcast',
    duration: '1:45',
    difficulty: 'A2',
    vocab: 15,
    thumb: '💬',
    category: '学习',
    script: `Let's practice some everyday English conversations. Imagine you're at a coffee shop. "Hi, can I get a large latte, please?" "Sure! Would you like that hot or iced?" "Iced, please. And can I add an extra shot of espresso?" "Of course. That will be five dollars and fifty cents." "Here you go. Thank you!" Now let's try ordering food at a restaurant. "Good evening. I'd like to see the menu, please." "Here you are. Our special today is grilled salmon with vegetables." "That sounds great. I'll have the salmon, please." "Excellent choice. Would you like anything to drink?"`,
  },
  {
    title: 'Science Friday Highlights',
    source: 'NPR',
    duration: '3:00',
    difficulty: 'C1',
    vocab: 78,
    thumb: '🔬',
    category: '推荐',
    script: `Scientists have made a remarkable discovery in the field of marine biology. Deep beneath the ocean surface, in hydrothermal vents where temperatures exceed three hundred degrees Celsius, researchers have found microorganisms that defy our understanding of life. These extremophiles, as they're called, thrive in conditions that would instantly destroy most known life forms. What makes this discovery particularly fascinating is the implications for astrobiology. If life can exist in such extreme conditions on Earth, it dramatically increases the probability of finding life elsewhere in our solar system. Europa, one of Jupiter's moons, has a subsurface ocean that may have similar hydrothermal conditions. This finding has reinvigorated the scientific community's interest in sending probes to these distant worlds.`,
  },
]

export default function ListenGoPage() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('推荐')

  // ===== 当前选中播放的内容索引 =====
  const [activeContentIndex, setActiveContentIndex] = useState(0)

  // ===== 使用音频播放器 Hook =====
  const player = useAudioPlayer()

  // ===== 当选中的内容变化时，加载新的音频片段 =====
  useEffect(() => {
    const content = contentList[activeContentIndex]
    if (content) {
      const segments: AudioSegment[] = textToSegments(content.script)
      player.loadContent(segments)
    }
  }, [activeContentIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  // ===== 当前播放的内容 =====
  const currentContent = contentList[activeContentIndex]

  // ===== 过滤内容列表 =====
  const filteredList = activeCategory === '推荐'
    ? contentList
    : contentList.filter(c => c.category === activeCategory)

  // ===== 点击内容列表项 → 切换播放 =====
  const handleSelectContent = (globalIndex: number) => {
    if (globalIndex === activeContentIndex) {
      // 点击当前正在播放的内容 → 切换播放/暂停
      if (player.isPlaying) {
        player.pause()
      } else {
        player.play()
      }
    } else {
      // 切换到新内容
      setActiveContentIndex(globalIndex)
      // loadContent 会在 useEffect 中触发
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      {/* ===== Header ===== */}
      <div className="flex items-center gap-3 px-5 py-4">
        <button onClick={() => { player.stop(); navigate(-1) }} className="p-1">
          <ChevronLeft size={24} className="text-[var(--color-foreground)]" />
        </button>
        <h1 className="text-[18px] font-bold text-[var(--color-foreground)] font-secondary">随行听</h1>
      </div>

      {/* ===== 正在播放卡片 ===== */}
      <div className="mx-5 mb-4 p-4 rounded-[var(--radius-md)] text-white"
        style={{ background: 'linear-gradient(135deg, #3B82F6, #6366F1)' }}>
        <p className="text-[11px] text-white/70 mb-1">
          {player.isPlaying ? '正在播放' : '已暂停'}
        </p>
        <h3 className="text-[16px] font-bold mb-1">{currentContent.title}</h3>
        <p className="text-[12px] text-white/80 mb-3">{currentContent.source}</p>

        {/* 当前朗读的句子预览 */}
        {player.totalSegments > 0 && (
          <p className="text-[11px] text-white/60 mb-2 line-clamp-1 italic">
            "{player.currentIndex < player.totalSegments
              ? contentList[activeContentIndex].script
                  .split(/(?<=[.!?。！？])\s+/)[player.currentIndex] || ''
              : '播放完毕'
            }"
          </p>
        )}

        {/* 进度条 */}
        <div className="h-1 bg-white/20 rounded-full mb-2">
          <div
            className="h-full bg-white rounded-full transition-all duration-300"
            style={{ width: `${player.progress}%` }}
          />
        </div>

        {/* 时间 & 控制按钮 */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-white/60">
            {player.formatTime(player.elapsedTime)} / {player.formatTime(player.totalDuration)}
          </span>
          <div className="flex items-center gap-4">
            {/* 上一句 */}
            <button onClick={player.prev} className="active:scale-90 transition-transform">
              <SkipBack size={18} className="text-white/80" />
            </button>
            {/* 播放/暂停 */}
            <button
              onClick={() => player.isPlaying ? player.pause() : player.play()}
              className="active:scale-90 transition-transform"
            >
              {player.isPlaying
                ? <Pause size={22} className="text-white" />
                : <Play size={22} className="text-white" />
              }
            </button>
            {/* 下一句 */}
            <button onClick={player.next} className="active:scale-90 transition-transform">
              <SkipForward size={18} className="text-white/80" />
            </button>
            {/* 音量指示 */}
            <button
              onClick={player.stop}
              className="active:scale-90 transition-transform"
            >
              {player.isPlaying
                ? <Volume2 size={18} className="text-white/80" />
                : <VolumeX size={18} className="text-white/40" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* ===== 分类标签 ===== */}
      <div className="flex items-center gap-2 px-5 mb-4 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors shrink-0 ${
              activeCategory === cat
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-background-secondary)] text-[var(--color-muted)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ===== 内容列表 ===== */}
      <div className="flex-1 overflow-y-auto px-5 pb-8">
        <div className="space-y-2">
          {filteredList.map((item) => {
            // 找到该 item 在 contentList 中的全局索引
            const globalIndex = contentList.indexOf(item)
            const isActive = globalIndex === activeContentIndex

            return (
              <div
                key={globalIndex}
                onClick={() => handleSelectContent(globalIndex)}
                className={`flex items-center gap-3 p-3 rounded-[var(--radius-sm)] cursor-pointer active:bg-[var(--color-background-secondary)] transition-colors ${
                  isActive
                    ? 'bg-[var(--color-primary-light)] border border-[var(--color-primary)]/20'
                    : 'bg-[var(--color-card)]'
                }`}
                style={{ boxShadow: 'var(--shadow-card)' }}
              >
                {/* 缩略图 / 播放状态 */}
                <div className={`w-12 h-12 rounded-[10px] flex items-center justify-center shrink-0 ${
                  isActive ? 'bg-[var(--color-primary)]/20' : 'bg-[var(--color-primary-light)]'
                }`}>
                  {isActive && player.isPlaying ? (
                    <Pause size={20} className="text-[var(--color-primary)]" />
                  ) : isActive ? (
                    <Play size={20} className="text-[var(--color-primary)]" />
                  ) : (
                    <span className="text-[20px]">{item.thumb}</span>
                  )}
                </div>
                {/* 信息 */}
                <div className="flex-1 min-w-0">
                  <p className={`text-[14px] font-semibold line-clamp-1 ${
                    isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-foreground)]'
                  }`}>{item.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-[var(--color-muted)]">{item.source}</span>
                    <span className="text-[11px] text-[var(--color-muted)]">·</span>
                    <span className="text-[11px] text-[var(--color-muted)]">{item.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] px-1.5 py-0.5 bg-[var(--color-background-secondary)] rounded text-[var(--color-muted)]">
                      {item.difficulty}
                    </span>
                    <span className="text-[10px] text-[var(--color-muted)]">{item.vocab} 词汇</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-[var(--color-muted)] shrink-0" />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
