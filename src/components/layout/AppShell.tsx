import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'

/**
 * 主布局壳：
 * - 顶部为页面内容（可滚动）
 * - 底部固定 Tab 导航栏
 * - 限制最大宽度 390px 居中（模拟手机屏幕）
 */
export default function AppShell() {
  return (
    <div className="h-full flex justify-center bg-[var(--color-background-secondary)]">
      {/* 手机容器 */}
      <div className="w-full max-w-[390px] h-full flex flex-col bg-[var(--color-background)] relative overflow-hidden">
        {/* 页面内容区域（可滚动） */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

        {/* 底部导航栏（固定） */}
        <BottomNav />
      </div>
    </div>
  )
}
