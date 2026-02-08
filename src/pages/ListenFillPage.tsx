import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft, Play, Pause, SkipBack, SkipForward, Check, X as XIcon,
} from 'lucide-react'

/**
 * 听歌填字 —— 听力模块
 * 功能：
 *  1. 专辑封面 + 歌曲信息
 *  2. 播放控制
 *  3. 歌词填空（多种状态：待填、正确、错误、输入中）
 */

// ===== 歌词填空数据 =====
const lyrics = [
  { text: "The club isn't the best place to find a ___", answer: 'lover', status: 'correct' as const },
  { text: "So the bar is where I ___", answer: 'go', status: 'correct' as const },
  { text: "Me and my friends at the table doing ___", answer: 'shots', status: 'wrong' as const },
  { text: "Drinking fast and then we talk ___", answer: 'slow', status: 'active' as const },
  { text: "Come over and start up a ___ with just me", answer: 'conversation', status: 'locked' as const },
  { text: "And trust me I'll give it a ___ now", answer: 'chance', status: 'locked' as const },
]

export default function ListenFillPage() {
  const navigate = useNavigate()
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeInput, setActiveInput] = useState('')
  const [progress] = useState(45) // 播放进度百分比

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      {/* ===== Header ===== */}
      <div className="flex items-center gap-3 px-5 py-4">
        <button onClick={() => navigate(-1)} className="p-1">
          <ChevronLeft size={24} className="text-[var(--color-foreground)]" />
        </button>
        <h1 className="text-[18px] font-bold text-[var(--color-foreground)] font-secondary">听歌填字</h1>
      </div>

      {/* ===== 专辑封面 + 信息 ===== */}
      <div className="flex flex-col items-center px-5 mb-5">
        <div className="w-[160px] h-[160px] rounded-[20px] bg-gradient-to-br from-[#FF6B6B] to-[#FF8400] flex items-center justify-center mb-4"
          style={{ boxShadow: '0 8px 30px rgba(255,132,0,0.3)' }}>
          <span className="text-[60px]">🎵</span>
        </div>
        <h2 className="text-[18px] font-bold text-[var(--color-foreground)]">Shape of You</h2>
        <p className="text-[13px] text-[var(--color-muted)]">Ed Sheeran</p>
      </div>

      {/* ===== 播放进度条 ===== */}
      <div className="px-8 mb-3">
        <div className="h-1 bg-[var(--color-background-secondary)] rounded-full overflow-hidden">
          <div className="h-full bg-[var(--color-primary)] rounded-full" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-[var(--color-muted)]">1:45</span>
          <span className="text-[10px] text-[var(--color-muted)]">3:54</span>
        </div>
      </div>

      {/* ===== 播放控制 ===== */}
      <div className="flex items-center justify-center gap-8 mb-6">
        <button className="p-2"><SkipBack size={22} className="text-[var(--color-foreground)]" /></button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-14 h-14 rounded-full bg-[var(--color-primary)] flex items-center justify-center active:scale-95 transition-transform"
        >
          {isPlaying ? <Pause size={24} className="text-white" /> : <Play size={24} className="text-white ml-1" />}
        </button>
        <button className="p-2"><SkipForward size={22} className="text-[var(--color-foreground)]" /></button>
      </div>

      {/* ===== 歌词填空区域 ===== */}
      <div className="flex-1 px-5 overflow-y-auto pb-8">
        <h3 className="text-[14px] font-bold text-[var(--color-foreground)] mb-3 font-secondary">歌词填空</h3>
        <div className="space-y-3">
          {lyrics.map((line, i) => {
            // 将 ___ 替换为输入框或状态标签
            const parts = line.text.split('___')

            return (
              <div key={i} className={`p-3 rounded-[var(--radius-sm)] ${
                line.status === 'active' ? 'bg-[var(--color-primary-light)] border border-[var(--color-primary)]/30' :
                line.status === 'correct' ? 'bg-[var(--color-success)]/5' :
                line.status === 'wrong' ? 'bg-[var(--color-error)]/5' :
                'bg-[var(--color-background-secondary)] opacity-60'
              }`}>
                <p className="text-[14px] text-[var(--color-foreground)] leading-relaxed">
                  {parts[0]}
                  {line.status === 'active' ? (
                    <input
                      type="text"
                      value={activeInput}
                      onChange={(e) => setActiveInput(e.target.value)}
                      className="inline-block w-[120px] mx-1 px-2 py-0.5 border-b-2 border-[var(--color-primary)] bg-transparent text-[var(--color-primary)] font-semibold outline-none text-center"
                      placeholder="填写..."
                      autoFocus
                    />
                  ) : line.status === 'correct' ? (
                    <span className="inline-flex items-center gap-1 mx-1 px-2 py-0.5 bg-[var(--color-success)]/10 rounded text-[var(--color-success)] font-semibold">
                      {line.answer} <Check size={12} />
                    </span>
                  ) : line.status === 'wrong' ? (
                    <span className="inline-flex items-center gap-1 mx-1">
                      <span className="px-2 py-0.5 bg-[var(--color-error)]/10 rounded text-[var(--color-error)] font-semibold line-through">shots</span>
                      <span className="px-2 py-0.5 bg-[var(--color-success)]/10 rounded text-[var(--color-success)] font-semibold">{line.answer}</span>
                      <XIcon size={12} className="text-[var(--color-error)]" />
                    </span>
                  ) : (
                    <span className="inline-block mx-1 w-[80px] border-b border-dashed border-[var(--color-muted)] text-center text-[var(--color-muted)]">
                      ···
                    </span>
                  )}
                  {parts[1]}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
