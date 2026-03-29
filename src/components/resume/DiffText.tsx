import type { DiffSegment, ListDiffItem } from '@/lib/diff'

export function DiffText({ segments }: { segments: DiffSegment[] }) {
  return (
    <span>
      {segments.map((seg, i) => {
        switch (seg.type) {
          case 'added':
            return (
              <span key={i} className="bg-green-100 text-green-800">
                {seg.text}
              </span>
            )
          case 'removed':
            return (
              <span key={i} className="bg-red-100 text-red-800 line-through">
                {seg.text}
              </span>
            )
          default:
            return <span key={i}>{seg.text}</span>
        }
      })}
    </span>
  )
}

export function DiffSkillList({ items, label }: { items: ListDiffItem[]; label: string }) {
  return (
    <p className="text-base text-gray-700">
      <span className="font-medium">{label}:</span>{' '}
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && ', '}
          {item.type === 'added' && (
            <span className="bg-green-100 text-green-800">{item.name}</span>
          )}
          {item.type === 'removed' && (
            <span className="bg-red-100 text-red-800 line-through">{item.name}</span>
          )}
          {item.type === 'unchanged' && <span>{item.name}</span>}
        </span>
      ))}
    </p>
  )
}
