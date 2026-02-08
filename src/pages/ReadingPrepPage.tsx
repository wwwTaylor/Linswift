import { useNavigate } from 'react-router-dom'
import { ChevronLeft, BookOpen, GraduationCap, Volume2 } from 'lucide-react'

/**
 * 阅读准备页
 * 进入阅读前，展示 AI 总结的陌生词汇列表
 * 用户可选择"先学习"（进入卡片学习）或"直接阅读"
 */

// ===== 模拟从 AI 识别出的陌生词汇 =====
const unfamiliarWords = [
  { word: 'extravagant', phonetic: '/ɪkˈstræv.ə.ɡənt/', meaning: '奢侈的；铺张的', difficulty: 'B2' },
  { word: 'melancholy', phonetic: '/ˈmel.ən.kɑː.li/', meaning: '忧郁的；悲伤的', difficulty: 'C1' },
  { word: 'disillusion', phonetic: '/ˌdɪs.ɪˈluː.ʒən/', meaning: '幻灭；醒悟', difficulty: 'B2' },
  { word: 'conspicuous', phonetic: '/kənˈspɪk.ju.əs/', meaning: '显眼的；引人注目的', difficulty: 'C1' },
  { word: 'supercilious', phonetic: '/ˌsuː.pəˈsɪl.i.əs/', meaning: '目中无人的；傲慢的', difficulty: 'C2' },
  { word: 'incarnation', phonetic: '/ˌɪn.kɑːˈneɪ.ʃən/', meaning: '化身；典型', difficulty: 'B2' },
  { word: 'permeate', phonetic: '/ˈpɜː.mi.eɪt/', meaning: '渗透；弥漫', difficulty: 'C1' },
  { word: 'impetuous', phonetic: '/ɪmˈpetʃ.u.əs/', meaning: '冲动的；鲁莽的', difficulty: 'C1' },
]

export default function ReadingPrepPage() {
  const navigate = useNavigate()

  // 难度颜色映射
  const difficultyColor = (level: string) => {
    switch (level) {
      case 'B2': return '#FF8400'
      case 'C1': return '#8B5CF6'
      case 'C2': return '#EF4444'
      default: return '#888888'
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      {/* ===== Header ===== */}
      <div className="flex items-center gap-3 px-5 py-4">
        <button onClick={() => navigate(-1)} className="p-1">
          <ChevronLeft size={24} className="text-[var(--color-foreground)]" />
        </button>
        <h1 className="text-[18px] font-bold text-[var(--color-foreground)] font-secondary">阅读准备</h1>
      </div>

      {/* ===== 书籍信息卡片 ===== */}
      <div className="mx-5 mb-4 p-4 bg-[var(--color-primary-light)] rounded-[var(--radius-md)] flex items-center gap-4"
        style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="w-[50px] h-[65px] rounded-[8px] bg-[var(--color-primary)]/20 flex items-center justify-center shrink-0">
          <BookOpen size={24} className="text-[var(--color-primary)]" />
        </div>
        <div>
          <h2 className="text-[16px] font-bold text-[var(--color-foreground)]">The Great Gatsby</h2>
          <p className="text-[12px] text-[var(--color-muted)] mt-0.5">Chapter 5 · 预计阅读 15 分钟</p>
          <p className="text-[12px] text-[var(--color-primary)] font-semibold mt-1">
            AI 检测到 {unfamiliarWords.length} 个陌生词汇
          </p>
        </div>
      </div>

      {/* ===== 陌生词汇列表 ===== */}
      <div className="flex-1 px-5 overflow-y-auto">
        <h3 className="text-[14px] font-bold text-[var(--color-foreground)] mb-3 font-secondary">
          建议先学习以下词汇
        </h3>
        <div className="space-y-2">
          {unfamiliarWords.map((w, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 bg-[var(--color-card)] rounded-[var(--radius-sm)]"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              {/* 序号 */}
              <div className="w-6 h-6 rounded-full bg-[var(--color-background-secondary)] flex items-center justify-center shrink-0">
                <span className="text-[11px] font-bold text-[var(--color-muted)]">{i + 1}</span>
              </div>
              {/* 单词信息 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-semibold text-[var(--color-foreground)]">{w.word}</span>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded font-bold"
                    style={{ color: difficultyColor(w.difficulty), backgroundColor: `${difficultyColor(w.difficulty)}15` }}
                  >
                    {w.difficulty}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--color-muted)]">{w.phonetic}</p>
                <p className="text-[12px] text-[var(--color-foreground)] mt-0.5">{w.meaning}</p>
              </div>
              {/* 发音按钮 */}
              <button className="p-1.5 shrink-0">
                <Volume2 size={16} className="text-[var(--color-muted)]" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ===== 底部操作按钮 ===== */}
      <div className="px-5 py-4 flex gap-3 bg-[var(--color-background)] border-t border-[var(--color-border)]">
        {/* 先学习 → 进入卡片学习页 */}
        <button
          onClick={() => navigate('/flashcard')}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[var(--color-primary)] text-white rounded-[var(--radius-sm)] font-semibold text-[14px] active:scale-[0.98] transition-transform"
        >
          <GraduationCap size={18} />
          先学习词汇
        </button>
        {/* 直接阅读 → 进入阅读界面 */}
        <button
          onClick={() => navigate('/reading')}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[var(--color-background-secondary)] text-[var(--color-foreground)] rounded-[var(--radius-sm)] font-semibold text-[14px] active:scale-[0.98] transition-transform"
        >
          <BookOpen size={18} />
          直接阅读
        </button>
      </div>
    </div>
  )
}
