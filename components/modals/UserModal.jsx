import { useState } from "react";
import { Modal, FormGroup, Input, Select, Button } from "../ui";

export default function UserModal({ initial, onSave, onClose }) {
  const [f, setF] = useState(
    initial || { name: "", email: "", password: "", role: "user" }
  );
  function h(e) { setF((x) => ({ ...x, [e.target.name]: e.target.value })); }

  function submit(e) {
    e.preventDefault();
    if (!f.name || !f.email) return;
    onSave(f);
  }

  return (
    <Modal
      title={initial ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Annuler</Button>
          <Button variant="primary" onClick={submit}>{initial ? "Modifier" : "Ajouter"}</Button>
        </>
      }
    >
      <form onSubmit={submit}>
        <FormGroup label="Nom complet *">
          <Input name="name" value={f.name} onChange={h} required placeholder="Dr. Jean Dupont" />
        </FormGroup>
        <FormGroup label="Email *">
          <Input name="email" type="email" value={f.email} onChange={h} required placeholder="email@pharmacie.cm" />
        </FormGroup>
        {!initial && (
          <FormGroup label="Mot de passe *">
            <Input name="password" type="password" value={f.password} onChange={h} required placeholder="••••••••" />
          </FormGroup>
        )}
        <FormGroup label="Rôle">
          <Select name="role" value={f.role} onChange={h}>
            <option value="user">Utilisateur autorisé</option>
            <option value="admin">Administrateur</option>
          </Select>
        </FormGroup>
      </form>
    </Modal>
  );
}
