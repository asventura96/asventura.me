// src/app/admin/experiences/new/page.tsx
import Link from 'next/link'
import { addExperience } from '@/app/admin/experiences/actions'
import ExperienceForm from '@/components/ExperienceForm'

export default function NewExperiencePage() {
  return (
    // O container principal é um único cartão branco
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-2xl">

      {/* HEADER BAR (BRANCO): Texto em VERDE para contraste */}
      <div className="bg-white rounded-t-xl p-4 flex justify-between items-center border-b border-zinc-300">
        <h1 className="text-xl font-bold text-[color:var(--acento-verde)]">ADICIONAR EXPERIÊNCIA</h1>
        <Link href="/admin/experiences" className="text-sm hover:underline text-[color:var(--acento-verde)]">
          &larr; CANCELAR
        </Link>
      </div>

      {/* CORPO DO FORMULÁRIO */}
      <div className="p-8">
        <ExperienceForm 
          action={addExperience} 
          buttonText="SALVAR EXPERIÊNCIAS"
        />
      </div>
    </div>
  )
}