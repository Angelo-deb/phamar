import { useApp } from "../../context/AppContext";
import { SectionTitle } from "../ui";

const NAV_ITEMS = [
  { id: "dashboard",  label: "Tableau de bord", icon: "◉",  roles: ["admin", "user"] },
  { id: "articles",   label: "Articles",         icon: "💊", roles: ["admin", "user"] },
  { id: "movements",  label: "Mouvements",       icon: "⇅",  roles: ["admin", "user"] },
  { id: "users",      label: "Utilisateurs",     icon: "👥", roles: ["admin"] },
  { id: "retired",    label: "Retirés",           icon: "🗄", roles: ["admin"] },
];

export default function AppShell({ page, setPage, children }) {
  const { currentUser, logout } = useApp();
  const initials = currentUser.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const nav = NAV_ITEMS.filter((n) => n.roles.includes(currentUser.role));

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* ── Sidebar ── */}
      <aside className="w-60 flex-shrink-0 bg-slate-900 flex flex-col sticky top-0 h-screen overflow-y-auto">
        {/* Brand */}
        <div className="px-5 py-6 border-b border-white/[0.07]">
          <h1 className="font-display text-lg font-bold text-white tracking-tight">
            Pharma<span className="text-emerald-400">Stock</span>
          </h1>
          <p className="text-slate-500 text-[11px] mt-0.5">Gestion de pharmacie</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2.5 py-3">
          <SectionTitle>Navigation</SectionTitle>
          {nav.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`
                w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm
                transition-all duration-150 border border-transparent
                ${
                  page === item.id
                    ? "bg-emerald-700 text-white font-medium"
                    : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
                }
              `}
            >
              <span className="text-[15px] w-5 text-center">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* User footer */}
        <div className="px-3 py-4 border-t border-white/[0.07] flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{currentUser.name}</p>
            <p className="text-slate-400 text-[10px] capitalize">
              {currentUser.role === "admin" ? "Administrateur" : "Utilisateur"}
            </p>
          </div>
          <button
            onClick={logout}
            title="Déconnexion"
            className="text-slate-400 hover:text-red-400 transition text-lg leading-none p-1"
          >
            ⏻
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 min-w-0 px-8 py-7 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
