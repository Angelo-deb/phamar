import { useState } from "react";
import { useApp } from "../context/AppContext";
import { PageHeader, Button, Badge, EmptyState, Select, Modal } from "../components/ui";
import MovementModal from "../components/modals/MovementModal";

export default function MouvementsPage() {
  const { drugs, movements } = useApp();
  const [drugFilter, setDrugFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [pickModal,  setPickModal]  = useState(false);
  const [moveTarget, setMoveTarget] = useState(null);

  const drugNames = [...new Set(movements.map((m) => m.drugName))];

  const list = [...movements]
    .sort((a, b) => b.id - a.id)
    .filter((m) => {
      if (drugFilter && m.drugName !== drugFilter) return false;
      if (typeFilter && m.type !== typeFilter) return false;
      return true;
    });

  return (
    <div>
      <PageHeader
        title="Mouvements de stock"
        subtitle={`${movements.length} opérations enregistrées`}
        action={
          <Button variant="primary" onClick={() => setPickModal(true)}>
            + Nouveau mouvement
          </Button>
        }
      />

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 mb-5">
        <Select
          className="w-auto min-w-[200px]"
          value={drugFilter}
          onChange={(e) => setDrugFilter(e.target.value)}
        >
          <option value="">Tous les articles</option>
          {drugNames.map((n) => <option key={n}>{n}</option>)}
        </Select>
        <Select
          className="w-auto min-w-[160px]"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">Entrées + Sorties</option>
          <option value="in">Entrées seulement</option>
          <option value="out">Sorties seulement</option>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {["Type", "Médicament", "Quantité", "Raison", "Note", "Utilisateur", "Date"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {list.length === 0 && (
              <tr><td colSpan={7}><EmptyState icon="📋" message="Aucun mouvement" /></td></tr>
            )}
            {list.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50 transition">
                <td className="px-4 py-3">
                  <Badge variant={m.type === "in" ? "green" : "red"}>
                    {m.type === "in" ? "↑ Entrée" : "↓ Sortie"}
                  </Badge>
                </td>
                <td className="px-4 py-3 font-medium text-slate-800">{m.drugName}</td>
                <td className="px-4 py-3">
                  <span className={`font-semibold ${m.type === "in" ? "text-emerald-600" : "text-red-500"}`}>
                    {m.type === "in" ? "+" : "-"}{m.qty}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">{m.reason}</td>
                <td className="px-4 py-3 text-slate-400">{m.note || "—"}</td>
                <td className="px-4 py-3 text-slate-600">{m.user}</td>
                <td className="px-4 py-3 text-slate-400">
                  {new Date(m.date).toLocaleDateString("fr-FR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pick article modal */}
      {pickModal && (
        <Modal title="Choisir un article" onClose={() => setPickModal(false)}>
          <p className="text-sm text-slate-500 mb-3">Sélectionnez l&apos;article concerné :</p>
          <div className="flex flex-col gap-2 max-h-72 overflow-y-auto scrollbar-thin pr-1">
            {drugs.map((d) => (
              <button
                key={d.id}
                className="flex items-center justify-between px-4 py-3 rounded-lg border border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 transition text-sm text-left"
                onClick={() => { setMoveTarget(d); setPickModal(false); }}
              >
                <span className="font-medium text-slate-800">{d.name}</span>
                <span className="text-slate-400">{d.qty} {d.unit}</span>
              </button>
            ))}
          </div>
        </Modal>
      )}

      {/* Movement form modal */}
      {moveTarget && (
        <MovementModal
          drug={moveTarget}
          onClose={() => setMoveTarget(null)}
        />
      )}
    </div>
  );
}
