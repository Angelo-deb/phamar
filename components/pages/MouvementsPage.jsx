'use client'
import { useState } from 'react'
import { useApp } from '../../lib/store'
import { REASONS_IN, REASONS_OUT, today } from '../../lib/data'
import Modal from '../ui/Modal'
import EmptyState from '../ui/EmptyState'
import { Plus, ArrowDownCircle, ArrowUpCircle, FileText } from 'lucide-react'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

function MoveModal({ drug, onClose }) {
  const { addMovement, currentUser, toast } = useApp()
  const [f, setF] = useState({ type: 'in', qty: '', reason: REASONS_IN[0], note: '' })

  function h(e) {
    const upd = { ...f, [e.target.name]: e.target.value }
    if (e.target.name === 'type') upd.reason = e.target.value === 'in' ? REASONS_IN[0] : REASONS_OUT[0]
    setF(upd)
  }
  function submit(e) {
    e.preventDefault()
    if (!f.qty || +f.qty <= 0) { alert('Quantité invalide'); return }
    if (f.type === 'out' && +f.qty > drug.qty) { alert('Stock insuffisant'); return }
    addMovement({ drugId: drug.id, drugName: drug.name, ...f, qty: +f.qty, user: currentUser.name, date: today() })
    toast(`Mouvement enregistré pour ${drug.name}`, 'success')
    onClose()
  }

  const reasons = f.type === 'in' ? REASONS_IN : REASONS_OUT

  return (
    <Modal title={`Mouvement — ${drug.name}`} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-2">Type de mouvement</label>
          <div className="grid grid-cols-2 gap-2">
            {['in','out'].map(t => (
              <label
                key={t}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all
                  ${f.type === t
                    ? t === 'in' ? 'border-emerald-500 bg-emerald-50' : 'border-red-400 bg-red-50'
                    : 'border-slate-200 hover:border-slate-300'}`}
              >
                <input type="radio" name="type" value={t} checked={f.type === t} onChange={h} className="sr-only" />
                {t === 'in'
                  ? <ArrowDownCircle size={18} className="text-emerald-600 flex-shrink-0" />
                  : <ArrowUpCircle  size={18} className="text-red-500 flex-shrink-0" />}
                <span className={`text-sm font-semibold ${f.type === t ? (t === 'in' ? 'text-emerald-700' : 'text-red-700') : 'text-slate-600'}`}>
                  {t === 'in' ? 'Entrée' : 'Sortie'}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Quantité *</label>
            <input className="input-base" name="qty" type="number" min="1" value={f.qty} onChange={h} required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Stock actuel</label>
            <input className="input-base bg-slate-50" value={`${drug.qty} ${drug.unit}`} disabled />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Raison *</label>
          <select className="input-base" name="reason" value={f.reason} onChange={h}>
            {reasons.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Note (optionnel)</label>
          <input className="input-base" name="note" value={f.note} onChange={h} placeholder="Ex: Livraison ABC Pharma" />
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" className="btn-secondary" onClick={onClose}>Annuler</button>
          <button type="submit" className="btn-primary">Confirmer</button>
        </div>
      </form>
    </Modal>
  )
}

function PickDrugModal({ drugs, onPick, onClose }) {
  const [q, setQ] = useState('')
  const list = drugs.filter(d => !q || d.name.toLowerCase().includes(q.toLowerCase()))
  return (
    <Modal title="Choisir un article" onClose={onClose}>
      <div className="space-y-3">
        <input className="input-base" placeholder="Rechercher..." value={q} onChange={e => setQ(e.target.value)} />
        <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto">
          {list.map(d => (
            <button
              key={d.id}
              onClick={() => onPick(d)}
              className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all text-left group"
            >
              <span className="text-sm font-medium text-slate-800 group-hover:text-emerald-700">{d.name}</span>
              <span className="text-xs text-slate-400">{d.qty} {d.unit}</span>
            </button>
          ))}
        </div>
      </div>
    </Modal>
  )
}

export default function MouvementsPage() {
  const { drugs, movements } = useApp()
  const [drugFilter, setDrugFilter] = useState('')
  const [typeF, setTypeF] = useState('')
  const [modal, setModal] = useState(null)

  const list = [...movements].sort((a, b) => b.id - a.id).filter(m => {
    if (drugFilter && m.drugName !== drugFilter) return false
    if (typeF && m.type !== typeF) return false
    return true
  })

  const exportPDF = () => {
    const doc = new jsPDF()
    doc.text('Rapport des mouvements de stock', 14, 15)
    doc.autoTable({
      startY: 20,
      head: [['Type', 'Médicament', 'Qté', 'Raison', 'Utilisateur', 'Date']],
      body: list.map(m => [
        m.type === 'in' ? 'Entrée' : 'Sortie',
        m.drugName,
        (m.type === 'in' ? '+' : '-') + m.qty,
        m.reason,
        m.user,
        new Date(m.date).toLocaleDateString('fr-FR')
      ])
    })
    doc.save('mouvements_stock.pdf')
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6 relative overflow-hidden rounded-2xl p-8 shadow-sm flex items-start justify-between">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1586528116311-ad8ed7c80a30?w=1200&q=80')" }} />
        <div className="absolute inset-0 bg-slate-900/60" />
        <div className="relative z-10">
          <h2 className="font-display font-bold text-3xl text-white">Mouvements de stock</h2>
          <p className="text-slate-200 text-sm mt-1">{movements.length} opérations enregistrées</p>
        </div>
        <div className="flex gap-2 relative z-10">
          <button className="btn-secondary" onClick={exportPDF}>
            <FileText size={15} /> Exporter PDF
          </button>
          <button className="btn-primary" onClick={() => setModal('pick')}>
            <Plus size={15} /> Nouveau mouvement
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <select className="input-base w-auto min-w-44" value={drugFilter} onChange={e => setDrugFilter(e.target.value)}>
          <option value="">Tous les articles</option>
          {[...new Set(movements.map(m => m.drugName))].map(n => <option key={n}>{n}</option>)}
        </select>
        <select className="input-base w-auto min-w-36" value={typeF} onChange={e => setTypeF(e.target.value)}>
          <option value="">Entrées + Sorties</option>
          <option value="in">Entrées seulement</option>
          <option value="out">Sorties seulement</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['Type','Médicament','Quantité','Raison','Note','Utilisateur','Date'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.length === 0 && (
                <tr><td colSpan={7}><EmptyState icon="📋" text="Aucun mouvement enregistré" /></td></tr>
              )}
              {list.map(m => (
                <tr key={m.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3">
                    <span className={m.type === 'in' ? 'badge-green' : 'badge-red'}>
                      {m.type === 'in' ? '↓ Entrée' : '↑ Sortie'}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{m.drugName}</td>
                  <td className={`px-4 py-3 font-bold ${m.type === 'in' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {m.type === 'in' ? '+' : '-'}{m.qty}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{m.reason}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{m.note || '—'}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{m.user}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{new Date(m.date).toLocaleDateString('fr-FR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal === 'pick' && (
        <PickDrugModal drugs={drugs} onPick={d => setModal(d)} onClose={() => setModal(null)} />
      )}
      {modal && modal !== 'pick' && (
        <MoveModal drug={modal} onClose={() => setModal(null)} />
      )}
    </div>
  )
}
