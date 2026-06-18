'use client'
import { useState } from 'react'
import { useApp } from '../../lib/store'
import Modal from '../ui/Modal'
import EmptyState from '../ui/EmptyState'
import { Plus, Pencil, UserX, UserCheck, Trash2, Search } from 'lucide-react'

function UserForm({ initial, onSave, onClose }) {
  const [f, setF] = useState(initial || { name: '', email: '', password: '', role: 'user' })
  function h(e) { setF(x => ({ ...x, [e.target.name]: e.target.value })) }
  function submit(e) {
    e.preventDefault()
    if (!f.name || !f.email) return
    onSave(f)
  }
  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nom complet *</label>
        <input className="input-base" name="name" value={f.name} onChange={h} required />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email *</label>
        <input className="input-base" name="email" type="email" value={f.email} onChange={h} required />
      </div>
      {!initial && (
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Mot de passe *</label>
          <input className="input-base" name="password" type="password" value={f.password} onChange={h} required />
        </div>
      )}
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Rôle</label>
        <select className="input-base" name="role" value={f.role} onChange={h}>
          <option value="user">Utilisateur autorisé</option>
          <option value="admin">Administrateur</option>
        </select>
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <button type="button" className="btn-secondary" onClick={onClose}>Annuler</button>
        <button type="submit" className="btn-primary">{initial ? 'Modifier' : 'Ajouter'}</button>
      </div>
    </form>
  )
}

export default function UsersPage({ showRetired }) {
  const { users, addUser, updateUser, deactivateUser, reactivateUser, deleteUser, currentUser, toast } = useApp()
  const [modal, setModal] = useState(null)
  const [search, setSearch] = useState('')

  const list = users.filter(u => {
    if (showRetired ? u.active : !u.active) return false
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  function handleSave(data) {
    if (modal === 'add') { addUser({ ...data, active: true }); toast('Utilisateur ajouté', 'success') }
    else { updateUser({ ...modal, ...data }); toast('Utilisateur mis à jour', 'success') }
    setModal(null)
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-2xl text-slate-900">
            {showRetired ? 'Utilisateurs retirés' : 'Gestion des utilisateurs'}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {list.length} utilisateur(s) {showRetired ? 'désactivé(s)' : 'actif(s)'}
          </p>
        </div>
        {!showRetired && (
          <button className="btn-primary" onClick={() => setModal('add')}>
            <Plus size={15} /> Ajouter
          </button>
        )}
      </div>

      {showRetired && (
        <div
          className="relative rounded-2xl overflow-hidden mb-5 p-5"
          style={{
            backgroundImage: "linear-gradient(135deg,rgba(30,41,59,0.94) 0%,rgba(51,65,85,0.92) 100%), url('https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=900&q=80')",
            backgroundSize: 'cover', backgroundPosition: 'center',
          }}
        >
          <p className="text-slate-300 text-sm">
            <span className="text-white font-semibold">Utilisateurs désactivés</span> — Ces comptes ne peuvent plus se connecter. Vous pouvez les réactiver ou les supprimer définitivement.
          </p>
        </div>
      )}

      <div className="flex gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input-base pl-8" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." />
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {['Nom','Email','Rôle','Statut','Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr><td colSpan={5}><EmptyState icon="👥" text="Aucun utilisateur" /></td></tr>
            )}
            {list.map(u => (
              <tr key={u.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">
                <td className="px-4 py-3">
                  <span className="font-semibold text-slate-800">{u.name}</span>
                  {u.id === currentUser.id && <span className="badge-blue ml-2">Vous</span>}
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={u.role === 'admin' ? 'badge-blue' : 'badge-slate'}>
                    {u.role === 'admin' ? 'Admin' : 'Autorisé'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={u.active ? 'badge-green' : 'badge-red'}>
                    {u.active ? 'Actif' : 'Désactivé'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    {!showRetired && u.id !== currentUser.id && (
                      <>
                        <button className="btn-secondary btn-sm" onClick={() => setModal(u)}>
                          <Pencil size={11} /> Modifier
                        </button>
                        <button className="btn-danger btn-sm" onClick={() => {
                          if (confirm('Désactiver cet utilisateur ?')) { deactivateUser(u.id); toast('Utilisateur désactivé', 'success') }
                        }}>
                          <UserX size={11} /> Désactiver
                        </button>
                      </>
                    )}
                    {showRetired && (
                      <>
                        <button className="btn-primary btn-sm" onClick={() => { reactivateUser(u.id); toast('Utilisateur réactivé', 'success') }}>
                          <UserCheck size={11} /> Réactiver
                        </button>
                        <button className="btn-danger btn-sm" onClick={() => {
                          if (confirm('Supprimer définitivement ?')) { deleteUser(u.id); toast('Supprimé', 'success') }
                        }}>
                          <Trash2 size={11} /> Supprimer
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal
          title={modal === 'add' ? 'Ajouter un utilisateur' : "Modifier l'utilisateur"}
          onClose={() => setModal(null)}
        >
          <UserForm initial={modal !== 'add' ? modal : null} onSave={handleSave} onClose={() => setModal(null)} />
        </Modal>
      )}
    </div>
  )
}
