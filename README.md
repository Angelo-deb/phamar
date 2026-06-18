# PharmaStock — Application de gestion de stock pharmacie

Stack : **Next.js 14** + **Tailwind CSS v3** + **Recharts** + **Lucide React**

## Installation rapide

```bash
# 1. Cloner / dézipper le projet
cd pharma-stock

# 2. Installer les dépendances
npm install

# 3. Lancer en développement
npm run dev
```

Ouvrez http://localhost:3000

## Compte démo
- **Admin** : admin@pharma.cm / admin123
- **Utilisateur** : alice@pharma.cm / pass123

## Structure du projet

```
pharma-stock/
├── app/
│   ├── layout.jsx        ← Layout Next.js (App Router)
│   ├── page.jsx          ← Point d'entrée
│   └── globals.css       ← Tailwind + composants CSS
├── components/
│   ├── App.jsx           ← Composant racine + routing
│   ├── layout/
│   │   └── Sidebar.jsx   ← Barre de navigation latérale
│   ├── pages/
│   │   ├── AuthPage.jsx       ← Connexion / Inscription
│   │   ├── DashboardPage.jsx  ← Tableau de bord + graphique
│   │   ├── ArticlesPage.jsx   ← CRUD médicaments
│   │   ├── MouvementsPage.jsx ← Entrées / Sorties
│   │   └── UsersPage.jsx      ← Gestion utilisateurs + retirés
│   └── ui/
│       ├── Modal.jsx
│       ├── Toast.jsx
│       ├── StatusBadge.jsx
│       └── EmptyState.jsx
├── lib/
│   ├── data.js           ← Données initiales + helpers
│   └── store.jsx         ← Context API (état global)
├── tailwind.config.js
├── postcss.config.js
└── next.config.js
```

## Fonctionnalités
- ✅ Authentification (connexion / inscription)
- ✅ Rôles admin / utilisateur autorisé
- ✅ Dashboard avec graphique Recharts 7 jours
- ✅ CRUD médicaments avec alertes visuelles
- ✅ Mouvements de stock (entrée/sortie) avec traçabilité
- ✅ Gestion utilisateurs (admin seulement)
- ✅ Désactivation / réactivation / suppression d'utilisateurs
- ✅ Images de pharmacie en arrière-plan (Unsplash)
- ✅ Toasts de confirmation
- ✅ Filtres et recherche

## Pour connecter un vrai backend (Node/Express + MongoDB)

Remplacez les fonctions du store (`lib/store.jsx`) par des appels `fetch` :

```js
// Exemple
async function login(email, password) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  const data = await res.json()
  if (data.token) {
    localStorage.setItem('token', data.token)
    setCurrentUser(data.user)
    return true
  }
  return false
}
```
