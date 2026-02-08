import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft, Play, Pause, BookOpenText, ChevronRight, Plus, Headphones,
} from 'lucide-react'

/**
 * 听·图书馆 —— 听力模块
 * 功能：
 *  1. "正在播放" 状态栏
 *  2. "转化图书为博客" 入口
 *  3. 分类标签：全部 / 图书转化 / AI 原创 / 热门
 *  4. 博客/音频列表
 */

// ===== 分类标签 =====
const categories = ['全部', '图书转化', 'AI 原创', '热门']

// ===== 博客列表数据 =====
const blogList = [
  {
    title: 'The Psychology of Money',
    type: '图书转化', duration: '18:30', plays: 1240,
    desc: '从《金钱心理学》提炼的核心概念和关键洞察',
    tag: '💰 理财', isNew: true,
  },
  {
    title: 'Atomic Habits: Core Principles',
    type: '图书转化', duration: '15:20', plays: 2100,
    desc: '拆解《原子习惯》的四个行为改变法则',
    tag: '🎯 效率', isNew: false,
  },
  {
    title: 'AI in Daily Life',
    type: 'AI 原创', duration: '12:00', plays: 890,
    desc: 'AI 如何改变我们的工作和学习方式',
    tag: '🤖 科技', isNew: true,
  },
  {
    title: 'The Art of Thinking Clearly',
    type: '图书转化', duration: '20:45', plays: 1560,
    desc: '常见的认知偏差和思维陷阱',
    tag: '🧠 思维', isNew: false,
  },
  {
    title: 'Space Exploration 2026',
    type: 'AI 原创', duration: '10:15', plays: 650,
    desc: '人类太空探索的最新进展',
    tag: '🚀 科学', isNew: false,
  },
]

export default function ListenLibPage() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('全部')
  const [isPlaying, setIsPlaying] = useState(false)

  // 按分类过滤
  const filteredList = activeCategory === '全部'
    ? blogList
    : activeCategory === '热门'
      ? [...blogList].sort((a, b) => b.plays - a.plays)
      : blogList.filter(b => b.type === activeCategory)

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      {/* ===== Header ===== */}
      <div className="flex items-center gap-3 px-5 py-4">
        <button onClick={() => navigate(-1)} className="p-1">
          <ChevronLeft size={24} className="text-[var(--color-foreground)]" />
        </button>
        <h1 className="text-[18px] font-bold text-[var(--color-foreground)] font-secondary">听·图书馆</h1>
      </div>

      {/* ===== 正在播放状态栏 ===== */}
      <div className="mx-5 mb-4 p-3 bg-[var(--color-card)] rounded-[var(--radius-sm)] flex items-center gap-3 border border-[var(--color-border)]"
        style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="w-10 h-10 rounded-[8px] bg-[var(--color-primary-light)] flex items-center justify-center shrink-0">
          <Headphones size={18} className="text-[var(--color-primary)]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-[var(--color-foreground)] line-clamp-1">The Psychology of Money</p>
          <p className="text-[11px] text-[var(--color-muted)]">5:30 / 18:30</p>
        </div>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-1.5 shrink-0">
          {isPlaying ? <Pause size={20} className="text-[var(--color-primary)]" /> : <Play size={20} className="text-[var(--color-primary)]" />}
        </button>
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
          {filteredList.map((item, i) => (
            <div
              key={i}
              className="p-4 bg-[var(--color-card)] rounded-[var(--radius-md)] cursor-pointer active:scale-[0.98] transition-transform"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[12px]">{item.tag}</span>
                  {item.isNew && (
                    <span className="text-[9px] px-1.5 py-0.5 bg-[var(--color-primary)] text-white rounded font-bold">NEW</span>
                  )}
                </div>
                <span className="text-[11px] text-[var(--color-muted)]">{item.type}</span>
              </div>
              <h4 className="text-[15px] font-semibold text-[var(--color-foreground)] mb-1">{item.title}</h4>
              <p className="text-[12px] text-[var(--color-muted)] line-clamp-2 mb-2">{item.desc}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-[11px] text-[var(--color-muted)]">
                  <span>⏱ {item.duration}</span>
                  <span>▶ {item.plays.toLocaleString()} 次</span>
                </div>
                <ChevronRight size={16} className="text-[var(--color-muted)]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
