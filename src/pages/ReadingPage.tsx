import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Settings, Volume2, X, Check } from 'lucide-react'

/**
 * 阅读界面 —— 阅读器模块
 * 功能：
 *  1. 英文文章段落展示
 *  2. 陌生词汇自动标注（橙色虚线下划线 + 括号中文翻译）
 *  3. 点击词汇弹出详情弹窗（音标、释义、"我会了"按钮）
 *  4. 底部开关：自动翻译、自动词汇收录
 */

// ===== 模拟文章数据 =====
// 陌生词汇用特殊标记包裹 {word|translation}
const articleParagraphs = [
  'In my younger and more vulnerable years my father gave me some advice that I\'ve been turning over in my mind ever since.',
  '"Whenever you feel like criticizing anyone," he told me, "just remember that all the people in this world haven\'t had the advantages that you\'ve had."',
  'He didn\'t say any more, but we\'ve always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that.',
  'In consequence, I\'m inclined to reserve all judgments, a habit that has opened up many curious natures to me and also made me the victim of not a few veteran bores.',
]

// 文章中的陌生词汇
const vocabInText: Record<string, { meaning: string; phonetic: string }> = {
  'vulnerable': { meaning: '脆弱的', phonetic: '/ˈvʌl.nər.ə.bəl/' },
  'criticizing': { meaning: '批评', phonetic: '/ˈkrɪt.ɪ.saɪ.zɪŋ/' },
  'communicative': { meaning: '善于交流的', phonetic: '/kəˈmjuː.nɪ.kə.tɪv/' },
  'reserved': { meaning: '内敛的', phonetic: '/rɪˈzɜːvd/' },
  'consequence': { meaning: '因此', phonetic: '/ˈkɑːn.sə.kwens/' },
  'inclined': { meaning: '倾向于', phonetic: '/ɪnˈklaɪnd/' },
  'judgments': { meaning: '判断', phonetic: '/ˈdʒʌdʒ.mənts/' },
  'veteran': { meaning: '经验丰富的', phonetic: '/ˈvet.ər.ən/' },
}

// ===== 单词详情弹窗的数据类型 =====
interface WordPopup {
  word: string
  meaning: string
  phonetic: string
}

