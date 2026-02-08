import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye } from 'lucide-react'

/**
 * 登录页
 * 设计稿参考：fDa5p (APP 登录页)
 * - 全屏橙色背景
 * - 顶部品牌 Logo + 标语
 * - 中下方浮动白色圆角登录卡片
 */
export default function LoginPage() {
  const navigate = useNavigate()

  const handleLogin = () => {
    // 模拟登录：直接跳转到首页
    navigate('/learn')
  }

  return (
    <div className="h-full flex justify-center bg-[var(--color-primary)]">
      <div className="w-full max-w-[390px] h-full flex flex-col relative overflow-hidden">
        {/* ===== 顶部品牌区域 ===== */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 pt-16">
          {/* Logo 圆形 */}
          <div className="w-[72px] h-[72px] rounded-full bg-white/20 flex items-center justify-center mb-4">
            <span className="text-white text-[32px] font-extrabold">L</span>
          </div>
          {/* 品牌名 */}
          <h1 className="text-white text-[28px] font-bold tracking-tight">Linswift</h1>
          {/* 标语 */}
          <p className="text-white/80 text-[14px] mt-2">AI 驱动的智能英语学习</p>
        </div>

        {/* ===== 浮动登录卡片 ===== */}
        <div className="bg-white rounded-t-[28px] px-7 pt-8 pb-10 shadow-lg">
          <h2 className="text-[var(--color-foreground)] text-[20px] font-bold mb-1 font-secondary">
            欢迎回来
          </h2>
          <p className="text-[var(--color-muted)] text-[13px] mb-6">
            登录你的 Linswift 账号继续学习之旅
          </p>

          {/* 邮箱输入框 */}
          <div className="flex items-center gap-3 bg-[var(--color-background-secondary)] rounded-[var(--radius-sm)] px-4 py-3 mb-3">
            <Mail size={18} className="text-[var(--color-muted)] shrink-0" />
            <input
              type="email"
              placeholder="邮箱 / 手机号"
              className="flex-1 bg-transparent text-[14px] text-[var(--color-foreground)] placeholder:text-[var(--color-muted-light)] outline-none"
            />
          </div>

          {/* 密码输入框 */}
          <div className="flex items-center gap-3 bg-[var(--color-background-secondary)] rounded-[var(--radius-sm)] px-4 py-3 mb-5">
            <Lock size={18} className="text-[var(--color-muted)] shrink-0" />
            <input
              type="password"
              placeholder="密码"
              className="flex-1 bg-transparent text-[14px] text-[var(--color-foreground)] placeholder:text-[var(--color-muted-light)] outline-none"
            />
            <Eye size={18} className="text-[var(--color-muted)] shrink-0 cursor-pointer" />
          </div>

          {/* 登录按钮 */}
          <button
            onClick={handleLogin}
            className="w-full py-3.5 bg-[var(--color-primary)] text-white text-[15px] font-semibold rounded-[var(--radius-sm)] active:scale-[0.98] transition-transform"
          >
            登录
          </button>

          {/* 第三方登录 */}
          <div className="flex items-center gap-3 mt-6 mb-4">
            <div className="flex-1 h-px bg-[var(--color-border)]" />
            <span className="text-[12px] text-[var(--color-muted)]">其他方式登录</span>
            <div className="flex-1 h-px bg-[var(--color-border)]" />
          </div>

          <div className="flex justify-center gap-6">
            {/* 微信 */}
            <div className="w-11 h-11 rounded-full bg-[#07C160]/10 flex items-center justify-center">
              <span className="text-[#07C160] text-[18px] font-bold">W</span>
            </div>
            {/* Apple */}
            <div className="w-11 h-11 rounded-full bg-black/5 flex items-center justify-center">
              <span className="text-black text-[18px] font-bold">A</span>
            </div>
            {/* Google */}
            <div className="w-11 h-11 rounded-full bg-[var(--color-info)]/10 flex items-center justify-center">
              <span className="text-[var(--color-info)] text-[18px] font-bold">G</span>
            </div>
          </div>

          {/* 注册入口 */}
          <p className="text-center text-[13px] text-[var(--color-muted)] mt-5">
            还没有账号？
            <span className="text-[var(--color-primary)] font-semibold ml-1 cursor-pointer">注册</span>
          </p>
        </div>
      </div>
    </div>
  )
}
