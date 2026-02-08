import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft, Play, Pause, SkipForward, Volume2, ChevronRight,
} from 'lucide-react'

/**
 * 随行听 —— 听力模块
 * 功能：
 *  1. "正在播放" 卡片
 *  2. 分类标签：推荐 / TED / 新闻 / 课程 / 学习
 *  3. 内容列表（标题、来源、时长、难度）
 */

// ===== 分类标签 =====
const categories = ['推荐', 'TED', '新闻', '课程', '学习']

// ===== 内容列表 =====
const contentList = [
  { title: 'The Power of Vulnerability', source: 'TED Talk · Brené Brown', duration: '20:19', difficulty: 'B1', vocab: 45, thumb: '🎤' },
  { title: 'How AI is Transforming Education', source: 'TED Talk · Sal Khan', duration: '15:30', difficulty: 'B2', vocab: 62, thumb: '🤖' },
  { title: 'BBC World News Update', source: 'BBC News', duration: '8:00', difficulty: 'B2', vocab: 38, thumb: '📰' },
  { title: 'English Grammar in Context', source: 'Cambridge Course', duration: '12:45', difficulty: 'A2', vocab: 20, thumb: '📚' },
  { title: 'Daily English Conversation', source: 'Learning Podcast', duration: '10:00', difficulty: 'A2', vocab: 15, thumb: '💬' },
  { title: 'Science Friday Highlights', source: 'NPR', duration: '25:10', difficulty: 'C1', vocab: 78, thumb: '🔬' },
]

export default function ListenGoPage() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('推荐')
  const [isPlaying, setIsPlaying] = useState(true)

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      {/* ===== Header ===== */}
      <div className="flex items-center gap-3 px-5 py-4">
        <button onClick={() => navigate(-1)} className="p-1">
          <ChevronLeft size={24} className="text-[var(--color-foreground)]" />
        </button>
        <h1 className="text-[18px] font-bold text-[var(--color-foreground)] font-secondary">随行听</h1>
      </div>

      {/* ===== 正在播放卡片 ===== */}
      <div className="mx-5 mb-4 p-4 rounded-[var(--radius-md)] text-white"
        style={{ background: 'linear-gradient(135deg, #3B82F6, #6366F1)' }}>
        <p className="text-[11px] text-white/70 mb-1">正在播放</p>
        <h3 className="text-[16px] font-bold mb-1">The Power of Vulnerability</h3>
        <p className="text-[12px] text-white/80 mb-3">Brené Brown · TED Talk</p>
        {/* 进度 */}
        <div className="h-1 bg-white/20 rounded-full mb-2">
          <div className="h-full bg-white rounded-full" style={{ width: '35%' }} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-white/60">7:06 / 20:19</span>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white" />}
            </button>
            <button><SkipForward size={18} className="text-white/80" /></button>
            <button><Volume2 size={18} className="text-white/80" /></button>
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
          {contentList.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 bg-[var(--color-card)] rounded-[var(--radius-sm)] cursor-pointer active:bg-[var(--color-background-secondary)] transition-colors"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              {/* 缩略图 */}
              <div className="w-12 h-12 rounded-[10px] bg-[var(--color-primary-light)] flex items-center justify-center shrink-0">
                <span className="text-[20px]">{item.thumb}</span>
              </div>
              {/* 信息 */}
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[var(--color-foreground)] line-clamp-1">{item.title}</p>
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
          ))}
        </div>
      </div>
    </div>
  )
}
