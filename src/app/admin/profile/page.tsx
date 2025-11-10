// src/app/admin/profile/page.tsx
import { prisma } from '@/lib/prismaClient'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { notFound } from 'next/navigation'

// --- PARTE 1: BUSCAR O PERFIL (Sempre o ID=1) ---
async function getProfile() {
  const profile = await prisma.profile.findUnique({
    where: { id: 1 }, // O teu perfil é sempre o registro 1
  })

  // Se por algum motivo o registro 1 não existir 
  // (ex: banco de dados vazio), criamos um temporário.
  if (!profile) {
    return { name: "André Ventura", title: "Engenheiro de Computação" }
  }

  return profile
}

// --- PARTE 2: A LÓGICA DO SERVIDOR (Server Action) ---
async function updateProfile(formData: FormData) {
  'use server' // <-- Marca como Server Action

  // 1. Pega os dados do formulário
  const data = {
    name: formData.get('name') as string,
    title: formData.get('title') as string,
  }

  if (!data.name || !data.title) {
    console.error("Dados do perfil inválidos.")
    return
  }

  // 2. ATUALIZA (Update) os dados no banco
  // Usamos 'upsert' (Update or Insert) para garantir que
  // o registro 1 seja criado caso ele não exista.
  try {
    await prisma.profile.upsert({
      where: { id: 1 }, // Acha o registro com ID 1
      update: data,      // Se achar, atualiza com os novos dados
      create: {          // Se NÃO achar, cria o registro 1
        id: 1,
        ...data,
      },
    })
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error)
    return
  }

  // 3. "Limpa o cache" das páginas
  revalidatePath('/') // <-- Atualiza o seu currículo PÚBLICO
  revalidatePath('/admin/profile') // <-- Atualiza esta página

  // (Não precisamos de redirect, ficamos na mesma página)
}


// --- PARTE 3: O FORMULÁRIO (Componente React) ---
export default async function EditProfilePage() {
  // Busca os dados atuais para pré-preencher
  const profile = await getProfile()

  const inputStyle = "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md shadow-sm dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"

  return (
    <div className="flex min-h-screen justify-center bg-zinc-100 dark:bg-zinc-900">
      <main className="w-full max-w-2xl p-8 my-12 bg-white dark:bg-black shadow-xl rounded-xl">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Editar Perfil
          </h1>
          <Link href="/admin" className="text-sm text-indigo-600 hover:text-indigo-500">
            &larr; Voltar ao Painel
          </Link>
        </div>

        <form action={updateProfile} className="space-y-6">

          {/* Campo Nome (Name) */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
              Seu Nome (Ex: André Ventura)
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className={inputStyle}
              defaultValue={profile.name}
            />
          </div>

          {/* Campo Título (Title) */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
              Seu Título (Ex: Engenheiro de Computação)
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className={inputStyle}
              defaultValue={profile.title}
            />
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

        {/* Mensagem de sucesso (opcional) */}
        <p className="mt-4 text-sm text-center text-gray-500 dark:text-zinc-400">
          As alterações serão salvas e atualizadas no site público.
        </p>

      </main>
    </div>
  )
}