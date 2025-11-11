// src/app/admin/experiences/page.tsx
import { prisma } from '@/lib/prismaClient'
import Link from 'next/link'

// Importa a Server Action de exclusão e o novo botão genérico
import { deleteExperience } from '@/app/admin/experiences/actions' 
import DeleteButton from '@/components/DeleteButton' 

async function getExperiences() {
  const experiences = await prisma.experiences.findMany({
    orderBy: { id: 'desc' },
  })
  return experiences
}

export default async function AdminExperiencesPage() {
  const experiences = await getExperiences()

  return (
    <div className="flex min-h-screen justify-center bg-zinc-100 dark:bg-zinc-900">
      <main className="w-full max-w-3xl p-8 my-12 bg-white dark:bg-black shadow-xl rounded-xl">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Gerenciar Experiências
          </h1>
          <Link href="/admin" className="text-sm text-indigo-600 hover:text-indigo-500">
            &larr; Voltar ao Painel
          </Link>
        </div>

        <div className="mb-8">
          <Link 
            href="/admin/experiences/new" 
            className="inline-block w-full text-center p-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            + Adicionar Nova Experiência
          </Link>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-zinc-100 border-b pb-2">
            Experiências Cadastradas
          </h2>

          {experiences.length === 0 ? (
            <p className="text-gray-500 dark:text-zinc-400">Nenhuma experiência cadastrada.</p>
          ) : (
            experiences.map((exp) => (
              <div 
                key={exp.id} 
                className="flex justify-between items-center p-4 border border-gray-200 dark:border-zinc-700 rounded-lg"
              >
                <div>
                  <h3 className="font-semibold text-lg text-black dark:text-white">{exp.role}</h3>
                  <p className="text-gray-600 dark:text-zinc-300">{exp.company}</p>
                </div>

                <div className="flex items-center space-x-4">
                  <Link href={`/admin/experiences/edit/${exp.id}`} className="text-sm text-blue-500 hover:underline">
                    Editar
                  </Link>
                  <span className="text-gray-300 dark:text-zinc-600">|</span>

                  {/* Usamos o botão genérico e passamos a AÇÃO específica
                    (deleteExperience) como uma prop.
                  */}
                  <DeleteButton id={exp.id} deleteAction={deleteExperience} />

                </div>

              </div>
            ))
          )}
        </div>

      </main>
    </div>
  )
}