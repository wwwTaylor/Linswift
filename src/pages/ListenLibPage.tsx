import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft, Play, Pause, BookOpenText, ChevronRight, Plus, Headphones,
  SkipForward, SkipBack, Square,
} from 'lucide-react'
import { useAudioPlayer, textToSegments, type AudioSegment } from '../hooks/useAudioPlayer'

/**
 * 听·图书馆 —— 听力模块
 *
 * 功能：
 *  1. "正在播放" 状态栏 —— 真正的 TTS 播放器
 *  2. "转化图书为博客" 入口
 *  3. 分类标签：全部 / 图书转化 / AI 原创 / 热门
 *  4. 博客/音频列表 —— 点击即可朗读
 *
 * 技术方案：
 *  - 每篇文章附带英文脚本内容
 *  - 点击后用 TTS 朗读全文
 *  - 支持播放/暂停/跳句
 */

// ===== 分类标签 =====
const categories = ['全部', '图书转化', 'AI 原创', '热门']

// ===== 博客列表数据 —— 附带英文内容脚本 =====
const blogList = [
  {
    title: 'The Psychology of Money',
    type: '图书转化', duration: '3:30', plays: 1240,
    desc: '从《金钱心理学》提炼的核心概念和关键洞察',
    tag: '💰 理财', isNew: true,
    script: `The most important financial skill is getting the goalpost to stop moving. It's one of the hardest. If expectations rise with results, there is no logic in striving for more because you'll feel the same after putting in extra effort. Happiness is just results minus expectations. Getting money requires taking risks, being optimistic, and putting yourself out there. But keeping money requires the opposite of taking risk. It requires humility, and fear that what you've made can be taken away from you just as fast. Getting and keeping money are two different skills. We should be careful about what we think we know, and humble about what we don't know. The world is full of surprises.`,
  },
  {
    title: 'Atomic Habits: Core Principles',
    type: '图书转化', duration: '3:00', plays: 2100,
    desc: '拆解《原子习惯》的四个行为改变法则',
    tag: '🎯 效率', isNew: false,
    script: `Every action you take is a vote for the type of person you wish to become. No single instance will transform your beliefs, but as the votes build up, so does the evidence of your new identity. Habits are the compound interest of self-improvement. The same way that money multiplies through compound interest, the effects of your habits multiply as you repeat them. They seem to make little difference on any given day, and yet the impact they deliver over the months and years can be enormous. It is only when looking back two, five, or ten years later that the value of good habits and the cost of bad ones becomes strikingly apparent.`,
  },
  {
    title: 'AI in Daily Life',
    type: 'AI 原创', duration: '2:30', plays: 890,
    desc: 'AI 如何改变我们的工作和学习方式',
    tag: '🤖 科技', isNew: true,
    script: `Artificial intelligence is no longer a futuristic concept. It's already woven into our daily lives in ways we might not even notice. When you ask your phone for directions, an AI model processes traffic data in real time. When you receive movie recommendations, machine learning algorithms analyze your viewing history. In education, AI tutors can adapt to each student's learning pace, providing personalized exercises. In healthcare, AI assists doctors in detecting diseases from medical images with remarkable accuracy. The question is not whether AI will change our lives, but how we choose to use it responsibly.`,
  },
  {
    title: 'The Art of Thinking Clearly',
    type: '图书转化', duration: '3:15', plays: 1560,
    desc: '常见的认知偏差和思维陷阱',
    tag: '🧠 思维', isNew: false,
    script: `We are not rational beings. We are rationalizing beings. Our brains are wired to find patterns, even where none exist. Confirmation bias leads us to seek out information that supports what we already believe. The sunk cost fallacy makes us continue investing in something because we've already put so much into it, even when we should cut our losses. Survivorship bias makes us focus on successes while ignoring the much larger number of failures. Understanding these cognitive biases doesn't make us immune to them, but it gives us a fighting chance to make better decisions.`,
  },
  {
    title: 'Space Exploration 2026',
    type: 'AI 原创', duration: '2:45', plays: 650,
    desc: '人类太空探索的最新进展',
    tag: '🚀 科学', isNew: false,
    script: `The year twenty twenty-six marks a pivotal moment in space exploration. Multiple private companies are now competing to establish permanent bases on the Moon. Mars missions are in their final planning stages, with crew selection well underway. The James Webb Space Telescope continues to reveal stunning images of distant galaxies, reshaping our understanding of the universe's origins. Meanwhile, asteroid mining startups are attracting serious investment, promising to unlock trillions of dollars in raw materials floating in space. The dream of becoming a multiplanetary species has never felt more achievable.`,
  },
]

