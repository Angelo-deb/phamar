'use client'
import { createContext, useContext, useState, useRef, useEffect } from 'react'
import { generateId, today, INITIAL_USERS, INITIAL_DRUGS, SEED_MOVEMENTS, INITIAL_SUPPLIERS } from './data'

const AppCtx = createContext(null)
export const useApp = () => useContext(AppCtx)

export function AppProvider({ children }) {
  const [users,     setUsers]     = useState(INITIAL_USERS)
  const [drugs,     setDrugs]     = useState(INITIAL_DRUGS)
  const [movements, setMovements] = useState(SEED_MOVEMENTS)
  const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS)
  const [currentUser, setCurrentUser] = useState(null)
  const [toasts,    setToasts]    = useState([])
  const toastRef = useRef(0)

  function toast(msg, type = 'success') {
    const id = ++toastRef.current
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200)
  }

  function login(email, password) {
    const u = users.find(x => x.email === email && x.password === password && x.active)
    if (u) { setCurrentUser(u); return true }
    return false
  }
  function register(data) {
    const u = { ...data, id: generateId(users), active: true }
    setUsers(us => [...us, u])
    setCurrentUser(u)
  }
  function logout() { setCurrentUser(null) }

  function addDrug(d)    { setDrugs(ds => [...ds, { ...d, id: generateId(ds) }]) }
  function updateDrug(d) { setDrugs(ds => ds.map(x => x.id === d.id ? d : x)) }
  function deleteDrug(id){ setDrugs(ds => ds.filter(x => x.id !== id)) }

  function addMovement(m) {
    setMovements(ms => [...ms, { ...m, id: generateId(ms) }])
    setDrugs(ds => ds.map(d => {
      if (d.id !== m.drugId) return d
      return { ...d, qty: m.type === 'in' ? d.qty + m.qty : d.qty - m.qty }
    }))
  }

  function addUser(u)        { setUsers(us => [...us, { ...u, id: generateId(us) }]) }
  function updateUser(u)     { setUsers(us => us.map(x => x.id === u.id ? u : x)) }
  function deactivateUser(id){ setUsers(us => us.map(x => x.id === id ? { ...x, active: false } : x)) }
  function reactivateUser(id){ setUsers(us => us.map(x => x.id === id ? { ...x, active: true }  : x)) }
  function deleteUser(id)    { setUsers(us => us.filter(x => x.id !== id)) }

  function addSupplier(s)    { setSuppliers(ss => [...ss, { ...s, id: generateId(ss) }]) }
  function updateSupplier(s) { setSuppliers(ss => ss.map(x => x.id === s.id ? s : x)) }
  function deleteSupplier(id){ setSuppliers(ss => ss.filter(x => x.id !== id)) }

  return (
    <AppCtx.Provider value={{
      users, drugs, movements, suppliers, currentUser, toasts,
      login, register, logout, toast,
      addDrug, updateDrug, deleteDrug, addMovement,
      addUser, updateUser, deactivateUser, reactivateUser, deleteUser,
      addSupplier, updateSupplier, deleteSupplier,
    }}>
      {children}
    </AppCtx.Provider>
  )
}
