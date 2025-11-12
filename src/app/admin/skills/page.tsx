// src/app/admin/skills/page.tsx
import { prisma } from '@/lib/prismaClient'
import Link from 'next/link'
import { deleteSkill } from '@/app/admin/skills/actions' 
import DeleteButton from '@/components/DeleteButton' 

async function getSkills() {
  const skills = await prisma.skills.findMany({
    orderBy: { category: 'asc' }, 
  })
  return skills
}

export default async function AdminSkillsPage() {
  const skills = await getSkills()

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl text-texto-principal">
          Gerenciar Competências
        </h1>
        <Link href="/admin" className="text-sm text-[color:var(--acento-verde)] hover:underline">
          &larr; Voltar ao Painel
        </Link>
      </div>

      <div className="mb-8">
        <Link 
          href="/admin/skills/new" 
          className="inline-block w-full text-center p-3 bg-[color:var(--acento-verde)] text-black rounded-lg font-semibold hover:opacity-90 transition-colors"
        >
          + Adicionar Nova Competência
        </Link>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-texto-secundario border-b border-zinc-700 pb-2">
          Competências Cadastradas
        </h2>
        
        {skills.length === 0 ? (
          <p className="text-zinc-400">Nenhuma competência cadastrada.</p>
        ) : (
          skills.map((skill) => (
            <div 
              key={skill.id} 
              className="p-4 border border-zinc-700 rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-texto-principal">{skill.name}</h3>
                  <p className="text-sm font-medium text-[color:var(--acento-laranja)]">{skill.category}</p>
                </div>
                
                <div className="flex items-center space-x-4 flex-shrink-0 ml-4">
                  <Link href={`/admin/skills/edit/${skill.id}`} className="text-sm text-blue-500 hover:underline">
                    Editar
                  </Link>
                  <span className="text-zinc-600">|</span>
                  <DeleteButton id={skill.id} deleteAction={deleteSkill} />
                </div>
              </div>
              
              <p className="text-zinc-400 mt-2 text-sm">
                {skill.description}
              </p>
            </div>
          ))
        )}
      </div>
    </>
  )
}