export default function ReadingPage() {
  const navigate = useNavigate()
  const [autoTranslate, setAutoTranslate] = useState(true)      // 自动翻译开关
  const [autoCollect, setAutoCollect] = useState(true)           // 自动收录开关
  const [selectedWord, setSelectedWord] = useState<WordPopup | null>(null) // 弹窗
  const [learnedWords, setLearnedWords] = useState<Set<string>>(new Set()) // 已标记"我会了"

  // ===== 渲染段落文本（高亮陌生词汇）=====
  const renderParagraph = (text: string) => {
    const vocabKeys = Object.keys(vocabInText)
    // 创建正则匹配所有陌生词汇
    const pattern = new RegExp(`\\b(${vocabKeys.join('|')})\\b`, 'gi')
    const parts = text.split(pattern)

    return parts.map((part, i) => {
      const vocabEntry = vocabInText[part.toLowerCase()]
      if (vocabEntry) {
        const isLearned = learnedWords.has(part.toLowerCase())
        return (
          <span key={i}>
            <span
              className={`cursor-pointer transition-colors ${
                selectedWord?.word.toLowerCase() === part.toLowerCase()
                  ? 'text-[var(--color-primary)] font-semibold bg-[var(--color-primary-light)] px-0.5 rounded'
                  : isLearned
                    ? 'text-[var(--color-success)]'
                    : 'text-[var(--color-primary)] underline decoration-dashed underline-offset-4'
              }`}
              onClick={() => setSelectedWord({ word: part, meaning: vocabEntry.meaning, phonetic: vocabEntry.phonetic })}
            >
              {part}
            </span>
            {autoTranslate && !isLearned && (
              <span className="text-[11px] text-[var(--color-muted)]">({vocabEntry.meaning})</span>
            )}
          </span>
        )
      }
      return <span key={i}>{part}</span>
    })
  }

  // ===== 标记"我会了" =====
  const handleMarkLearned = () => {
    if (selectedWord) {
      setLearnedWords(prev => new Set([...prev, selectedWord.word.toLowerCase()]))
      setSelectedWord(null)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
        <button onClick={() => navigate(-1)} className="p-1">
          <ChevronLeft size={24} className="text-[var(--color-foreground)]" />
        </button>
        <div className="text-center">
          <h1 className="text-[16px] font-bold text-[var(--color-foreground)] font-secondary">The Great Gatsby</h1>
          <p className="text-[11px] text-[var(--color-muted)]">Chapter 1</p>
        </div>
        <button className="p-1">
          <Settings size={20} className="text-[var(--color-muted)]" />
        </button>
      </div>

      {/* ===== 文章内容 ===== */}
      <div className="flex-1 px-5 py-6 overflow-y-auto">
        {articleParagraphs.map((para, i) => (
          <p key={i} className="text-[15px] text-[var(--color-foreground)] leading-[1.8] mb-4 font-primary">
            {renderParagraph(para)}
          </p>
        ))}
      </div>

      {/* ===== 单词详情弹窗 ===== */}
      {selectedWord && (
        <div className="mx-5 mb-3 p-4 bg-[var(--color-card)] rounded-[var(--radius-md)] border border-[var(--color-primary)]/20 animate-in"
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-[18px] font-bold text-[var(--color-primary)]">{selectedWord.word}</h3>
              <p className="text-[12px] text-[var(--color-muted)]">{selectedWord.phonetic}</p>
            </div>
            <button onClick={() => setSelectedWord(null)}>
              <X size={18} className="text-[var(--color-muted)]" />
            </button>
          </div>
          <p className="text-[14px] text-[var(--color-foreground)] mb-3">{selectedWord.meaning}</p>
          <div className="flex gap-2">
            <button className="p-2 rounded-full bg-[var(--color-background-secondary)]">
              <Volume2 size={16} className="text-[var(--color-muted)]" />
            </button>
            <button
              onClick={handleMarkLearned}
              className="flex-1 flex items-center justify-center gap-2 py-2 bg-[var(--color-primary)] text-white rounded-[var(--radius-xs)] text-[13px] font-semibold active:scale-[0.98] transition-transform"
            >
              <Check size={14} /> 我会了
            </button>
          </div>
        </div>
      )}

      {/* ===== 底部设置栏 ===== */}
      <div className="px-5 py-3 border-t border-[var(--color-border)] flex items-center justify-between bg-[var(--color-card)]">
        {/* 自动翻译 */}
        <label className="flex items-center gap-2 cursor-pointer">
          <div
            className={`w-10 h-[22px] rounded-full transition-colors relative ${autoTranslate ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border-dark)]'}`}
            onClick={() => setAutoTranslate(!autoTranslate)}
          >
            <div className={`absolute top-[2px] w-[18px] h-[18px] bg-white rounded-full transition-transform shadow ${autoTranslate ? 'left-[20px]' : 'left-[2px]'}`} />
          </div>
          <span className="text-[12px] text-[var(--color-foreground)]">自动翻译</span>
        </label>

        {/* 自动收录 */}
        <label className="flex items-center gap-2 cursor-pointer">
          <div
            className={`w-10 h-[22px] rounded-full transition-colors relative ${autoCollect ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border-dark)]'}`}
            onClick={() => setAutoCollect(!autoCollect)}
          >
            <div className={`absolute top-[2px] w-[18px] h-[18px] bg-white rounded-full transition-transform shadow ${autoCollect ? 'left-[20px]' : 'left-[2px]'}`} />
          </div>
          <span className="text-[12px] text-[var(--color-foreground)]">自动收录词汇</span>
        </label>
      </div>
    </div>
  )
}
