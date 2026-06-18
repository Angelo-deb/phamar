import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Alert, Button, FormGroup, Input, Select } from "../components/ui";

export default function AuthPage() {
  const { login, register, users } = useApp();
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [err, setErr] = useState("");

  function h(e) { setForm((f) => ({ ...f, [e.target.name]: e.target.value })); }

  function submit(e) {
    e.preventDefault();
    setErr("");
    if (tab === "login") {
      if (!login(form.email, form.password)) setErr("Email ou mot de passe incorrect.");
    } else {
      if (!form.name || !form.email || !form.password) { setErr("Tous les champs sont requis."); return; }
      if (users.find((u) => u.email === form.email)) { setErr("Email déjà utilisé."); return; }
      register(form);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-emerald-900 p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-sm">
        {/* Logo */}
        <h1 className="font-display text-2xl font-bold text-slate-900 mb-1">
          Pharma<span className="text-emerald-600">Stock</span>
        </h1>
        <p className="text-slate-500 text-sm mb-7">Gestion de stock pour pharmacies</p>

        {/* Tabs */}
        <div className="flex gap-0 border border-slate-200 rounded-lg p-1 mb-6">
          {["login", "register"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition
                ${tab === t ? "bg-emerald-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              {t === "login" ? "Connexion" : "Inscription"}
            </button>
          ))}
        </div>

        {err && <Alert variant="red">{err}</Alert>}

        <form onSubmit={submit}>
          {tab === "register" && (
            <FormGroup label="Nom complet">
              <Input name="name" value={form.name} onChange={h} placeholder="Dr. Jean Dupont" />
            </FormGroup>
          )}
          <FormGroup label="Email">
            <Input name="email" type="email" value={form.email} onChange={h} placeholder="email@pharmacie.cm" />
          </FormGroup>
          <FormGroup label="Mot de passe">
            <Input name="password" type="password" value={form.password} onChange={h} placeholder="••••••••" />
          </FormGroup>
          {tab === "register" && (
            <FormGroup label="Rôle">
              <Select name="role" value={form.role} onChange={h}>
                <option value="user">Utilisateur autorisé</option>
                <option value="admin">Administrateur</option>
              </Select>
            </FormGroup>
          )}
          <Button variant="primary" size="lg" className="w-full justify-center mt-1" type="submit">
            {tab === "login" ? "Se connecter" : "Créer le compte"}
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-400">
          Démo — admin@pharma.cm / admin123
        </div>
      </div>
    </div>
  );
}
