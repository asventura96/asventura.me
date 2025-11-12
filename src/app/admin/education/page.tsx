// src/app/admin/education/page.tsx
import { prisma } from '@/lib/prismaClient'
import Link from 'next/link'
import { deleteEducation } from '@/app/admin/education/actions'
import DeleteButton from '@/components/DeleteButton'

async function getEducationHistory() {
  const educationItems = await prisma.education.findMany({
    orderBy: { id: 'desc' },
  })
  return educationItems
}

// Inferindo o tipo a partir do retorno da função
type EducationArray = Awaited<ReturnType<typeof getEducationHistory>>
type EducationItem = EducationArray[number]

export default async function AdminEducationPage() {
  const educationHistory = await getEducationHistory()

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl text-texto-principal">
          Gerenciar Formação Acadêmica
        </h1>
        <Link
          href="/admin"
          className="text-sm text-[color:var(--acento-verde)] hover:underline"
        >
          &larr; Voltar ao Painel
        </Link>
      </div>

      <div className="mb-8">
        <Link
          href="/admin/education/new"
          className="inline-block w-full text-center p-3 bg-[color:var(--acento-verde)] text-black rounded-lg font-semibold hover:opacity-90 transition-colors"
        >
          + Adicionar Nova Formação
        </Link>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-texto-secundario border-b border-zinc-700 pb-2">
          Itens Cadastrados
        </h2>

        {educationHistory.length === 0 ? (
          <p className="text-zinc-400">Nenhuma formação cadastrada.</p>
        ) : (
          educationHistory.map((edu: EducationItem) => (
            <div
              key={edu.id}
              className="p-4 border border-zinc-700 rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-texto-principal">
                    {edu.course_name}
                  </h3>
                  <p className="text-zinc-400">{edu.institution}</p>
                  <p className="text-sm text-zinc-400">
                    {edu.level} · {edu.status} ({edu.start_date} -{' '}
                    {edu.end_date || 'Atual'})
                  </p>
                </div>

                <div className="flex items-center space-x-4 flex-shrink-0 ml-4">
                  <Link
                    href={`/admin/education/edit/${edu.id}`}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    Editar
                  </Link>
                  <span className="text-zinc-600">|</span>
                  <DeleteButton id={edu.id} deleteAction={deleteEducation} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}