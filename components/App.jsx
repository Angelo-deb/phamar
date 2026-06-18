'use client'
import { useState } from 'react'
import { AppProvider, useApp } from '../lib/store'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import ArticlesPage from './pages/ArticlesPage'
import MouvementsPage from './pages/MouvementsPage'
import UsersPage from './pages/UsersPage'
import FournisseursPage from './pages/FournisseursPage'
import Sidebar from './layout/Sidebar'
import ToastContainer from './ui/Toast'

function InnerApp() {
  const { currentUser } = useApp()
  const [page, setPage] = useState('dashboard')

  if (!currentUser) return <AuthPage />

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar page={page} setPage={setPage} />
      <main className="flex-1 min-w-0 p-7 overflow-y-auto">
        {page === 'dashboard'  && <DashboardPage />}
        {page === 'articles'   && <ArticlesPage />}
        {page === 'fournisseurs' && <FournisseursPage />}
        {page === 'movements'  && <MouvementsPage />}
        {page === 'users'      && <UsersPage showRetired={false} />}
        {page === 'retired'    && <UsersPage showRetired={true} />}
      </main>
      <ToastContainer />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <InnerApp />
    </AppProvider>
  )
}
