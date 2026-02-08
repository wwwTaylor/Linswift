/**
 * 学习热度图组件
 * 设计稿参考：screen-learn 中的 3行 x 12列 GitHub 风格热度图
 * 颜色从浅到深：#F0F0F0 -> #FFE4C4 -> #FFB366 -> #FF8400
 */

// 生成模拟热度数据（0-3 表示学习强度）
const heatData: number[][] = [
  [0, 1, 2, 3, 1, 0, 2, 3, 1, 2, 0, 1],
  [2, 3, 1, 0, 2, 3, 1, 2, 3, 0, 1, 2],
  [1, 0, 3, 2, 1, 2, 0, 1, 2, 3, 2, 3],
]

// 强度对应颜色
const colors = ['#F0F0F0', '#FFE4C4', '#FFB366', '#FF8400']

export default function HeatMap() {
  return (
    <div className="flex flex-col gap-[4px]">
      {heatData.map((row, i) => (
        <div key={i} className="flex gap-[4px]">
          {row.map((level, j) => (
            <div
              key={j}
              className="w-[22px] h-[22px] rounded-[4px]"
              style={{ backgroundColor: colors[level] }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
