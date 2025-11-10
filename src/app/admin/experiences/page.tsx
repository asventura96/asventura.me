// src/app/admin/experiences/page.tsx
import { prisma } from '@/lib/prismaClient'
import Link from 'next/link'

// 1. Função para buscar os dados do banco
// (Igual à da home, mas só para experiências)
async function getExperiences() {
  const experiences = await prisma.experiences.findMany({
    orderBy: { id: 'desc' },
  })
  return experiences
}

// 2. A página
export default async function AdminExperiencesPage() {
  // Busca os dados no servidor antes da página carregar
  const experiences = await getExperiences()

  return (
    <div className="flex min-h-screen justify-center bg-zinc-100 dark:bg-zinc-900">
      <main className="w-full max-w-3xl p-8 my-12 bg-white dark:bg-black shadow-xl rounded-xl">
        
        {/* Cabeçalho e Botão de Voltar */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Gerenciar Experiências
          </h1>
          <Link href="/admin" className="text-sm text-indigo-600 hover:text-indigo-500">
            &larr; Voltar ao Painel
          </Link>
        </div>

        {/* Botão para Adicionar Novo */}
        <div className="mb-8">
          <Link 
            href="/admin/experiences/new" 
            className="inline-block w-full text-center p-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            + Adicionar Nova Experiência
          </Link>
        </div>

        {/* Lista de Experiências Atuais */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-zinc-100 border-b pb-2">
            Experiências Cadastradas
          </h2>
          
          {/* Verifica se tem experiências */}
          {experiences.length === 0 ? (
            <p className="text-gray-500 dark:text-zinc-400">Nenhuma experiência cadastrada.</p>
          ) : (
            // Faz o loop e mostra cada uma
            experiences.map((exp) => (
              <div 
                key={exp.id} 
                className="flex justify-between items-center p-4 border border-gray-200 dark:border-zinc-700 rounded-lg"
              >
                <div>
                  <h3 className="font-semibold text-lg text-black dark:text-white">{exp.role}</h3>
                  <p className="text-gray-600 dark:text-zinc-300">{exp.company}</p>
                </div>
                <div>
                  {/* (TODO: Botões de Editar/Excluir) */}
                  <Link href={`/admin/experiences/edit/${exp.id}`} className="text-sm text-blue-500 hover:underline">
                    Editar
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

      </main>
    </div>
  )
}