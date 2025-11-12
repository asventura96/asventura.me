// src/app/admin/education/edit/[id]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prismaClient'
import { updateEducation } from '@/app/admin/education/actions'
import EducationForm from '@/components/EducationForm'

async function getEducationById(id: string) {
  const educationId = parseInt(id, 10)
  if (isNaN(educationId)) {
    return null
  }
  const educationItem = await prisma.education.findUnique({
    where: { id: educationId },
  })
  return educationItem
}

export default async function EditEducationPage({ params }: { params: Promise<{ id: string }> }) {
  
  const { id } = await params;
  const educationItem = await getEducationById(id)

  if (!educationItem) {
    notFound()
  }
  
  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-2xl">
      
      <div className="bg-white rounded-t-xl p-4 flex justify-between items-center border-b border-zinc-300">
        <h1 className="text-xl font-bold text-[color:var(--acento-verde)]">EDITAR FORMAÇÃO</h1>
        <Link href="/admin/education" className="text-sm hover:underline text-[color:var(--acento-verde)]">
          &larr; CANCELAR
        </Link>
      </div>
      
      <div className="p-8">
        <EducationForm 
          action={updateEducation}
          initialData={educationItem}
          buttonText="SALVAR ALTERAÇÕES"
        />
      </div>
    </div>
  )
}