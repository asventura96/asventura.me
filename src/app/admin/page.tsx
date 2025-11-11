// src/app/admin/page.tsx
import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton' 

/**
 * Componente de botão reutilizável para o painel de admin.
 */
function AdminButton({ href, icon, label }: { href: string, icon: string, label: string }) {
  return (
    <Link 
      href={href} 
      className="flex flex-col items-center justify-center p-6 bg-[color:var(--acento-verde)] text-black rounded-lg font-semibold hover:opacity-80 transition-opacity"
    >
      <i className={`fas ${icon} text-3xl mb-2`}></i>
      <span>{label}</span>
    </Link>
  )
}

export default function AdminDashboard() {
  return (
    <div className="w-full max-w-5xl mx-auto p-8"> 
      
      <div className="flex justify-between items-center mb-12">
        <h1 
          className="text-3xl text-texto-principal"
          style={{ fontFamily: 'var(--font-concert-one)' }} 
        >
          Painel Administrativo
        </h1>
        {/* O Botão de Logout foi movido para baixo */}
      </div>
      
      <p className="text-texto-secundario mb-4">Seja bem-vindo ao painel de controle do seu currículo.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminButton href="/admin/profile" icon="fa-user-cog" label="Editar Perfil" />
        <AdminButton href="/admin/experiences" icon="fa-briefcase" label="Experiências" />
        <AdminButton href="/admin/skills" icon="fa-star" label="Competências" />
        <AdminButton href="/admin/education" icon="fa-graduation-cap" label="Formação" />
        <AdminButton href="/admin/courses" icon="fa-certificate" label="Cursos" />
        <AdminButton href="/admin/languages" icon="fa-language" label="Idiomas" />
      </div>

      <div className="mt-12 pt-8 border-t border-zinc-700">
        <p className="text-texto-secundario mb-4">Você está logado.</p>
        <LogoutButton />
      </div>

    </div> 
  )
}