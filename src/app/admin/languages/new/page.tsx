// src/app/admin/languages/new/page.tsx
import { prisma } from '@/lib/prismaClient'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import Link from 'next/link'

// --- PARTE 1: A LÓGICA DO SERVIDOR (Server Action) ---
async function addLanguage(formData: FormData) {
  'use server' // <-- Marca como Server Action

  // 1. Pega os dados do formulário
  const data = {
    name: formData.get('name') as string,
    level: formData.get('level') as string,
  }

  // Validação básica
  if (!data.name || !data.level) {
    console.error("Dados do idioma inválidos.")
    return
  }

  // 2. Salva os dados no banco de dados
  try {
    await prisma.language.create({
      data: data,
    })
  } catch (error) {
    console.error("Erro ao salvar idioma:", error)
    return
  }

  // 3. "Limpa o cache" das páginas
  revalidatePath('/') // <-- Atualiza o seu currículo PÚBLICO
  revalidatePath('/admin/languages') // <-- Atualiza a LISTA no admin

  // 4. Redireciona o usuário de volta para a lista
  redirect('/admin/languages')
}


// --- PARTE 2: O FORMULÁRIO (Componente React) ---
export default function NewLanguagePage() {
  const inputStyle = "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md shadow-sm dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"

  return (
    <div className="flex min-h-screen justify-center bg-zinc-100 dark:bg-zinc-900">
      <main className="w-full max-w-2xl p-8 my-12 bg-white dark:bg-black shadow-xl rounded-xl">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Adicionar Idioma
          </h1>
          <Link href="/admin/languages" className="text-sm text-indigo-600 hover:text-indigo-500">
            &larr; Cancelar
          </Link>
        </div>

        <form action={addLanguage} className="space-y-6">

          {/* Campo Nome (Name) */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
              Idioma (Ex: Inglês)
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className={inputStyle}
            />
          </div>

          {/* Campo Nível (Level) - Lista Suspensa */}
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
              Nível (Obrigatório)
            </label>
            <select
              id="level"
              name="level"
              required
              className={inputStyle}
            >
              <option value="">Selecione o nível</option>
              <option value="Nativo">Nativo</option>
              <option value="Fluente">Fluente</option>
              <option value="Avançado">Avançado</option>
              <option value="Intermediário">Intermediário</option>
              <option value="Básico">Básico</option>
            </select>
          </div>

          {/* Botão Salvar */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              Salvar Idioma
            </button>
          </div>
        </form>

      </main>
    </div>
  )
}