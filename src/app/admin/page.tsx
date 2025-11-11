// src/app/admin/page.tsx (Limpo e Estilizado)
import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton' 

export default function AdminDashboard() {
  // Este código agora renderiza DENTRO do 'layout.tsx' (Passo 1)
  // Removemos o <main> e <div> que estavam "cagados"
  return (
    <> 
      <h1 className="text-3xl text-texto-principal mb-8 text-center">
        Painel Administrativo
      </h1>

      <div className="space-y-4">
        {/* Botões do Admin (Roxo) */}
        <Link href="/admin/experiences" className="block w-full text-center p-4 bg-[color:var(--acento-roxo)] text-white rounded-lg font-medium hover:opacity-90 transition-colors">
          Gerenciar Experiências
        </Link>
        <Link href="/admin/skills" className="block w-full text-center p-4 bg-[color:var(--acento-roxo)] text-white rounded-lg font-medium hover:opacity-90 transition-colors">
          Gerenciar Competências
        </Link>
        <Link href="/admin/education" className="block w-full text-center p-4 bg-[color:var(--acento-roxo)] text-white rounded-lg font-medium hover:opacity-90 transition-colors">
          Gerenciar Formação Acadêmica
        </Link>
        <Link href="/admin/courses" className="block w-full text-center p-4 bg-[color:var(--acento-roxo)] text-white rounded-lg font-medium hover:opacity-90 transition-colors">
          Gerenciar Cursos e Certificações
        </Link>
        <Link href="/admin/languages" className="block w-full text-center p-4 bg-[color:var(--acento-roxo)] text-white rounded-lg font-medium hover:opacity-90 transition-colors">
          Gerenciar Idiomas
        </Link>
        <Link href="/admin/profile" className="block w-full text-center p-4 bg-[color:var(--acento-roxo)] text-white rounded-lg font-medium hover:opacity-90 transition-colors">
          Editar Perfil
        </Link>

        <hr className="border-zinc-700 my-6" />

        {/* Botão de Logout (Laranja) */}
        <LogoutButton /> 
      </div>
    </>
  )
}