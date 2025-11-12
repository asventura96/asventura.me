// src/app/admin/experiences/page.tsx
import { prisma } from '@/lib/prismaClient'
import { experiences } from '@prisma/client'
import Link from 'next/link'
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
    // O <main> foi removido. O layout principal cuida disso.
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl text-texto-principal">
          Gerenciar Experiências
        </h1>
        <Link href="/admin" className="text-sm text-[color:var(--acento-verde)] hover:underline">
          &larr; Voltar ao Painel
        </Link>
      </div>

      <div className="mb-8">
        <Link 
          href="/admin/experiences/new" 
          className="inline-block w-full text-center p-3 bg-[color:var(--acento-verde)] text-black rounded-lg font-semibold hover:opacity-90 transition-colors"
        >
          + Adicionar Nova Experiência
        </Link>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-texto-secundario border-b border-zinc-700 pb-2">
          Experiências Cadastradas
        </h2>

        {experiences.length === 0 ? (
          <p className="text-zinc-400">Nenhuma experiência cadastrada.</p>
        ) : (
          experiences.map((exp: experiences) => (
            <div 
              key={exp.id} 
              className="flex justify-between items-center p-4 border border-zinc-700 rounded-lg"
            >
              <div>
                <h3 className="font-semibold text-lg text-texto-principal">{exp.role}</h3>
                <p className="text-zinc-400">{exp.company}</p>
              </div>

              <div className="flex items-center space-x-4">
                <Link href={`/admin/experiences/edit/${exp.id}`} className="text-sm text-blue-500 hover:underline">
                  Editar
                </Link>
                <span className="text-zinc-600">|</span>
                <DeleteButton id={exp.id} deleteAction={deleteExperience} />
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}