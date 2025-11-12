// src/app/admin/skills/edit/[id]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prismaClient'
import { updateSkill } from '@/app/admin/skills/actions'
import SkillForm from '@/components/SkillForm'

async function getSkillById(id: string) {
  const skillId = parseInt(id, 10)
  if (isNaN(skillId)) {
    return null
  }
  const skill = await prisma.skills.findUnique({
    where: { id: skillId },
  })
  return skill
}

export default async function EditSkillPage({ params }: { params: Promise<{ id: string }> }) {
  
  const { id } = await params;
  const skill = await getSkillById(id)

  if (!skill) {
    notFound()
  }
  
  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-2xl">
      
      <div className="bg-white rounded-t-xl p-4 flex justify-between items-center border-b border-zinc-300">
        <h1 className="text-xl font-bold text-[color:var(--acento-verde)]">EDITAR COMPETÊNCIA</h1>
        <Link href="/admin/skills" className="text-sm hover:underline text-[color:var(--acento-verde)]">
          &larr; CANCELAR
        </Link>
      </div>
      
      <div className="p-8">
        <SkillForm 
          action={updateSkill}
          initialData={skill}
          buttonText="SALVAR ALTERAÇÕES"
        />
      </div>
    </div>
  )
}