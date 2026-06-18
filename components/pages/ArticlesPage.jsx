'use client'
import { useState } from 'react'
import { useApp } from '../../lib/store'
import { drugStatus, daysUntilExpiry, CATEGORIES, today } from '../../lib/data'
import Modal from '../ui/Modal'
import StatusBadge from '../ui/StatusBadge'
import EmptyState from '../ui/EmptyState'
import { Search, Plus, Pencil, Trash2 } from 'lucide-react'

function DrugForm({ initial, onSave, onClose }) {
  const [f, setF] = useState(initial || {
    name: '', qty: '', minQty: '', price: '', category: 'Antalgiques', expiry: today(365), unit: 'boîte',
  })
  function h(e) { setF(x => ({ ...x, [e.target.name]: e.target.value })) }
  function submit(e) {
    e.preventDefault()
    if (!f.name || !f.qty || !f.minQty || !f.price || !f.expiry) return
    onSave({ ...f, qty: +f.qty, minQty: +f.minQty, price: +f.price })
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nom du médicament *</label>
        <input className="input-base" name="name" value={f.name} onChange={h} required placeholder="Ex: Amoxicilline 500mg" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Quantité *</label>
          <input className="input-base" name="qty" type="number" min="0" value={f.qty} onChange={h} required />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Seuil d'alerte *</label>
          <input className="input-base" name="minQty" type="number" min="1" value={f.minQty} onChange={h} required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Prix (FCFA) *</label>
          <input className="input-base" name="price" type="number" min="0" value={f.price} onChange={h} required />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Unité</label>
          <select className="input-base" name="unit" value={f.unit} onChange={h}>
            {['boîte','flacon','ampoule','sachet','comprimé','tube','litre'].map(u => <option key={u}>{u}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Catégorie</label>
          <select className="input-base" name="category" value={f.category} onChange={h}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Date d'expiration *</label>
          <input className="input-base" name="expiry" type="date" value={f.expiry} onChange={h} required />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" className="btn-secondary" onClick={onClose}>Annuler</button>
        <button type="submit" className="btn-primary">Enregistrer</button>
      </div>
    </form>
  )
}

export default function ArticlesPage() {
  const { drugs, addDrug, updateDrug, deleteDrug, toast } = useApp()
  const [search, setSearch] = useState('')
  const [catF, setCatF]     = useState('')
  const [statusF, setStatusF] = useState('')
  const [modal, setModal]   = useState(null)

  const list = drugs.filter(d => {
    const s = drugStatus(d)
    if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false
    if (catF && d.category !== catF) return false
    if (statusF === 'ok'      && s !== 'ok') return false
    if (statusF === 'alert'   && !['low','out','expired','expiring'].includes(s)) return false
    if (statusF === 'expired' && s !== 'expired') return false
    return true
  })

  function handleSave(data) {
    if (modal === 'add') { addDrug(data); toast('Article ajouté avec succès', 'success') }
    else { updateDrug({ ...modal, ...data }); toast('Article mis à jour', 'success') }
    setModal(null)
  }
  function handleDelete(d) {
    if (!confirm(`Supprimer "${d.name}" ?`)) return
    deleteDrug(d.id); toast('Article supprimé', 'success')
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6 relative overflow-hidden rounded-2xl p-8 shadow-sm flex items-center justify-between">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&q=80')" }} />
        <div className="absolute inset-0 bg-slate-900/60" />
        <div className="relative z-10">
          <h2 className="font-display font-bold text-3xl text-white">Articles / Médicaments</h2>
          <p className="text-slate-200 text-sm mt-1">{drugs.length} articles — {drugs.filter(d => drugStatus(d) === 'ok').length} en stock normal</p>
        </div>
        <button className="btn-primary relative z-10" onClick={() => setModal('add')}>
          <Plus size={15} /> Ajouter un article
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input-base pl-8" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un médicament..." />
        </div>
        <select className="input-base w-auto min-w-40" value={catF} onChange={e => setCatF(e.target.value)}>
          <option value="">Toutes catégories</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select className="input-base w-auto min-w-36" value={statusF} onChange={e => setStatusF(e.target.value)}>
          <option value="">Tous statuts</option>
          <option value="ok">En stock</option>
          <option value="alert">Alertes</option>
          <option value="expired">Périmés</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['Médicament','Catégorie','Quantité','Seuil','Prix','Expiration','Statut','Actions']
                  .map(h => <th key={h} className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {list.length === 0 && (
                <tr><td colSpan={8}><EmptyState icon="💊" text="Aucun article trouvé" /></td></tr>
              )}
              {list.map(d => {
                const days = daysUntilExpiry(d.expiry)
                return (
                  <tr key={d.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-800">{d.name}</span>
                      {days < 0 && <span className="ml-2 text-[10px] bg-red-100 text-red-700 rounded-full px-2 py-0.5 font-bold">PÉRIMÉ</span>}
                      {days >= 0 && days <= 30 && <span className="ml-2 text-[10px] bg-amber-100 text-amber-700 rounded-full px-2 py-0.5 font-bold">{days}j</span>}
                    </td>
                    <td className="px-4 py-3"><span className="badge-slate">{d.category}</span></td>
                    <td className="px-4 py-3 font-bold" style={{ color: d.qty < d.minQty ? '#dc2626' : '#1e293b' }}>{d.qty} <span className="font-normal text-slate-400">{d.unit}</span></td>
                    <td className="px-4 py-3 text-slate-400">{d.minQty}</td>
                    <td className="px-4 py-3 text-slate-600">{d.price.toLocaleString('fr-FR')} F</td>
                    <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{new Date(d.expiry).toLocaleDateString('fr-FR')}</td>
                    <td className="px-4 py-3"><StatusBadge d={d} /></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button className="btn-secondary btn-sm p-1.5" onClick={() => setModal(d)} title="Modifier"><Pencil size={12} /></button>
                        <button className="btn-danger btn-sm p-1.5" onClick={() => handleDelete(d)} title="Supprimer"><Trash2 size={12} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal
          title={modal === 'add' ? 'Ajouter un médicament' : 'Modifier le médicament'}
          onClose={() => setModal(null)}
          wide
        >
          <DrugForm initial={modal !== 'add' ? modal : null} onSave={handleSave} onClose={() => setModal(null)} />
        </Modal>
      )}
    </div>
  )
}
