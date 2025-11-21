// src/app/admin/skills/new/page.tsx
import Link from 'next/link'
import { addSkill } from '@/app/admin/skills/actions'
import SkillForm from '@/components/SkillForm' 

export default function NewSkillPage() {
  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-2xl">
      
      <div className="bg-white rounded-t-xl p-4 flex justify-between items-center border-b border-zinc-300">
        <h1 className="text-xl font-medium text-[color:var(--acento-verde)]">ADICIONAR COMPETÊNCIA</h1>
        <Link href="/admin/skills" className="text-sm hover:underline text-[color:var(--acento-verde)]">
          &larr; CANCELAR
        </Link>
      </div>

      <div className="p-8">
        <SkillForm 
          action={addSkill} 
          buttonText="SALVAR COMPETÊNCIA"
        />
      </div>
    </div>
  )
}