export default function ListenLibPage() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('全部')

  // ===== 当前选中播放的内容索引 =====
  const [activeContentIndex, setActiveContentIndex] = useState(0)

  // ===== 使用音频播放器 Hook =====
  const player = useAudioPlayer()

  // ===== 当选中内容变化时，加载新的音频片段 =====
  useEffect(() => {
    const content = blogList[activeContentIndex]
    if (content) {
      const segments: AudioSegment[] = textToSegments(content.script)
      player.loadContent(segments)
    }
  }, [activeContentIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  const currentContent = blogList[activeContentIndex]

  // ===== 按分类过滤 =====
  const filteredList = activeCategory === '全部'
    ? blogList
    : activeCategory === '热门'
      ? [...blogList].sort((a, b) => b.plays - a.plays)
      : blogList.filter(b => b.type === activeCategory)

  // ===== 点击内容 → 切换播放 =====
  const handleSelectContent = (globalIndex: number) => {
    if (globalIndex === activeContentIndex) {
      if (player.isPlaying) {
        player.pause()
      } else {
        player.play()
      }
    } else {
      setActiveContentIndex(globalIndex)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      {/* ===== Header ===== */}
      <div className="flex items-center gap-3 px-5 py-4">
        <button onClick={() => { player.stop(); navigate(-1) }} className="p-1">
          <ChevronLeft size={24} className="text-[var(--color-foreground)]" />
        </button>
        <h1 className="text-[18px] font-bold text-[var(--color-foreground)] font-secondary">听·图书馆</h1>
      </div>

      {/* ===== 正在播放状态栏 ===== */}
      <div className="mx-5 mb-4 p-3 bg-[var(--color-card)] rounded-[var(--radius-sm)] border border-[var(--color-border)]"
        style={{ boxShadow: 'var(--shadow-card)' }}>
        {/* 标题行 */}
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-10 h-10 rounded-[8px] flex items-center justify-center shrink-0 ${
            player.isPlaying ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-primary-light)]'
          }`}>
            <Headphones size={18} className={player.isPlaying ? 'text-white' : 'text-[var(--color-primary)]'} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-[var(--color-foreground)] line-clamp-1">
              {currentContent.title}
            </p>
            <p className="text-[11px] text-[var(--color-muted)]">
              {player.isPlaying ? '正在播放' : '已暂停'} · {currentContent.tag}
            </p>
          </div>
        </div>

        {/* 进度条 */}
        <div className="h-1 bg-[var(--color-background-secondary)] rounded-full mb-1.5 overflow-hidden">
          <div
            className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-300"
            style={{ width: `${player.progress}%` }}
          />
        </div>

        {/* 时间 + 控制按钮 */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[var(--color-muted)]">
            {player.formatTime(player.elapsedTime)} / {player.formatTime(player.totalDuration)}
          </span>
          <div className="flex items-center gap-3">
            <button onClick={player.prev} className="p-1 active:scale-90 transition-transform">
              <SkipBack size={16} className="text-[var(--color-foreground)]" />
            </button>
            <button
              onClick={() => player.isPlaying ? player.pause() : player.play()}
              className="p-1.5 active:scale-90 transition-transform"
            >
              {player.isPlaying
                ? <Pause size={20} className="text-[var(--color-primary)]" />
                : <Play size={20} className="text-[var(--color-primary)]" />
              }
            </button>
            <button onClick={player.next} className="p-1 active:scale-90 transition-transform">
              <SkipForward size={16} className="text-[var(--color-foreground)]" />
            </button>
            <button onClick={player.stop} className="p-1 active:scale-90 transition-transform">
              <Square size={14} className="text-[var(--color-muted)]" />
            </button>
          </div>
        </div>
      </div>

      {/* ===== 转化图书为博客 ===== */}
      <div className="mx-5 mb-4">
        <button className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-dashed border-[var(--color-primary)]/30 rounded-[var(--radius-md)] text-[var(--color-primary)] active:bg-[var(--color-primary-light)] transition-colors">
          <Plus size={18} />
          <BookOpenText size={18} />
          <span className="text-[14px] font-semibold">转化图书为博客</span>
        </button>
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

      {/* ===== 博客列表 ===== */}
      <div className="flex-1 overflow-y-auto px-5 pb-8">
        <div className="space-y-3">
          {filteredList.map((item) => {
            const globalIndex = blogList.indexOf(item)
            const isActive = globalIndex === activeContentIndex

            return (
              <div
                key={globalIndex}
                onClick={() => handleSelectContent(globalIndex)}
                className={`p-4 rounded-[var(--radius-md)] cursor-pointer active:scale-[0.98] transition-transform ${
                  isActive
                    ? 'bg-[var(--color-primary-light)] border border-[var(--color-primary)]/20'
                    : 'bg-[var(--color-card)]'
                }`}
                style={{ boxShadow: 'var(--shadow-card)' }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px]">{item.tag}</span>
                    {item.isNew && (
                      <span className="text-[9px] px-1.5 py-0.5 bg-[var(--color-primary)] text-white rounded font-bold">NEW</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[var(--color-muted)]">{item.type}</span>
                    {/* 播放状态指示 */}
                    {isActive && player.isPlaying && (
                      <div className="flex items-center gap-0.5">
                        <div className="w-0.5 h-3 bg-[var(--color-primary)] rounded-full animate-pulse" />
                        <div className="w-0.5 h-2 bg-[var(--color-primary)] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <div className="w-0.5 h-3.5 bg-[var(--color-primary)] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                      </div>
                    )}
                  </div>
                </div>
                <h4 className={`text-[15px] font-semibold mb-1 ${
                  isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-foreground)]'
                }`}>{item.title}</h4>
                <p className="text-[12px] text-[var(--color-muted)] line-clamp-2 mb-2">{item.desc}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[11px] text-[var(--color-muted)]">
                    <span>⏱ {item.duration}</span>
                    <span>▶ {item.plays.toLocaleString()} 次</span>
                  </div>
                  {isActive ? (
                    player.isPlaying
                      ? <Pause size={16} className="text-[var(--color-primary)]" />
                      : <Play size={16} className="text-[var(--color-primary)]" />
                  ) : (
                    <ChevronRight size={16} className="text-[var(--color-muted)]" />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
