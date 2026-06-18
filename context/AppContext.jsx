import { createContext, useContext, useState, useRef, useEffect } from "react";
import {
  INITIAL_USERS,
  INITIAL_DRUGS,
  INITIAL_MOVEMENTS,
  generateId,
} from "../lib/data";

const AppCtx = createContext(null);

export function AppProvider({ children }) {
  const [users,     setUsers]     = useState(INITIAL_USERS);
  const [drugs,     setDrugs]     = useState(INITIAL_DRUGS);
  const [movements, setMovements] = useState(INITIAL_MOVEMENTS);
  const [currentUser, setCurrentUser] = useState(null);
  const [toasts,    setToasts]    = useState([]);
  const toastRef = useRef(0);

  // ── Toast ──────────────────────────────────────────────────────────────────
  function toast(msg, type = "success") {
    const id = ++toastRef.current;
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }

  // ── Auth ───────────────────────────────────────────────────────────────────
  function login(email, password) {
    const u = users.find(
      (x) => x.email === email && x.password === password && x.active
    );
    if (u) { setCurrentUser(u); return true; }
    return false;
  }

  function register(data) {
    const u = { ...data, id: generateId(users), active: true };
    setUsers((us) => [...us, u]);
    setCurrentUser(u);
  }

  function logout() { setCurrentUser(null); }

  // ── Drugs ──────────────────────────────────────────────────────────────────
  function addDrug(d) {
    setDrugs((ds) => [...ds, { ...d, id: generateId(ds) }]);
  }
  function updateDrug(d) {
    setDrugs((ds) => ds.map((x) => (x.id === d.id ? d : x)));
  }
  function deleteDrug(id) {
    setDrugs((ds) => ds.filter((x) => x.id !== id));
  }

  // ── Movements ─────────────────────────────────────────────────────────────
  function addMovement(m) {
    const id = generateId(movements);
    setMovements((ms) => [...ms, { ...m, id }]);
    setDrugs((ds) =>
      ds.map((d) => {
        if (d.id !== m.drugId) return d;
        return {
          ...d,
          qty: m.type === "in" ? d.qty + m.qty : d.qty - m.qty,
        };
      })
    );
  }

  // ── Users ─────────────────────────────────────────────────────────────────
  function addUser(u) {
    setUsers((us) => [...us, { ...u, id: generateId(us) }]);
  }
  function updateUser(u) {
    setUsers((us) => us.map((x) => (x.id === u.id ? u : x)));
    // keep currentUser in sync if they edited themselves
    if (currentUser && u.id === currentUser.id) setCurrentUser(u);
  }
  function deactivateUser(id) {
    setUsers((us) => us.map((x) => (x.id === id ? { ...x, active: false } : x)));
  }
  function reactivateUser(id) {
    setUsers((us) => us.map((x) => (x.id === id ? { ...x, active: true } : x)));
  }
  function deleteUser(id) {
    setUsers((us) => us.filter((x) => x.id !== id));
  }

  return (
    <AppCtx.Provider
      value={{
        users, drugs, movements, currentUser,
        login, register, logout, toast, toasts,
        addDrug, updateDrug, deleteDrug,
        addMovement,
        addUser, updateUser, deactivateUser, reactivateUser, deleteUser,
      }}
    >
      {children}
    </AppCtx.Provider>
  );
}

export function useApp() {
  return useContext(AppCtx);
}
