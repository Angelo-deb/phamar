'use client'
import { useState } from 'react'
import { useApp } from '../../lib/store'
import { Pill, ShieldCheck, Package, Activity } from 'lucide-react'

export default function AuthPage() {
  const { login, register, users } = useApp()
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' })
  const [err, setErr] = useState('')

  function h(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })) }

  function submit(e) {
    e.preventDefault(); setErr('')
    if (tab === 'login') {
      if (!login(form.email, form.password)) setErr('Email ou mot de passe incorrect.')
    } else {
      if (!form.name || !form.email || !form.password) { setErr('Tous les champs sont requis.'); return }
      if (users.find(u => u.email === form.email)) { setErr('Email déjà utilisé.'); return }
      register(form)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* LEFT — hero with pharmacy background */}
      <div
        className="hidden lg:flex lg:w-3/5 relative flex-col items-center justify-center p-12 overflow-hidden"
        style={{
          backgroundImage: "linear-gradient(135deg, rgba(2,44,34,0.93) 0%, rgba(6,78,59,0.88) 40%, rgba(4,47,46,0.94) 100%), url('https://images.unsplash.com/photo-1576602976047-174e57a47881?w=1400&q=85')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="relative z-10 max-w-lg animate-fade-in">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-900/50">
              <Pill size={24} className="text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-white text-3xl tracking-tight">
                Pharma<span className="text-emerald-400">Stock</span>
              </h1>
              <p className="text-emerald-300/70 text-sm">Système de gestion pharmaceutique</p>
            </div>
          </div>

          <h2 className="font-display font-bold text-white text-4xl leading-tight mb-5">
            Gérez votre stock<br/>
            <span className="text-emerald-400">en toute sécurité.</span>
          </h2>
          <p className="text-slate-300 text-base leading-relaxed mb-10">
            Suivez vos médicaments en temps réel, contrôlez les expirations,
            gérez vos équipes et anticipez les ruptures de stock.
          </p>

          <div className="grid grid-cols-3 gap-4">
            {[
              { Icon: Package,    label: 'Stock en temps réel' },
              { Icon: ShieldCheck,label: 'Alertes automatiques' },
              { Icon: Activity,   label: 'Historique tracé' },
            ].map(({ Icon, label }) => (
              <div key={label} className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
                <Icon size={20} className="text-emerald-400 mx-auto mb-2" />
                <p className="text-white text-xs font-medium leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom pills image strip */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 opacity-15"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1400&q=60')",
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            maskImage: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
          }}
        />
      </div>

      {/* RIGHT — form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-sm animate-slide-up">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center">
              <Pill size={18} className="text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-slate-900">
              Pharma<span className="text-emerald-600">Stock</span>
            </span>
          </div>

          <h2 className="font-display font-bold text-2xl text-slate-900 mb-1">
            {tab === 'login' ? 'Connexion' : 'Créer un compte'}
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            {tab === 'login' ? 'Accédez à votre espace pharmacie' : 'Rejoignez votre équipe'}
          </p>

          {/* Tabs */}
          <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
            {['login','register'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-150
                  ${tab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {t === 'login' ? 'Connexion' : 'Inscription'}
              </button>
            ))}
          </div>

          {err && (
            <div className="bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
              {err}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {tab === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nom complet</label>
                <input className="input-base" name="name" value={form.name} onChange={h} placeholder="Dr. Jean Dupont" />
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
              <input className="input-base" name="email" type="email" value={form.email} onChange={h} placeholder="email@pharmacie.cm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Mot de passe</label>
              <input className="input-base" name="password" type="password" value={form.password} onChange={h} placeholder="••••••••" />
            </div>
            {tab === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Rôle</label>
                <select className="input-base" name="role" value={form.role} onChange={h}>
                  <option value="user">Utilisateur autorisé</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
            )}
            <button type="submit" className="btn-primary w-full justify-center py-2.5 text-base font-semibold mt-2">
              {tab === 'login' ? 'Se connecter' : 'Créer le compte'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-400">
              Démo : <span className="font-mono text-slate-600">admin@pharma.cm</span> / <span className="font-mono text-slate-600">admin123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
