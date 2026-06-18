'use client'
import { useApp } from '../../lib/store'
import {
  LayoutDashboard, Pill, ArrowLeftRight,
  Users, Archive, LogOut, Building2
} from 'lucide-react'

const PAGES = [
  { id: 'dashboard', label: 'Tableau de bord', Icon: LayoutDashboard, roles: ['admin','user'] },
  { id: 'articles',  label: 'Articles',         Icon: Pill,             roles: ['admin','user'] },
  { id: 'fournisseurs', label: 'Fournisseurs',  Icon: Building2,        roles: ['admin','user'] },
  { id: 'movements', label: 'Mouvements',        Icon: ArrowLeftRight,  roles: ['admin','user'] },
  { id: 'users',     label: 'Utilisateurs',      Icon: Users,           roles: ['admin']        },
  { id: 'retired',   label: 'Retirés',           Icon: Archive,         roles: ['admin']        },
]

export default function Sidebar({ page, setPage }) {
  const { currentUser, logout } = useApp()
  const nav = PAGES.filter(p => p.roles.includes(currentUser.role))
  const initials = currentUser.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <aside className="w-60 flex-shrink-0 flex flex-col bg-slate-900 sticky top-0 h-screen overflow-y-auto">
      {/* Brand with background image */}
      <div
        className="relative px-5 py-6 overflow-hidden"
        style={{
          backgroundImage: "linear-gradient(135deg,rgba(2,44,34,0.97) 0%,rgba(6,78,59,0.95) 100%), url('https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg">
              <Pill size={14} className="text-white" />
            </div>
            <h1 className="font-display font-bold text-white text-lg tracking-tight">
              Pharma<span className="text-emerald-400">Stock</span>
            </h1>
          </div>
          <p className="text-slate-400 text-xs">Gestion de pharmacie</p>
        </div>
        {/* Decorative circles */}
        <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-emerald-500/10 pointer-events-none"/>
        <div className="absolute -bottom-8 -right-2 w-20 h-20 rounded-full bg-emerald-400/8 pointer-events-none"/>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 py-2">Navigation</p>
        {nav.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setPage(id)}
            className={`w-full text-left ${page === id ? 'nav-item-active' : 'nav-item'}`}
          >
            <Icon size={16} className="flex-shrink-0" />
            {label}
          </button>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-3 pb-4 border-t border-white/10 pt-3">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">{currentUser.name}</p>
            <p className="text-slate-400 text-[10px] capitalize">
              {currentUser.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
            </p>
          </div>
          <button
            onClick={logout}
            title="Déconnexion"
            className="text-slate-400 hover:text-red-400 transition-colors p-1"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  )
}
