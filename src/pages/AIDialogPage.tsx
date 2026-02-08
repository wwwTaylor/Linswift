import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft, Mic, Send, Coffee, Loader2, AlertCircle,
} from 'lucide-react'
import { chat as geminiChat } from '../services/gemini'

/**
 * AI 场景对话 —— 口语模块（接入 Gemini）
 * 功能：
 *  1. 场景 Banner
 *  2. 聊天式对话：AI（白底） + 用户（橙底）
 *  3. 自动纠错卡片
 *  4. 建议回复选项
 *  5. 底部输入栏：麦克风 + 文本输入（Gemini 驱动）
 */

// ===== 消息类型 =====
interface Message {
  role: 'ai' | 'user'
  text: string
  correction?: { original: string; better: string; tip: string } // AI 纠错
}

// ===== 初始对话 =====
const initialMessages: Message[] = [
  { role: 'ai', text: "Welcome to the coffee shop! ☕ What can I get for you today?" },
]

// ===== 建议回复 =====
const suggestions = [
  "I'd like a latte, please.",
  "Can I see the menu?",
  "What's your recommendation?",
]

export default function AIDialogPage() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // ===== 发送消息（调用 Gemini）=====
  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return

    // 添加用户消息
    const userMsg: Message = { role: 'user', text: text.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInputText('')
    setIsLoading(true)

    try {
      // 构建对话历史发给 Gemini
      const history = newMessages.map(m => ({
        role: (m.role === 'ai' ? 'model' : 'user') as 'model' | 'user',
        text: m.text,
      }))

      // 添加纠错指令
      history.push({
        role: 'user' as const,
        text: `(系统指令，用户不可见) 你是咖啡店店员，继续对话。同时检查用户上一句话的语法，如果有错误，请在回复末尾添加以下格式的纠正（一定要有）：
[CORRECTION]
original: 用户的原句
better: 更好的表达
tip: 简短的中文提示
[/CORRECTION]
如果用户的句子没有语法错误，则不需要添加 CORRECTION 部分。
请继续用英文回复顾客。`
      })

      const response = await geminiChat(history)

      // 解析纠错信息
      let aiText = response
      let correction: Message['correction'] = undefined

      const correctionMatch = response.match(/\[CORRECTION\]([\s\S]*?)\[\/CORRECTION\]/)
      if (correctionMatch) {
        aiText = response.replace(/\[CORRECTION\][\s\S]*?\[\/CORRECTION\]/, '').trim()
        const lines = correctionMatch[1].trim().split('\n')
        const orig = lines.find(l => l.startsWith('original:'))?.replace('original:', '').trim() || ''
        const better = lines.find(l => l.startsWith('better:'))?.replace('better:', '').trim() || ''
        const tip = lines.find(l => l.startsWith('tip:'))?.replace('tip:', '').trim() || ''
        if (orig && better) {
          correction = { original: orig, better, tip }
        }
      }

      const aiMsg: Message = { role: 'ai', text: aiText, correction }
      setMessages(prev => [...prev, aiMsg])
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I had trouble understanding. Could you try again?' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      {/* ===== Header ===== */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--color-border)]">
        <button onClick={() => navigate(-1)} className="p-1">
          <ChevronLeft size={24} className="text-[var(--color-foreground)]" />
        </button>
        <div className="flex-1">
          <h1 className="text-[16px] font-bold text-[var(--color-foreground)] font-secondary">AI 场景对话</h1>
          <p className="text-[11px] text-[var(--color-muted)]">☕ 咖啡店点单 · Powered by Gemini</p>
        </div>
      </div>

      {/* ===== 场景 Banner ===== */}
      <div className="mx-5 mt-3 mb-2 p-3 rounded-[var(--radius-sm)] bg-[var(--color-primary-light)] flex items-center gap-3">
        <Coffee size={20} className="text-[var(--color-primary)] shrink-0" />
        <p className="text-[12px] text-[var(--color-foreground)]">
          你正在一家咖啡店，用英语与店员（小林）进行对话练习
        </p>
      </div>

      {/* ===== 对话区域 ===== */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i}>
            {/* 消息气泡 */}
            <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-[16px] ${
                msg.role === 'user'
                  ? 'bg-[var(--color-primary)] text-white rounded-br-[4px]'
                  : 'bg-[var(--color-background-secondary)] text-[var(--color-foreground)] rounded-bl-[4px]'
              }`}>
                <p className="text-[14px] leading-relaxed">{msg.text}</p>
              </div>
            </div>

            {/* 纠错卡片 */}
            {msg.correction && (
              <div className="mt-2 ml-0 p-3 bg-[var(--color-error)]/5 border border-[var(--color-error)]/15 rounded-[var(--radius-sm)]">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <AlertCircle size={12} className="text-[var(--color-error)]" />
                  <span className="text-[11px] font-semibold text-[var(--color-error)]">表达优化</span>
                </div>
                <p className="text-[12px] text-[var(--color-muted)] mb-0.5">
                  你说: <span className="text-[var(--color-error)]">{msg.correction.original}</span>
                </p>
                <p className="text-[12px] text-[var(--color-foreground)]">
                  更好: <span className="text-[var(--color-success)] font-semibold">{msg.correction.better}</span>
                </p>
                {msg.correction.tip && (
                  <p className="text-[11px] text-[var(--color-muted)] mt-1">💡 {msg.correction.tip}</p>
                )}
              </div>
            )}
          </div>
        ))}

        {/* 加载中指示器 */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="px-4 py-3 bg-[var(--color-background-secondary)] rounded-[16px] rounded-bl-[4px]">
              <Loader2 size={18} className="text-[var(--color-muted)] animate-spin" />
            </div>
          </div>
        )}
      </div>

      {/* ===== 建议回复 ===== */}
      {messages.length <= 2 && (
        <div className="px-5 pb-2 flex gap-2 overflow-x-auto">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => sendMessage(s)}
              className="shrink-0 px-3 py-2 bg-[var(--color-background-secondary)] rounded-full text-[12px] text-[var(--color-foreground)] active:bg-[var(--color-primary-light)] transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* ===== 底部输入栏 ===== */}
      <div className="px-5 py-3 border-t border-[var(--color-border)] flex items-center gap-3 bg-[var(--color-card)]">
        <button className="p-2.5 rounded-full bg-[var(--color-primary-light)] shrink-0">
          <Mic size={18} className="text-[var(--color-primary)]" />
        </button>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(inputText) }}
          placeholder="Type your reply..."
          className="flex-1 bg-[var(--color-background-secondary)] rounded-full px-4 py-2.5 text-[14px] text-[var(--color-foreground)] placeholder:text-[var(--color-muted-light)] outline-none"
        />
        <button
          onClick={() => sendMessage(inputText)}
          disabled={!inputText.trim() || isLoading}
          className="p-2.5 rounded-full bg-[var(--color-primary)] disabled:opacity-50 shrink-0 active:scale-95 transition-transform"
        >
          <Send size={16} className="text-white" />
        </button>
      </div>
    </div>
  )
}
