import './globals.css'

export const metadata = {
  title: 'PharmaStock — Gestion de pharmacie',
  description: 'Application de gestion de stock pour pharmacies',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
