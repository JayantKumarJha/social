'use client'

interface Props {
  current: number
  total: number
  labels?: string[]
}

export function ProgressBar({ current, total, labels }: Props) {
  const label = labels ? labels[current - 1] : `Step ${current}`
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#8892b0] font-dm">
          Step {current} of {total} — {label}
        </span>
        <span className="text-xs text-[#4a5272]">{Math.round((current / total) * 100)}%</span>
      </div>
      <div className="h-1 rounded-full bg-[#111527] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${(current / total) * 100}%`,
            background: 'linear-gradient(90deg, #2563ff, #7c3aed)',
          }}
        />
      </div>
    </div>
  )
}
