/* Este é um Componente de Servidor por padrão.
  Ele vai rodar no servidor, seguro e protegido pelo middleware.
*/
import Link from 'next/link'

// Esta será a página em http://localhost:3000/admin
export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 dark:bg-zinc-900">
      <main className="w-full max-w-3xl p-8 bg-white dark:bg-black shadow-xl rounded-xl">
        <h1 className="text-3xl font-bold text-black dark:text-white mb-8 text-center">
          Painel Administrativo
        </h1>
        
        <div className="space-y-4">
          {/* Link para Gerenciar Experiências */}
          <Link 
            href="/admin/experiences" 
            className="block w-full text-center p-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Gerenciar Experiências
          </Link>

          {/* Link para Gerenciar Skills */}
          <Link 
            href="/admin/skills" 
            className="block w-full text-center p-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Gerenciar Competências
          </Link>

          {/* Link para Editar Perfil */}
          <Link 
            href="/admin/profile" 
            className="block w-full text-center p-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Editar Perfil
          </Link>

          {/* TODO: Adicionar um botão de Logout */}
        </div>
      </main>
    </div>
  )
}