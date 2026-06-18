import { useState } from "react";
import { Modal, FormGroup, Input, Select, Button } from "../ui";
import { CATEGORIES, today } from "../../lib/data";

export default function DrugModal({ initial, onSave, onClose }) {
  const [f, setF] = useState(
    initial || {
      name: "", qty: "", minQty: "", price: "",
      category: "Antalgiques", expiry: today(365), unit: "boîte",
    }
  );

  function h(e) { setF((x) => ({ ...x, [e.target.name]: e.target.value })); }

  function submit(e) {
    e.preventDefault();
    if (!f.name || !f.qty || !f.minQty || !f.price || !f.expiry) return;
    onSave({ ...f, qty: +f.qty, minQty: +f.minQty, price: +f.price });
  }

  return (
    <Modal
      title={initial ? "Modifier le médicament" : "Ajouter un médicament"}
      onClose={onClose}
      wide
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Annuler</Button>
          <Button variant="primary" onClick={submit}>Enregistrer</Button>
        </>
      }
    >
      <form onSubmit={submit}>
        <FormGroup label="Nom du médicament *">
          <Input name="name" value={f.name} onChange={h} required placeholder="Ex: Amoxicilline 500mg" />
        </FormGroup>

        <div className="grid grid-cols-2 gap-3">
          <FormGroup label="Quantité *">
            <Input name="qty" type="number" min="0" value={f.qty} onChange={h} required />
          </FormGroup>
          <FormGroup label="Seuil d'alerte *">
            <Input name="minQty" type="number" min="1" value={f.minQty} onChange={h} required />
          </FormGroup>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormGroup label="Prix unitaire (FCFA) *">
            <Input name="price" type="number" min="0" value={f.price} onChange={h} required />
          </FormGroup>
          <FormGroup label="Unité">
            <Select name="unit" value={f.unit} onChange={h}>
              {["boîte", "flacon", "ampoule", "sachet", "comprimé", "tube", "litre"].map((u) => (
                <option key={u}>{u}</option>
              ))}
            </Select>
          </FormGroup>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormGroup label="Catégorie">
            <Select name="category" value={f.category} onChange={h}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </Select>
          </FormGroup>
          <FormGroup label="Date d'expiration *">
            <Input name="expiry" type="date" value={f.expiry} onChange={h} required />
          </FormGroup>
        </div>
      </form>
    </Modal>
  );
}
