import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft, Upload, BookOpen, Clock, ChevronRight, Search, MoreVertical,
} from 'lucide-react'

/**
 * 书架页 —— 阅读器模块入口
 * 功能：
 *  1. 导入 PDF 按钮
 *  2. 书架网格展示书籍封面
 *  3. 最近阅读记录
 *  4. 搜索书籍
 */

// ===== 模拟书籍数据 =====
const books = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', progress: 65, cover: '📘' },
  { id: 2, title: 'Sapiens', author: 'Yuval Noah Harari', progress: 30, cover: '📗' },
  { id: 3, title: 'Steve Jobs', author: 'Walter Isaacson', progress: 0, cover: '📙' },
  { id: 4, title: '1984', author: 'George Orwell', progress: 100, cover: '📕' },
  { id: 5, title: 'Atomic Habits', author: 'James Clear', progress: 12, cover: '📒' },
  { id: 6, title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', progress: 0, cover: '📓' },
]

// ===== 最近阅读记录 =====
const recentReads = [
  { title: 'The Great Gatsby', chapter: 'Chapter 5', time: '30 分钟前', progress: 65 },
  { title: 'Sapiens', chapter: 'Part 2: Agriculture', time: '昨天', progress: 30 },
  { title: '1984', chapter: '已读完', time: '3 天前', progress: 100 },
]

export default function BookshelfPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  // 搜索过滤
  const filteredBooks = books.filter(b =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.author.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between px-5 py-4">
        <button onClick={() => navigate(-1)} className="p-1">
          <ChevronLeft size={24} className="text-[var(--color-foreground)]" />
        </button>
        <h1 className="text-[18px] font-bold text-[var(--color-foreground)] font-secondary">书架</h1>
        <button className="p-1">
          <MoreVertical size={20} className="text-[var(--color-muted)]" />
        </button>
      </div>

      {/* ===== 搜索栏 ===== */}
      <div className="px-5 mb-4">
        <div className="flex items-center gap-3 bg-[var(--color-background-secondary)] rounded-[var(--radius-sm)] px-4 py-2.5">
          <Search size={18} className="text-[var(--color-muted)] shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索书籍..."
            className="flex-1 bg-transparent text-[14px] text-[var(--color-foreground)] placeholder:text-[var(--color-muted-light)] outline-none"
          />
        </div>
      </div>

      {/* ===== 导入按钮 ===== */}
      <div className="px-5 mb-5">
        <button className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-dashed border-[var(--color-primary)]/30 rounded-[var(--radius-md)] text-[var(--color-primary)] active:bg-[var(--color-primary-light)] transition-colors">
          <Upload size={18} />
          <span className="text-[14px] font-semibold">导入 PDF 书籍</span>
        </button>
      </div>

      {/* ===== 最近阅读 ===== */}
      <div className="px-5 mb-5">
        <h3 className="text-[16px] font-bold text-[var(--color-foreground)] mb-3 font-secondary">最近阅读</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5">
          {recentReads.map((item, i) => (
            <div
              key={i}
              className="shrink-0 w-[220px] p-3.5 bg-[var(--color-card)] rounded-[var(--radius-md)] cursor-pointer active:scale-[0.98] transition-transform"
              style={{ boxShadow: 'var(--shadow-card)' }}
              onClick={() => navigate('/reading-prep')}
            >
              <div className="flex items-center gap-2 mb-2">
                <Clock size={14} className="text-[var(--color-muted)]" />
                <span className="text-[11px] text-[var(--color-muted)]">{item.time}</span>
              </div>
              <p className="text-[14px] font-semibold text-[var(--color-foreground)] line-clamp-1">{item.title}</p>
              <p className="text-[12px] text-[var(--color-muted)] mt-0.5">{item.chapter}</p>
              {/* 进度条 */}
              <div className="mt-2 h-1.5 bg-[var(--color-background-secondary)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${item.progress}%`,
                    backgroundColor: item.progress === 100 ? '#22C55E' : '#FF8400',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== 书架网格 ===== */}
      <div className="px-5 pb-8">
        <h3 className="text-[16px] font-bold text-[var(--color-foreground)] mb-3 font-secondary">全部书籍</h3>
        <div className="grid grid-cols-3 gap-3">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="flex flex-col items-center cursor-pointer active:scale-[0.96] transition-transform"
              onClick={() => navigate('/reading-prep')}
            >
              {/* 封面 */}
              <div
                className="w-full aspect-[3/4] rounded-[var(--radius-sm)] bg-[var(--color-primary-light)] flex items-center justify-center mb-2 relative overflow-hidden"
                style={{ boxShadow: 'var(--shadow-card)' }}
              >
                <span className="text-[36px]">{book.cover}</span>
                {/* 进度指示 */}
                {book.progress > 0 && book.progress < 100 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-background-secondary)]">
                    <div className="h-full bg-[var(--color-primary)]" style={{ width: `${book.progress}%` }} />
                  </div>
                )}
                {book.progress === 100 && (
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-[var(--color-success)] rounded text-[9px] text-white font-bold">
                    已读完
                  </div>
                )}
              </div>
              {/* 信息 */}
              <p className="text-[12px] font-medium text-[var(--color-foreground)] text-center line-clamp-1 w-full">{book.title}</p>
              <p className="text-[10px] text-[var(--color-muted)] text-center line-clamp-1 w-full">{book.author}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
