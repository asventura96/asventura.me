// src/app/admin/education/new/page.tsx
import Link from 'next/link'
import { addEducation } from '@/app/admin/education/actions'
import EducationForm from '@/components/EducationForm' 

export default function NewEducationPage() {
  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-2xl">
      
      <div className="bg-white rounded-t-xl p-4 flex justify-between items-center border-b border-zinc-300">
        <h1 className="text-xl font-bold text-[color:var(--acento-verde)]">ADICIONAR FORMAÇÃO</h1>
        <Link href="/admin/education" className="text-sm hover:underline text-[color:var(--acento-verde)]">
          &larr; CANCELAR
        </Link>
      </div>

      <div className="p-8">
        <EducationForm 
          action={addEducation} 
          buttonText="SALVAR FORMAÇÃO"
        />
      </div>
    </div>
  )
}