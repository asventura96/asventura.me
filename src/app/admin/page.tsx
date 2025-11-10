// src/app/admin/page.tsx
import Link from 'next/link'
// --- 1. IMPORTA O NOVO BOTÃO ---
import LogoutButton from '@/components/LogoutButton' // Verifica o caminho

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 dark:bg-zinc-900">
      <main className="w-full max-w-3xl p-8 bg-white dark:bg-black shadow-xl rounded-xl">
        <h1 className="text-3xl font-bold text-black dark:text-white mb-8 text-center">
          Painel Administrativo
        </h1>

        <div className="space-y-4">
          {/* Links para Gerenciar */}
          <Link 
            href="/admin/experiences" 
            className="block w-full text-center p-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Gerenciar Experiências
          </Link>

          <Link 
            href="/admin/skills" 
            className="block w-full text-center p-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Gerenciar Competências
          </Link>

          <Link 
            href="/admin/profile" 
            className="block w-full text-center p-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Editar Perfil
          </Link>

          {/* Divisor */}
          <hr className="border-zinc-300 dark:border-zinc-700 my-6" />

          {/* --- 2. ADICIONA O BOTÃO DE LOGOUT AQUI --- */}
          <LogoutButton />

        </div>
      </main>
    </div>
  )
}