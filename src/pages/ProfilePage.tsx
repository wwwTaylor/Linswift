import { ChevronRight, Settings, Bell, Shield, Info, LogOut, Flame, BookOpen, Clock } from 'lucide-react'

/**
 * 个人页
 * 设计稿参考：screen-profile
 * - 用户头像 + 昵称 + 等级
 * - 学习统计三卡片
 * - 设置菜单列表
 * - 退出登录按钮
 */

// 设置菜单项数据
const menuItems = [
  { icon: Settings, label: '学习设置', desc: '每日目标、提醒时间' },
  { icon: Bell, label: '通知设置', desc: '推送通知管理' },
  { icon: Shield, label: '隐私设置', desc: '数据与账号安全' },
  { icon: Info, label: '关于我们', desc: 'Linswift v1.0.0' },
]

export default function ProfilePage() {
  return (
    <div className="flex flex-col h-full">
      {/* ===== Header ===== */}
      <div className="px-5 py-4">
        <h1 className="text-[20px] font-bold text-[var(--color-foreground)] font-secondary">个人</h1>
      </div>

      {/* ===== 用户信息卡片 ===== */}
      <div className="mx-5 mb-4 flex items-center gap-4">
        {/* 头像 */}
        <div className="w-[60px] h-[60px] rounded-full bg-[var(--color-primary)] flex items-center justify-center shrink-0">
          <span className="text-white text-[24px] font-bold">L</span>
        </div>
        {/* 信息 */}
        <div className="flex-1">
          <h2 className="text-[18px] font-bold text-[var(--color-foreground)]">Linswift 用户</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[12px] px-2 py-0.5 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] font-semibold">
              Lv.5
            </span>
            <span className="text-[12px] text-[var(--color-muted)]">持续进步中</span>
          </div>
        </div>
        <ChevronRight size={20} className="text-[var(--color-muted)] shrink-0" />
      </div>

      {/* ===== 学习统计 ===== */}
      <div className="grid grid-cols-3 gap-3 mx-5 mb-5">
        <StatCard icon={Flame} value="128" label="学习天数" color="#FF8400" />
        <StatCard icon={BookOpen} value="4,200" label="词汇量" color="#3B82F6" />
        <StatCard icon={Clock} value="56h" label="学习时长" color="#22C55E" />
      </div>

      {/* ===== 设置菜单 ===== */}
      <div className="mx-5 bg-[var(--color-card)] rounded-[var(--radius-md)] overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
        {menuItems.map((item, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 px-4 py-3.5 ${
              i < menuItems.length - 1 ? 'border-b border-[var(--color-border)]' : ''
            }`}
          >
            <div className="w-9 h-9 rounded-[10px] bg-[var(--color-background-secondary)] flex items-center justify-center shrink-0">
              <item.icon size={18} className="text-[var(--color-muted)]" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-medium text-[var(--color-foreground)]">{item.label}</p>
              <p className="text-[11px] text-[var(--color-muted)]">{item.desc}</p>
            </div>
            <ChevronRight size={16} className="text-[var(--color-muted)] shrink-0" />
          </div>
        ))}
      </div>

      {/* ===== 退出登录 ===== */}
      <div className="mx-5 mt-5 mb-6">
        <button className="w-full py-3 text-[14px] font-medium text-[var(--color-error)] bg-[var(--color-error)]/5 rounded-[var(--radius-sm)] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
          <LogOut size={16} />
          退出登录
        </button>
      </div>
    </div>
  )
}

/* ===== 统计卡片子组件 ===== */
interface StatCardProps {
  icon: React.ElementType
  value: string
  label: string
  color: string
}

function StatCard({ icon: Icon, value, label, color }: StatCardProps) {
  return (
    <div
      className="flex flex-col items-center gap-1.5 py-4 rounded-[var(--radius-md)] bg-[var(--color-card)]"
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <Icon size={20} style={{ color }} />
      <span className="text-[18px] font-bold" style={{ color }}>{value}</span>
      <span className="text-[11px] text-[var(--color-muted)]">{label}</span>
    </div>
  )
}
