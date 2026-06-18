'use client'
import { useState } from 'react'
import { useApp } from '../../lib/store'
import Modal from '../ui/Modal'
import EmptyState from '../ui/EmptyState'
import { Plus, Pencil, Search, Trash2, Building2 } from 'lucide-react'

function SupplierForm({ initial, onSave, onClose }) {
  const [f, setF] = useState(initial || { name: '', contact: '', email: '', address: '', active: true })
  function h(e) { setF(x => ({ ...x, [e.target.name]: e.target.value })) }
  function submit(e) {
    e.preventDefault()
    if (!f.name) return
    onSave(f)
  }
  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nom du fournisseur *</label>
        <input className="input-base" name="name" value={f.name} onChange={h} required />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Téléphone</label>
        <input className="input-base" name="contact" value={f.contact} onChange={h} />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
        <input className="input-base" name="email" type="email" value={f.email} onChange={h} />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Adresse</label>
        <input className="input-base" name="address" value={f.address} onChange={h} />
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <button type="button" className="btn-secondary" onClick={onClose}>Annuler</button>
        <button type="submit" className="btn-primary">{initial ? 'Modifier' : 'Ajouter'}</button>
      </div>
    </form>
  )
}

export default function FournisseursPage() {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier, toast } = useApp()
  const [modal, setModal] = useState(null)
  const [search, setSearch] = useState('')

  const list = suppliers.filter(s => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  function handleSave(data) {
    if (modal === 'add') { 
      addSupplier(data); 
      toast('Fournisseur ajouté', 'success') 
    } else { 
      updateSupplier({ ...modal, ...data }); 
      toast('Fournisseur mis à jour', 'success') 
    }
    setModal(null)
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6 relative overflow-hidden rounded-2xl p-8 shadow-sm flex items-start justify-between">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80')" }} />
        <div className="absolute inset-0 bg-slate-900/60" />
        <div className="relative z-10">
          <h2 className="font-display font-bold text-3xl text-white">
            Gestion des fournisseurs
          </h2>
          <p className="text-slate-200 text-sm mt-1">
            {list.length} fournisseur(s) enregistré(s)
          </p>
        </div>
        <button className="btn-primary relative z-10" onClick={() => setModal('add')}>
          <Plus size={15} /> Ajouter un fournisseur
        </button>
      </div>

      <div className="flex gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input-base pl-8" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un fournisseur..." />
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {['Nom','Contact','Email','Adresse','Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr><td colSpan={5}><EmptyState icon={<Building2 size={24}/>} text="Aucun fournisseur" /></td></tr>
            )}
            {list.map(s => (
              <tr key={s.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">
                <td className="px-4 py-3 font-semibold text-slate-800">{s.name}</td>
                <td className="px-4 py-3 text-slate-500">{s.contact || '-'}</td>
                <td className="px-4 py-3 text-slate-500">{s.email || '-'}</td>
                <td className="px-4 py-3 text-slate-500">{s.address || '-'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    <button className="btn-secondary btn-sm" onClick={() => setModal(s)}>
                      <Pencil size={11} /> Modifier
                    </button>
                    <button className="btn-danger btn-sm" onClick={() => {
                      if (confirm('Supprimer ce fournisseur ?')) { deleteSupplier(s.id); toast('Supprimé', 'success') }
                    }}>
                      <Trash2 size={11} /> Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal
          title={modal === 'add' ? 'Ajouter un fournisseur' : "Modifier le fournisseur"}
          onClose={() => setModal(null)}
        >
          <SupplierForm initial={modal !== 'add' ? modal : null} onSave={handleSave} onClose={() => setModal(null)} />
        </Modal>
      )}
    </div>
  )
}
