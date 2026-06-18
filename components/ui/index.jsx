// ─── BADGE ────────────────────────────────────────────────────────────────────
const BADGE_VARIANTS = {
  green:  "bg-emerald-50 text-emerald-700 border border-emerald-100",
  amber:  "bg-amber-50   text-amber-700   border border-amber-100",
  red:    "bg-red-50     text-red-700     border border-red-100",
  blue:   "bg-blue-50    text-blue-700    border border-blue-100",
  slate:  "bg-slate-100  text-slate-600",
};

export function Badge({ variant = "slate", children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${BADGE_VARIANTS[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

// ─── BUTTON ───────────────────────────────────────────────────────────────────
const BTN_VARIANTS = {
  primary:   "bg-emerald-600 hover:bg-emerald-700 text-white border-transparent",
  secondary: "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300",
  danger:    "bg-red-50 hover:bg-red-100 text-red-700 border-red-100",
  ghost:     "bg-transparent hover:bg-slate-100 text-slate-600 border-transparent",
};
const BTN_SIZES = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-sm",
};

export function Button({
  variant = "secondary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  return (
    <button
      className={`
        inline-flex items-center gap-1.5 font-medium border rounded-lg
        transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed
        ${BTN_VARIANTS[variant]} ${BTN_SIZES[size]} ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

// ─── INPUT / SELECT ───────────────────────────────────────────────────────────
const inputBase =
  "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition";

export function Input({ className = "", ...props }) {
  return <input className={`${inputBase} ${className}`} {...props} />;
}

export function Select({ className = "", children, ...props }) {
  return (
    <select className={`${inputBase} ${className}`} {...props}>
      {children}
    </select>
  );
}

export function Label({ children, className = "" }) {
  return (
    <label className={`block text-xs font-medium text-slate-600 mb-1 ${className}`}>
      {children}
    </label>
  );
}

export function FormGroup({ label, children }) {
  return (
    <div className="mb-4">
      {label && <Label>{label}</Label>}
      {children}
    </div>
  );
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
export function Modal({ title, children, footer, onClose, wide = false }) {
  return (
    <div
      className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full flex flex-col max-h-[90vh] ${
          wide ? "max-w-lg" : "max-w-md"
        } animate-[slideUp_.2s_ease]`}
      >
        {/* header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-0 flex-shrink-0">
          <h3 className="font-display text-lg font-semibold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-2xl leading-none transition"
          >
            ×
          </button>
        </div>
        {/* body */}
        <div className="px-6 py-4 overflow-y-auto flex-1 scrollbar-thin">{children}</div>
        {/* footer */}
        {footer && (
          <div className="px-6 pb-5 pt-2 flex justify-end gap-2 flex-shrink-0 border-t border-slate-100">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
export function ToastContainer({ toasts }) {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-[999]">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-2.5 bg-slate-900 text-white text-sm px-4 py-2.5 rounded-xl shadow-xl
            border-l-4 ${t.type === "success" ? "border-emerald-500" : "border-red-400"}
            animate-[slideUp_.2s_ease]`}
        >
          <span>{t.type === "success" ? "✓" : "✕"}</span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ─── CARD ─────────────────────────────────────────────────────────────────────
export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white border border-slate-200 rounded-xl shadow-sm ${className}`}>
      {children}
    </div>
  );
}

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────
export function EmptyState({ icon = "📋", message = "Aucun résultat" }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
      <div className="text-4xl mb-3">{icon}</div>
      <p className="text-sm">{message}</p>
    </div>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
export function StatCard({ label, value, sub, color = "default" }) {
  const valueColor = {
    default: "text-slate-900",
    green:   "text-emerald-600",
    amber:   "text-amber-500",
    red:     "text-red-500",
  }[color];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
        {label}
      </p>
      <p className={`font-display text-3xl font-bold ${valueColor}`}>{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

// ─── PAGE HEADER ──────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-slate-900">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="ml-4">{action}</div>}
    </div>
  );
}

// ─── SECTION TITLE ────────────────────────────────────────────────────────────
export function SectionTitle({ children }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-3 pt-4 pb-1.5">
      {children}
    </p>
  );
}

// ─── ALERT ────────────────────────────────────────────────────────────────────
const ALERT_VARIANTS = {
  red:    "bg-red-50 text-red-700 border border-red-100",
  amber:  "bg-amber-50 text-amber-700 border border-amber-100",
  green:  "bg-emerald-50 text-emerald-700 border border-emerald-100",
};

export function Alert({ variant = "amber", children }) {
  return (
    <div className={`text-sm px-4 py-2.5 rounded-lg mb-4 ${ALERT_VARIANTS[variant]}`}>
      {children}
    </div>
  );
}
