import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft, Play, Pause, Mic, RotateCcw, ChevronRight,
} from 'lucide-react'

/**
 * 复述练习 —— 口语模块
 * 功能：
 *  1. 进度条（当前/总数）
 *  2. 原文听力区：英文文本 + 播放按钮
 *  3. 你的复述区：文本 + 评分（准确率/流利度/语调）
 *  4. 差异对比
 *  5. 重新复述 / 下一句
 */

// ===== 练习句子数据 =====
const sentences = [
  {
    original: "The key to effective communication is not just speaking clearly, but also listening actively to others.",
    userText: "The key to effective communication is not just speaking clearly, but also listening actively to others.",
    accuracy: 95, fluency: 88, intonation: 82,
  },
  {
    original: "In today's rapidly changing world, the ability to adapt quickly has become more important than ever.",
    userText: "In today's rapidly changing world, the ability to adapt quickly has become more important than before.",
    accuracy: 90, fluency: 85, intonation: 78,
  },
]

export default function RetellPage() {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isRecording, setIsRecording] = useState(false)

  const current = sentences[currentIndex]

  // 简单差异对比：高亮不同的词
  const getDiff = () => {
    const origWords = current.original.split(' ')
    const userWords = current.userText.split(' ')
    return origWords.map((word, i) => ({
      original: word,
      user: userWords[i] || '',
      match: word.toLowerCase() === (userWords[i] || '').toLowerCase(),
    }))
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between px-5 py-4">
        <button onClick={() => navigate(-1)} className="p-1">
          <ChevronLeft size={24} className="text-[var(--color-foreground)]" />
        </button>
        <h1 className="text-[18px] font-bold text-[var(--color-foreground)] font-secondary">复述练习</h1>
        <span className="text-[13px] text-[var(--color-muted)]">{currentIndex + 1}/{sentences.length}</span>
      </div>

      {/* ===== 进度条 ===== */}
      <div className="mx-5 mb-5 h-1.5 bg-[var(--color-background-secondary)] rounded-full overflow-hidden">
        <div className="h-full bg-[var(--color-primary)] rounded-full transition-all" style={{ width: `${((currentIndex + 1) / sentences.length) * 100}%` }} />
      </div>

      {/* ===== 原文区域 ===== */}
      <div className="mx-5 mb-4 p-4 bg-[var(--color-card)] rounded-[var(--radius-md)]" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] text-[var(--color-muted)] font-semibold">📖 原文</span>
          <button onClick={() => setIsPlaying(!isPlaying)} className="p-1.5 rounded-full bg-[var(--color-primary-light)]">
            {isPlaying ? <Pause size={14} className="text-[var(--color-primary)]" /> : <Play size={14} className="text-[var(--color-primary)]" />}
          </button>
        </div>
        <p className="text-[15px] text-[var(--color-foreground)] leading-relaxed">{current.original}</p>
      </div>

      {/* ===== 复述区域 + 评分 ===== */}
      <div className="mx-5 mb-4 p-4 bg-[var(--color-primary-light)] rounded-[var(--radius-md)]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] text-[var(--color-primary)] font-semibold">🎤 你的复述</span>
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`p-2 rounded-full transition-colors ${isRecording ? 'bg-[var(--color-error)] animate-pulse' : 'bg-[var(--color-primary)]'}`}
          >
            <Mic size={14} className="text-white" />
          </button>
        </div>
        <p className="text-[15px] text-[var(--color-foreground)] leading-relaxed mb-3">{current.userText}</p>

        {/* 评分 */}
        <div className="flex gap-3">
          <ScoreBadge label="准确率" value={current.accuracy} color="#22C55E" />
          <ScoreBadge label="流利度" value={current.fluency} color="#3B82F6" />
          <ScoreBadge label="语调" value={current.intonation} color="#8B5CF6" />
        </div>
      </div>

      {/* ===== 差异对比 ===== */}
      <div className="mx-5 mb-4 p-4 bg-[var(--color-card)] rounded-[var(--radius-md)]" style={{ boxShadow: 'var(--shadow-card)' }}>
        <span className="text-[12px] text-[var(--color-muted)] font-semibold mb-2 block">🔍 差异对比</span>
        <p className="text-[14px] leading-relaxed">
          {getDiff().map((d, i) => (
            <span key={i}>
              {d.match ? (
                <span className="text-[var(--color-foreground)]">{d.original} </span>
              ) : (
                <span>
                  <span className="text-[var(--color-error)] line-through">{d.user}</span>{' '}
                  <span className="text-[var(--color-success)] font-semibold">{d.original}</span>{' '}
                </span>
              )}
            </span>
          ))}
        </p>
      </div>

      {/* ===== 底部操作 ===== */}
      <div className="mt-auto px-5 py-4 flex gap-3">
        <button className="flex-1 py-3 bg-[var(--color-background-secondary)] rounded-[var(--radius-sm)] text-[14px] font-semibold text-[var(--color-foreground)] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
          <RotateCcw size={16} /> 重新复述
        </button>
        <button
          onClick={() => setCurrentIndex(prev => Math.min(prev + 1, sentences.length - 1))}
          className="flex-1 py-3 bg-[var(--color-primary)] rounded-[var(--radius-sm)] text-[14px] font-semibold text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          下一句 <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

/* ===== 评分标签 ===== */
function ScoreBadge({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex-1 text-center py-2 bg-white/80 rounded-[var(--radius-xs)]">
      <p className="text-[18px] font-bold" style={{ color }}>{value}%</p>
      <p className="text-[10px] text-[var(--color-muted)]">{label}</p>
    </div>
  )
}
