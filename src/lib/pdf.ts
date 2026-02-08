/**
 * pdf.ts — PDF 文本提取工具
 *
 * 使用 pdfjs-dist 库解析 PDF 文件并提取文本内容。
 *
 * 功能：
 *   - extractTextFromPDF(file) — 从 PDF 文件提取全文
 *   - extractPageText(file, pageNum) — 提取指定页文本
 *   - getPDFMetadata(file) — 获取 PDF 元数据（标题、作者、页数）
 *
 * 注意：
 *   Vite 环境下需要手动设置 Worker 路径，
 *   这里使用 CDN Worker 来避免打包复杂性。
 */

import * as pdfjsLib from 'pdfjs-dist'

// ===== 配置 Worker =====
// Vite 无法直接 import pdf.worker.js，使用 CDN 的 worker
// 使用与安装版本匹配的 CDN URL
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

// ========== 类型定义 ==========

/** PDF 元数据 */
export interface PDFMeta {
  /** 标题（可能为空） */
  title: string
  /** 作者（可能为空） */
  author: string
  /** 总页数 */
  numPages: number
  /** 文件大小（bytes） */
  fileSize: number
}

/** 单页提取结果 */
export interface PageResult {
  /** 页码（从 1 开始） */
  pageNum: number
  /** 该页的文本内容 */
  text: string
}

// ========== 核心函数 ==========

/**
 * 将 File 对象转换为 ArrayBuffer
 */
function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as ArrayBuffer)
    reader.onerror = () => reject(new Error('读取文件失败'))
    reader.readAsArrayBuffer(file)
  })
}

/**
 * 从 PDF 文件中提取全部文本
 *
 * @param file - 用户选择的 PDF File 对象
 * @returns 全文文本字符串（各页以换行分隔）
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await fileToArrayBuffer(file)
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

  const pageTexts: string[] = []

  // 逐页提取文本
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    // 将所有文本项拼接成一个字符串
    const text = content.items
      .map((item: any) => item.str)
      .join(' ')
    pageTexts.push(text)
  }

  return pageTexts.join('\n\n')
}

/**
 * 从 PDF 提取指定页的文本
 *
 * @param file    - PDF File 对象
 * @param pageNum - 页码（从 1 开始）
 * @returns 该页的文本内容
 */
export async function extractPageText(file: File, pageNum: number): Promise<string> {
  const arrayBuffer = await fileToArrayBuffer(file)
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

  if (pageNum < 1 || pageNum > pdf.numPages) {
    throw new Error(`页码超出范围: ${pageNum}，总页数: ${pdf.numPages}`)
  }

  const page = await pdf.getPage(pageNum)
  const content = await page.getTextContent()
  return content.items.map((item: any) => item.str).join(' ')
}

/**
 * 获取 PDF 文件的元数据
 *
 * @param file - PDF File 对象
 * @returns PDF 元信息（标题、作者、页数、文件大小）
 */
export async function getPDFMetadata(file: File): Promise<PDFMeta> {
  const arrayBuffer = await fileToArrayBuffer(file)
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const metadata = await pdf.getMetadata()

  // metadata.info 中包含标题、作者等
  const info = metadata.info as Record<string, any> | undefined

  return {
    title: info?.Title || file.name.replace(/\.pdf$/i, ''),
    author: info?.Author || '未知作者',
    numPages: pdf.numPages,
    fileSize: file.size,
  }
}

/**
 * 逐页提取 PDF 的所有文本，返回页数组
 *
 * @param file - PDF File 对象
 * @returns 每页的文本内容数组
 */
export async function extractAllPages(file: File): Promise<PageResult[]> {
  const arrayBuffer = await fileToArrayBuffer(file)
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

  const results: PageResult[] = []

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const text = content.items.map((item: any) => item.str).join(' ')
    results.push({ pageNum: i, text })
  }

  return results
}

/**
 * 格式化文件大小为可读字符串
 * @param bytes 文件大小（字节）
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
