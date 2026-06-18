'use client'
import { useApp } from '../../lib/store'
import { drugStatus, today, daysUntilExpiry } from '../../lib/data'
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Package, AlertTriangle, TrendingUp, Banknote, ArrowUp, ArrowDown } from 'lucide-react'

function StatCard({ label, value, sub, color, Icon }) {
  return (
    <div className="card p-5 flex gap-4 items-start animate-fade-in">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={18} className="text-white" />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
        <p className="text-2xl font-display font-bold text-slate-900">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { drugs, movements, currentUser, toast } = useApp()

  const alerts   = drugs.filter(d => ['low','out','expired','expiring'].includes(drugStatus(d)))
  const expired  = drugs.filter(d => drugStatus(d) === 'expired')
  const totalVal = drugs.reduce((s, d) => s + d.qty * d.price, 0)
  const recent   = [...movements].sort((a, b) => b.id - a.id).slice(0, 7)

  // 7-day chart data
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i))
    const date = d.toISOString().split('T')[0]
    return {
      day: d.toLocaleDateString('fr-FR', { weekday: 'short' }),
      Entrées: movements.filter(m => m.date === date && m.type === 'in').reduce((s, m) => s + m.qty, 0),
      Sorties: movements.filter(m => m.date === date && m.type === 'out').reduce((s, m) => s + m.qty, 0),
    }
  })

  return (
    <div className="animate-fade-in">
      <div className="mb-6 relative overflow-hidden rounded-2xl p-8 shadow-sm">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1576602976047-174e57a47881?w=1200&q=80')" }} />
        <div className="absolute inset-0 bg-slate-900/60" />
        <div className="relative z-10">
          <h2 className="font-display font-bold text-3xl text-white">Tableau de bord</h2>
          <p className="text-slate-200 text-sm mt-1">
            Bienvenue, {currentUser.name} —{' '}
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard label="Articles en stock" value={drugs.length}
          sub={`${drugs.filter(d => d.qty > 0).length} disponibles`}
          color="bg-emerald-500" Icon={Package} />
        <StatCard label="Alertes actives" value={alerts.length}
          sub="stock faible + périmés"
          color={alerts.length > 0 ? 'bg-amber-500' : 'bg-slate-400'} Icon={AlertTriangle} />
        <StatCard label="Articles périmés" value={expired.length}
          sub="à retirer immédiatement"
          color={expired.length > 0 ? 'bg-red-500' : 'bg-slate-400'} Icon={TrendingUp} />
        <StatCard label="Valeur du stock"
          value={totalVal.toLocaleString('fr-FR') + ' F'}
          sub="FCFA — valeur totale"
          color="bg-blue-500" Icon={Banknote} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Chart */}
        <div className="card p-5">
          <h3 className="font-display font-bold text-slate-800 text-base mb-4">
            Entrées / Sorties — 7 jours
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} barGap={4} barCategoryGap={12}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 10, color: '#fff', fontSize: 12 }}
                cursor={{ fill: '#f1f5f9' }}
              />
              <Bar dataKey="Entrées" fill="#10b981" radius={[4,4,0,0]} maxBarSize={20} />
              <Bar dataKey="Sorties" fill="#f87171" radius={[4,4,0,0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-5 mt-2 justify-center">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="w-3 h-3 rounded-sm bg-emerald-500" />Entrées
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="w-3 h-3 rounded-sm bg-red-400" />Sorties
            </div>
          </div>
        </div>

        {/* Recent movements */}
        <div className="card p-5">
          <h3 className="font-display font-bold text-slate-800 text-base mb-4">Derniers mouvements</h3>
          {recent.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">Aucun mouvement enregistré</p>
          ) : (
            <div className="space-y-1">
              {recent.map(m => (
                <div key={m.id} className="flex items-center gap-3 py-2.5 border-b border-slate-100 last:border-0">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0
                    ${m.type === 'in' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                    {m.type === 'in'
                      ? <ArrowDown size={12} className="text-emerald-600" />
                      : <ArrowUp   size={12} className="text-red-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{m.drugName}</p>
                    <p className="text-xs text-slate-400">{m.reason}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-sm font-bold ${m.type === 'in' ? 'text-emerald-600' : 'text-red-500'}`}>
                      {m.type === 'in' ? '+' : '-'}{m.qty}
                    </p>
                    <p className="text-[10px] text-slate-400">{m.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="mt-5 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AlertTriangle size={18} className="text-amber-500 flex-shrink-0" />
            <p className="text-amber-800 text-sm">
              <strong>{alerts.length} article(s)</strong> nécessitent votre attention (stock faible, rupture ou périmés).
            </p>
          </div>
          <button 
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg transition-colors"
            onClick={() => toast('Email d\'alerte envoyé au gérant', 'success')}
          >
            Envoyer alerte par email
          </button>
        </div>
      )}
    </div>
  )
}
