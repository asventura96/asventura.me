// src/app/admin/languages/edit/[id]/page.tsx
import { prisma } from '@/lib/prismaClient'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { notFound } from 'next/navigation'

// --- PARTE 1: BUSCAR O IDIOMA PELO ID ---
async function getLanguageById(id: string) {
  const langId = parseInt(id, 10)
  if (isNaN(langId)) {
    return null
  }
  const language = await prisma.language.findUnique({
    where: { id: langId },
  })
  return language
}

// --- PARTE 2: A LÓGICA DO SERVIDOR (Server Action) ---
async function updateLanguage(formData: FormData) {
  'use server' 

  const id = parseInt(formData.get('id') as string, 10)
  if (isNaN(id)) {
    console.error("ID inválido para atualização.")
    return
  }

  // 1. Pega os dados do formulário
  const data = {
    name: formData.get('name') as string,
    level: formData.get('level') as string,
  }

  // Validação
  if (!data.name || !data.level) {
    console.error("Dados do idioma inválidos.")
    return
  }

  // 2. ATUALIZA (Update) os dados no banco
  try {
    await prisma.language.update({
      where: { id: id }, // Acha o registro pelo ID
      data: data,
    })
  } catch (error) {
    console.error("Erro ao ATUALIZAR idioma:", error)
    return
  }

  // 3. Limpa o cache e redireciona
  revalidatePath('/') 
  revalidatePath('/admin/languages') 
  redirect('/admin/languages') // Volta para a lista
}

// --- PARTE 3: O FORMULÁRIO PRÉ-PREENCHIDO ---
export default async function EditLanguagePage({ params }: { params: Promise<{ id: string }> }) {

  // Desembrulha o ID (correção para Turbopack)
  const { id } = await params;

  // Busca os dados do idioma específico
  const language = await getLanguageById(id)

  // Se o ID for inválido ou não existir, mostra 404
  if (!language) {
    notFound()
  }

  const inputStyle = "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md shadow-sm dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"

  return (
    <div className="flex min-h-screen justify-center bg-zinc-100 dark:bg-zinc-900">
      <main className="w-full max-w-2xl p-8 my-12 bg-white dark:bg-black shadow-xl rounded-xl">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Editar Idioma
          </h1>
          <Link href="/admin/languages" className="text-sm text-indigo-600 hover:text-indigo-500">
            &larr; Cancelar
          </Link>
        </div>

        <form action={updateLanguage} className="space-y-6">

          {/* Campo de ID (escondido) */}
          <input type="hidden" name="id" value={language.id} />

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
              defaultValue={language.name}
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
              defaultValue={language.level}
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
              Salvar Alterações
            </button>
          </div>
        </form>

      </main>
    </div>
  )
}