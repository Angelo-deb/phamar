import { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  PageHeader, Button, Badge, EmptyState, Input, Select,
} from "../components/ui";
import StatusBadge from "../components/StatusBadge";
import DrugModal from "../components/modals/DrugModal";
import { CATEGORIES, daysUntilExpiry, drugStatus } from "../lib/data";

export default function ArticlesPage() {
  const { drugs, addDrug, updateDrug, deleteDrug, toast } = useApp();
  const [search,   setSearch]   = useState("");
  const [catF,     setCatF]     = useState("");
  const [statusF,  setStatusF]  = useState("");
  const [modal,    setModal]    = useState(null); // null | "add" | <drug>

  const list = drugs.filter((d) => {
    const s = drugStatus(d);
    if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (catF && d.category !== catF) return false;
    if (statusF === "ok"      && s !== "ok") return false;
    if (statusF === "alert"   && !["low", "out", "expired", "expiring"].includes(s)) return false;
    if (statusF === "expired" && s !== "expired") return false;
    return true;
  });

  function handleSave(data) {
    if (modal === "add") { addDrug(data); toast("Article ajouté avec succès", "success"); }
    else { updateDrug({ ...modal, ...data }); toast("Article mis à jour", "success"); }
    setModal(null);
  }

  function handleDelete(d) {
    if (!confirm(`Supprimer "${d.name}" ?`)) return;
    deleteDrug(d.id); toast("Article supprimé", "success");
  }

  return (
    <div>
      <PageHeader
        title="Articles / Médicaments"
        subtitle={`${drugs.length} articles — ${drugs.filter((d) => drugStatus(d) === "ok").length} en stock normal`}
        action={
          <Button variant="primary" onClick={() => setModal("add")}>
            + Ajouter un article
          </Button>
        }
      />

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
          <Input
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un médicament..."
          />
        </div>
        <Select className="w-auto min-w-[160px]" value={catF} onChange={(e) => setCatF(e.target.value)}>
          <option value="">Toutes catégories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </Select>
        <Select className="w-auto min-w-[140px]" value={statusF} onChange={(e) => setStatusF(e.target.value)}>
          <option value="">Tous statuts</option>
          <option value="ok">En stock</option>
          <option value="alert">Alertes</option>
          <option value="expired">Périmés</option>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {["Médicament", "Catégorie", "Quantité", "Seuil", "Prix", "Expiration", "Statut", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {list.length === 0 && (
              <tr><td colSpan={8}><EmptyState icon="💊" message="Aucun article trouvé" /></td></tr>
            )}
            {list.map((d) => {
              const days = daysUntilExpiry(d.expiry);
              return (
                <tr key={d.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {d.name}
                    {days < 0 && (
                      <span className="ml-1.5 text-[10px] bg-red-100 text-red-700 rounded px-1.5 py-0.5 font-semibold">PÉRIMÉ</span>
                    )}
                    {days >= 0 && days <= 30 && (
                      <span className="ml-1.5 text-[10px] bg-amber-100 text-amber-700 rounded px-1.5 py-0.5 font-semibold">{days}j</span>
                    )}
                  </td>
                  <td className="px-4 py-3"><Badge variant="slate">{d.category}</Badge></td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${d.qty < d.minQty ? "text-red-600" : "text-slate-800"}`}>
                      {d.qty}
                    </span>
                    <span className="text-slate-400 ml-1">{d.unit}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{d.minQty}</td>
                  <td className="px-4 py-3 text-slate-600">{d.price.toLocaleString("fr-FR")} FCFA</td>
                  <td className="px-4 py-3 text-slate-400">
                    {new Date(d.expiry).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3"><StatusBadge drug={d} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Button variant="secondary" size="sm" onClick={() => setModal(d)}>✎</Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(d)}>✕</Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {modal && (
        <DrugModal
          initial={modal !== "add" ? modal : null}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
