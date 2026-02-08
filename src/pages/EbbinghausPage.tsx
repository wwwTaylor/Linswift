import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft, Brain, Gamepad2, Sparkles, BookOpen, RotateCcw, Plus, Check,
} from 'lucide-react'

/**
 * 艾宾浩斯记忆规划看板 —— 背单词模块
 * 功能：
 *  1. 7 天复习计划看板（每天新学 + 复习数量）
 *  2. 整体进度条
 *  3. 统计数字：今日待学、待复习、已掌握
 *  4. 学习模式入口：卡片学习、游戏记忆、AI 速记
 *  5. 今日学习清单
 */

// ===== 7 天计划数据 =====
const weekPlan = [
  { day: '周一', newWords: 20, review: 0, done: true },
  { day: '周二', newWords: 20, review: 10, done: true },
  { day: '周三', newWords: 20, review: 15, done: true },
  { day: '周四', newWords: 15, review: 25, done: false, today: true },
  { day: '周五', newWords: 15, review: 30, done: false },
  { day: '周六', newWords: 10, review: 35, done: false },
  { day: '周日', newWords: 0, review: 45, done: false },
]

// ===== 今日学习清单 =====
const todayTasks = [
  { type: '新学', label: '新词汇 Batch #4', count: 15, icon: Plus, color: '#FF8400' },
  { type: '复习', label: '第 1 轮复习 (周一词汇)', count: 10, icon: RotateCcw, color: '#3B82F6' },
  { type: '复习', label: '第 2 轮复习 (周二词汇)', count: 8, icon: RotateCcw, color: '#8B5CF6' },
  { type: '复习', label: '第 3 轮复习 (周三词汇)', count: 7, icon: RotateCcw, color: '#22C55E' },
]

export default function EbbinghausPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* ===== Header ===== */}
      <div className="flex items-center gap-3 px-5 py-4">
        <button onClick={() => navigate(-1)} className="p-1">
          <ChevronLeft size={24} className="text-[var(--color-foreground)]" />
        </button>
        <h1 className="text-[18px] font-bold text-[var(--color-foreground)] font-secondary">背单词</h1>
      </div>

      {/* ===== 统计卡片 ===== */}
      <div className="grid grid-cols-3 gap-3 mx-5 mb-5">
        <StatBox value="15" label="今日待学" color="#FF8400" />
        <StatBox value="25" label="待复习" color="#3B82F6" />
        <StatBox value="180" label="已掌握" color="#22C55E" />
      </div>

      {/* ===== 整体进度 ===== */}
      <div className="mx-5 mb-5 p-4 bg-[var(--color-card)] rounded-[var(--radius-md)]" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-semibold text-[var(--color-foreground)]">本周进度</span>
          <span className="text-[13px] text-[var(--color-primary)] font-bold">180/500 词</span>
        </div>
        <div className="h-2.5 bg-[var(--color-background-secondary)] rounded-full overflow-hidden">
          <div className="h-full bg-[var(--color-primary)] rounded-full" style={{ width: '36%' }} />
        </div>
      </div>

      {/* ===== 7 天计划看板 ===== */}
      <div className="mx-5 mb-5">
        <h3 className="text-[14px] font-bold text-[var(--color-foreground)] mb-3 font-secondary">7 天记忆规划</h3>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5">
          {weekPlan.map((d, i) => (
            <div
              key={i}
              className={`shrink-0 w-[80px] p-3 rounded-[var(--radius-sm)] text-center transition-colors ${
                d.today
                  ? 'bg-[var(--color-primary)] text-white'
                  : d.done
                    ? 'bg-[var(--color-success)]/10'
                    : 'bg-[var(--color-background-secondary)]'
              }`}
            >
              <p className={`text-[12px] font-semibold mb-1 ${d.today ? 'text-white' : 'text-[var(--color-foreground)]'}`}>
                {d.day}
              </p>
              {d.done && <Check size={14} className="text-[var(--color-success)] mx-auto mb-1" />}
              <p className={`text-[10px] ${d.today ? 'text-white/80' : 'text-[var(--color-muted)]'}`}>
                +{d.newWords} 新
              </p>
              <p className={`text-[10px] ${d.today ? 'text-white/80' : 'text-[var(--color-muted)]'}`}>
                {d.review} 复习
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== 学习模式入口 ===== */}
      <div className="mx-5 mb-5">
        <h3 className="text-[14px] font-bold text-[var(--color-foreground)] mb-3 font-secondary">选择学习模式</h3>
        <div className="grid grid-cols-3 gap-3">
          <ModeCard icon={BookOpen} label="卡片学习" desc="经典翻卡" color="#FF8400" onClick={() => navigate('/flashcard')} />
          <ModeCard icon={Gamepad2} label="游戏记忆" desc="趣味闯关" color="#8B5CF6" onClick={() => navigate('/vocab-game')} />
          <ModeCard icon={Sparkles} label="AI 速记" desc="联想记忆" color="#3B82F6" onClick={() => navigate('/ai-memo')} />
        </div>
      </div>

      {/* ===== 今日学习清单 ===== */}
      <div className="mx-5 pb-8">
        <h3 className="text-[14px] font-bold text-[var(--color-foreground)] mb-3 font-secondary flex items-center gap-2">
          <Brain size={16} className="text-[var(--color-primary)]" /> 今日学习清单
        </h3>
        <div className="space-y-2">
          {todayTasks.map((task, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-[var(--color-card)] rounded-[var(--radius-sm)]"
              style={{ boxShadow: 'var(--shadow-card)' }}>
              <div className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${task.color}15` }}>
                <task.icon size={18} style={{ color: task.color }} />
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-[var(--color-foreground)]">{task.label}</p>
                <p className="text-[11px] text-[var(--color-muted)]">{task.type} · {task.count} 词</p>
              </div>
              <button className="px-3 py-1.5 bg-[var(--color-primary-light)] rounded-full text-[12px] font-semibold text-[var(--color-primary)]">
                开始
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ===== 统计数字组件 ===== */
function StatBox({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="flex flex-col items-center gap-1 py-4 bg-[var(--color-card)] rounded-[var(--radius-md)]"
      style={{ boxShadow: 'var(--shadow-card)' }}>
      <span className="text-[22px] font-bold" style={{ color }}>{value}</span>
      <span className="text-[11px] text-[var(--color-muted)]">{label}</span>
    </div>
  )
}

/* ===== 学习模式卡片组件 ===== */
function ModeCard({ icon: Icon, label, desc, color, onClick }: {
  icon: React.ElementType; label: string; desc: string; color: string; onClick: () => void
}) {
  return (
    <button onClick={onClick}
      className="flex flex-col items-center gap-2 py-4 px-2 bg-[var(--color-card)] rounded-[var(--radius-md)] active:scale-[0.96] transition-transform"
      style={{ boxShadow: 'var(--shadow-card)' }}>
      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
        <Icon size={20} style={{ color }} />
      </div>
      <span className="text-[13px] font-semibold text-[var(--color-foreground)]">{label}</span>
      <span className="text-[11px] text-[var(--color-muted)]">{desc}</span>
    </button>
  )
}
