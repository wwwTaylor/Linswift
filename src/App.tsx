import { Routes, Route, Navigate } from 'react-router-dom'

// ===== 布局组件 =====
import AppShell from './components/layout/AppShell'

// ===== Phase 1: 核心页面 =====
import LoginPage from './pages/LoginPage'
import LearnPage from './pages/LearnPage'
import TranslatePage from './pages/TranslatePage'
import VocabPage from './pages/VocabPage'
import ProfilePage from './pages/ProfilePage'

// ===== Phase 2: 阅读器模块 =====
import BookshelfPage from './pages/BookshelfPage'
import ReadingPrepPage from './pages/ReadingPrepPage'
import FlashcardPage from './pages/FlashcardPage'
import ReadingPage from './pages/ReadingPage'

// ===== Phase 2: 背单词模块 =====
import EbbinghausPage from './pages/EbbinghausPage'
import VocabGamePage from './pages/VocabGamePage'
import AIMemoPage from './pages/AIMemoPage'

// ===== Phase 3: 听力模块 =====
import ListeningHubPage from './pages/ListeningHubPage'
import ListenFillPage from './pages/ListenFillPage'
import ListenGoPage from './pages/ListenGoPage'
import ListenLibPage from './pages/ListenLibPage'

// ===== Phase 3: 口语模块 =====
import SpeakingHubPage from './pages/SpeakingHubPage'
import RetellPage from './pages/RetellPage'
import AIDialogPage from './pages/AIDialogPage'
import SceneSelectPage from './pages/SceneSelectPage'

// ===== Phase 4: 语法 + 词汇测试 =====
import GrammarTreePage from './pages/GrammarTreePage'
import ReadingTestPage from './pages/ReadingTestPage'
import VocabTestPage from './pages/VocabTestPage'
import AIClassifyPage from './pages/AIClassifyPage'

/**
 * 应用路由配置
 * - /login: 登录页（无底部导航）
 * - /: 主应用（带底部导航，包含 4 个 Tab）
 * - 其余页面：独立全屏页面（无底部导航，自带返回按钮）
 */
export default function App() {
  return (
    <Routes>
      {/* ===== 登录页（无底部导航）===== */}
      <Route path="/login" element={<LoginPage />} />

      {/* ===== 主应用（带底部导航）===== */}
      <Route path="/" element={<AppShell />}>
        <Route index element={<Navigate to="/learn" replace />} />
        <Route path="learn" element={<LearnPage />} />
        <Route path="translate" element={<TranslatePage />} />
        <Route path="vocab" element={<VocabPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* ===== 独立页面（无底部导航，全屏布局）===== */}
      {/* 阅读器模块 */}
      <Route path="/bookshelf" element={<BookshelfPage />} />
      <Route path="/reading-prep" element={<ReadingPrepPage />} />
      <Route path="/flashcard" element={<FlashcardPage />} />
      <Route path="/reading" element={<ReadingPage />} />

      {/* 背单词模块 */}
      <Route path="/ebbinghaus" element={<EbbinghausPage />} />
      <Route path="/vocab-game" element={<VocabGamePage />} />
      <Route path="/ai-memo" element={<AIMemoPage />} />

      {/* 听力模块 */}
      <Route path="/listening" element={<ListeningHubPage />} />
      <Route path="/listen-fill" element={<ListenFillPage />} />
      <Route path="/listen-go" element={<ListenGoPage />} />
      <Route path="/listen-lib" element={<ListenLibPage />} />

      {/* 口语模块 */}
      <Route path="/speaking" element={<SpeakingHubPage />} />
      <Route path="/retell" element={<RetellPage />} />
      <Route path="/ai-dialog" element={<AIDialogPage />} />
      <Route path="/scene-select" element={<SceneSelectPage />} />

      {/* 语法 + 测试 */}
      <Route path="/grammar" element={<GrammarTreePage />} />
      <Route path="/reading-test" element={<ReadingTestPage />} />
      <Route path="/vocab-test" element={<VocabTestPage />} />
      <Route path="/ai-classify" element={<AIClassifyPage />} />
    </Routes>
  )
}
