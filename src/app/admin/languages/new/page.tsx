// src/app/admin/languages/new/page.tsx
import Link from 'next/link'
import { addLanguage } from '@/app/admin/languages/actions'
import LanguageForm from '@/components/LanguageForm'

export default function NewLanguagePage() {
  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-2xl">
      
      <div className="bg-white rounded-t-xl p-4 flex justify-between items-center border-b border-zinc-300">
        <h1 className="text-xl font-bold text-[color:var(--acento-verde)]">ADICIONAR IDIOMA</h1>
        <Link href="/admin/languages" className="text-sm hover:underline text-[color:var(--acento-verde)]">
          &larr; CANCELAR
        </Link>
      </div>

      <div className="p-8">
        <LanguageForm 
          action={addLanguage} 
          buttonText="SALVAR IDIOMA"
        />
      </div>
    </div>
  )
}