'use client'
export default function EmptyState({ icon, text }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
      <div className="text-5xl mb-3">{icon}</div>
      <p className="text-sm">{text}</p>
    </div>
  )
}
