import { useState, useCallback } from 'react'
import {
  ArrowLeftRight, Star, Volume2, Copy, X, Sparkles, Loader2,
} from 'lucide-react'
import {
  translateText,
  type TranslateResult,
  type UnfamiliarWord,
} from '../services/gemini'

/**
 * 翻译页 —— 已接入 Gemini AI
 * 功能：
 *  1. 输入中文/英文 → Gemini 实时翻译
 *  2. 自动识别翻译结果中的陌生词汇（橙色虚线高亮）
 *  3. 一键收录陌生词汇到词库
 *  4. 收藏 / 发音 / 复制 工具栏
 *  5. 翻译历史记录
 */

// ===== 翻译历史记录的类型 =====
interface HistoryItem {
  source: string         // 原文
  translated: string     // 译文
  time: string           // 时间戳
}

export default function TranslatePage() {
  // ===== 状态管理 =====
  const [inputText, setInputText] = useState('')          // 用户输入的文本
  const [sourceLang, setSourceLang] = useState('中文')    // 源语言
  const [targetLang, setTargetLang] = useState('English')  // 目标语言
  const [isLoading, setIsLoading] = useState(false)        // 是否正在翻译
  const [result, setResult] = useState<TranslateResult | null>(null)  // 翻译结果
  const [error, setError] = useState<string | null>(null)  // 错误信息
  const [history, setHistory] = useState<HistoryItem[]>([]) // 翻译历史
  const [copiedText, setCopiedText] = useState(false)      // 复制成功提示

  // ===== 切换源语言和目标语言 =====
  const swapLanguages = () => {
    setSourceLang(targetLang)
    setTargetLang(sourceLang)
    // 如果有翻译结果，把译文填回输入框
    if (result) {
      setInputText(result.translatedText)
      setResult(null)
    }
  }

  // ===== 执行翻译（调用 Gemini API）=====
  const handleTranslate = useCallback(async () => {
    // 输入为空时不翻译
    if (!inputText.trim()) return

    setIsLoading(true)   // 显示加载动画
    setError(null)        // 清除之前的错误
    setResult(null)       // 清除之前的结果

    try {
      // 调用 Gemini AI 翻译服务
      const translateResult = await translateText(inputText, sourceLang, targetLang)
      setResult(translateResult)

      // 保存到翻译历史（最多保留 10 条）
      setHistory(prev => [{
        source: inputText,
        translated: translateResult.translatedText,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      }, ...prev].slice(0, 10))
    } catch (err) {
      // 翻译失败时显示错误提示
      setError(err instanceof Error ? err.message : '翻译失败')
    } finally {
      setIsLoading(false) // 隐藏加载动画
    }
  }, [inputText, sourceLang, targetLang])

  // ===== 复制翻译结果到剪贴板 =====
  const handleCopy = async () => {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result.translatedText)
      setCopiedText(true)
      // 2 秒后自动隐藏"已复制"提示
      setTimeout(() => setCopiedText(false), 2000)
    } catch {
      // 某些浏览器可能不支持 clipboard API
      console.warn('复制失败')
    }
  }

  // ===== 高亮翻译结果中的陌生词汇 =====
  // 将普通文本中的陌生词汇用橙色虚线下划线标出
  const renderHighlightedText = (text: string, words: UnfamiliarWord[]) => {
    if (words.length === 0) return <span>{text}</span>

    // 用正则匹配所有陌生词汇（忽略大小写）
    const pattern = new RegExp(
      `\\b(${words.map(w => w.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
      'gi'
    )

    // 按匹配位置拆分文本
    const parts = text.split(pattern)

    return parts.map((part, i) => {
      // 检查这个部分是否是陌生词汇
      const matchedWord = words.find(
        w => w.word.toLowerCase() === part.toLowerCase()
      )

      if (matchedWord) {
        // 是陌生词汇：橙色 + 虚线下划线 + 点击可查看释义
        return (
          <span
            key={i}
            className="text-[var(--color-primary)] underline decoration-dashed underline-offset-4 cursor-pointer"
            title={`${matchedWord.phonetic || ''} ${matchedWord.meaning}`}
          >
            {part}
          </span>
        )
      }
      // 普通文本
      return <span key={i}>{part}</span>
    })
  }

  return (
    <div className="flex flex-col h-full">
      {/* ===== Header ===== */}
      <div className="px-5 py-4">
        <h1 className="text-[20px] font-bold text-[var(--color-foreground)] font-secondary">
          翻译
        </h1>
        <p className="text-[12px] text-[var(--color-muted)] mt-0.5">
          Powered by Gemini AI ✨
        </p>
      </div>

      {/* ===== 语言选择栏 ===== */}
      <div className="flex items-center justify-center gap-4 px-5 mb-4">
        {/* 源语言按钮 */}
        <span className="text-[14px] font-semibold text-[var(--color-foreground)] flex-1 text-center py-2 bg-[var(--color-background-secondary)] rounded-[var(--radius-sm)]">
          {sourceLang}
        </span>
        {/* 切换按钮 */}
        <button
          onClick={swapLanguages}
          className="w-9 h-9 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center shrink-0 active:scale-95 transition-transform"
        >
          <ArrowLeftRight size={16} className="text-[var(--color-primary)]" />
        </button>
        {/* 目标语言按钮 */}
        <span className="text-[14px] font-semibold text-[var(--color-foreground)] flex-1 text-center py-2 bg-[var(--color-background-secondary)] rounded-[var(--radius-sm)]">
          {targetLang}
        </span>
      </div>

      {/* ===== 输入区域 ===== */}
      <div
        className="mx-5 bg-[var(--color-card)] rounded-[var(--radius-md)] p-4 mb-3"
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        <div className="flex items-start justify-between mb-2">
          <span className="text-[12px] text-[var(--color-muted)]">输入文本</span>
          {/* 清除按钮 */}
          {inputText && (
            <button onClick={() => { setInputText(''); setResult(null); setError(null) }}>
              <X size={16} className="text-[var(--color-muted)]" />
            </button>
          )}
        </div>
        {/* 文本输入框 */}
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="输入要翻译的文本..."
          className="w-full h-[100px] text-[15px] text-[var(--color-foreground)] placeholder:text-[var(--color-muted-light)] bg-transparent outline-none resize-none"
        />
        {/* 底部工具栏 */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <button className="p-1.5">
              <Volume2 size={18} className="text-[var(--color-muted)]" />
            </button>
            <button className="p-1.5">
              <Star size={18} className="text-[var(--color-muted)]" />
            </button>
            <button className="p-1.5" onClick={handleCopy}>
              <Copy size={18} className={copiedText ? 'text-[var(--color-success)]' : 'text-[var(--color-muted)]'} />
            </button>
          </div>
          {/* 翻译按钮 */}
          <button
            onClick={handleTranslate}
            disabled={isLoading || !inputText.trim()}
            className="px-5 py-2 bg-[var(--color-primary)] text-white text-[13px] font-semibold rounded-[var(--radius-sm)] disabled:opacity-50 active:scale-95 transition-all flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                翻译中...
              </>
            ) : (
              '翻译'
            )}
          </button>
        </div>
      </div>

      {/* ===== 错误提示 ===== */}
      {error && (
        <div className="mx-5 mb-3 p-3 bg-[var(--color-error)]/10 rounded-[var(--radius-sm)] text-[13px] text-[var(--color-error)]">
          {error}
        </div>
      )}

      {/* ===== 翻译结果区域 ===== */}
      {result && (
        <div
          className="mx-5 bg-[var(--color-card)] rounded-[var(--radius-md)] p-4 mb-3"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <span className="text-[12px] text-[var(--color-muted)] mb-2 block">
            翻译结果
          </span>
          {/* 翻译文本（陌生词汇高亮） */}
          <p className="text-[15px] text-[var(--color-foreground)] leading-relaxed">
            {renderHighlightedText(result.translatedText, result.unfamiliarWords)}
          </p>

          {/* 陌生词汇列表（可展开） */}
          {result.unfamiliarWords.length > 0 && (
            <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
              <p className="text-[12px] text-[var(--color-muted)] mb-2">
                识别到 {result.unfamiliarWords.length} 个值得学习的词汇：
              </p>
              <div className="flex flex-wrap gap-2">
                {result.unfamiliarWords.map((w, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-[var(--color-primary-light)] rounded-full text-[12px]"
                    title={w.phonetic}
                  >
                    <span className="font-semibold text-[var(--color-primary)]">{w.word}</span>
                    <span className="text-[var(--color-muted)]">{w.meaning}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 一键收录按钮 */}
          {result.unfamiliarWords.length > 0 && (
            <button className="flex items-center gap-2 mt-4 px-4 py-2.5 bg-[var(--color-primary-light)] rounded-[var(--radius-sm)] w-full justify-center active:scale-[0.98] transition-transform">
              <Sparkles size={16} className="text-[var(--color-primary)]" />
              <span className="text-[13px] font-semibold text-[var(--color-primary)]">
                一键收录 {result.unfamiliarWords.length} 个陌生词汇
              </span>
            </button>
          )}
        </div>
      )}

      {/* ===== 翻译历史 ===== */}
      <div className="mx-5 mt-2 flex-1 overflow-y-auto">
        <h3 className="text-[14px] font-semibold text-[var(--color-foreground)] mb-3 font-secondary">
          最近翻译
        </h3>
        {history.length === 0 ? (
          <p className="text-[13px] text-[var(--color-muted)] text-center py-8">
            还没有翻译记录，试试输入一些文本吧 ✨
          </p>
        ) : (
          history.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-3 border-b border-[var(--color-border)] cursor-pointer active:bg-[var(--color-background-secondary)]/50 transition-colors"
              onClick={() => {
                // 点击历史记录，填回输入框
                setInputText(item.source)
              }}
            >
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-[var(--color-foreground)] line-clamp-1">
                  {item.source}
                </p>
                <p className="text-[12px] text-[var(--color-muted)] mt-0.5 line-clamp-1">
                  {item.translated}
                </p>
              </div>
              <span className="text-[11px] text-[var(--color-muted)] shrink-0">
                {item.time}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
