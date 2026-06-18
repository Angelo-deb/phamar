'use client'
export default function Modal({ title, children, footer, onClose, wide }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full overflow-y-auto max-h-[92vh] animate-slide-up ${wide ? 'max-w-xl' : 'max-w-md'}`}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-0">
          <h3 className="text-lg font-display font-bold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-2xl leading-none transition-colors"
          >×</button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && <div className="flex justify-end gap-2 px-6 pb-5">{footer}</div>}
      </div>
    </div>
  )
}
