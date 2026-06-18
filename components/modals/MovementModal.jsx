import { useState } from "react";
import { Modal, FormGroup, Input, Select, Button } from "../ui";
import { REASONS_IN, REASONS_OUT, today } from "../../lib/data";
import { useApp } from "../../context/AppContext";

export default function MovementModal({ drug, onClose }) {
  const { addMovement, currentUser, toast } = useApp();
  const [f, setF] = useState({ type: "in", qty: "", reason: REASONS_IN[0], note: "" });

  function h(e) {
    const upd = { ...f, [e.target.name]: e.target.value };
    if (e.target.name === "type") {
      upd.reason = e.target.value === "in" ? REASONS_IN[0] : REASONS_OUT[0];
    }
    setF(upd);
  }

  function submit(e) {
    e.preventDefault();
    if (!f.qty || +f.qty <= 0) { alert("Quantité invalide"); return; }
    if (f.type === "out" && +f.qty > drug.qty) {
      alert("Quantité insuffisante en stock"); return;
    }
    addMovement({
      drugId: drug.id,
      drugName: drug.name,
      ...f,
      qty: +f.qty,
      user: currentUser.name,
      date: today(),
    });
    toast(`Mouvement enregistré pour ${drug.name}`, "success");
    onClose();
  }

  const reasons = f.type === "in" ? REASONS_IN : REASONS_OUT;

  return (
    <Modal
      title={`Mouvement — ${drug.name}`}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Annuler</Button>
          <Button variant="primary" onClick={submit}>Confirmer</Button>
        </>
      }
    >
      <form onSubmit={submit}>
        {/* Type selector */}
        <FormGroup label="Type de mouvement">
          <div className="flex gap-2">
            {["in", "out"].map((t) => (
              <label
                key={t}
                className={`flex-1 flex items-center gap-2.5 px-4 py-3 rounded-lg border cursor-pointer transition
                  ${f.type === t
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
              >
                <input
                  type="radio"
                  name="type"
                  value={t}
                  checked={f.type === t}
                  onChange={h}
                  className="accent-emerald-600"
                />
                <span className={`text-sm font-medium ${f.type === t ? "text-emerald-700" : "text-slate-600"}`}>
                  {t === "in" ? "↑ Entrée" : "↓ Sortie"}
                </span>
              </label>
            ))}
          </div>
        </FormGroup>

        <div className="grid grid-cols-2 gap-3">
          <FormGroup label="Quantité *">
            <Input name="qty" type="number" min="1" value={f.qty} onChange={h} required />
          </FormGroup>
          <FormGroup label="Stock actuel">
            <Input value={`${drug.qty} ${drug.unit}`} disabled className="bg-slate-50 text-slate-500" />
          </FormGroup>
        </div>

        <FormGroup label="Raison *">
          <Select name="reason" value={f.reason} onChange={h}>
            {reasons.map((r) => <option key={r}>{r}</option>)}
          </Select>
        </FormGroup>

        <FormGroup label="Note (optionnel)">
          <Input name="note" value={f.note} onChange={h} placeholder="Ex: Livraison ABC Pharma" />
        </FormGroup>
      </form>
    </Modal>
  );
}
