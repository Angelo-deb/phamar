'use client'
import { useApp } from '../../lib/store'

export default function ToastContainer() {
  const { toasts } = useApp()
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-[999]">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-xl text-sm shadow-2xl animate-slide-in border-l-4
            ${t.type === 'success' ? 'border-emerald-500' : 'border-red-400'}`}
        >
          <span>{t.type === 'success' ? '✓' : '✕'}</span>
          {t.msg}
        </div>
      ))}
    </div>
  )
}
