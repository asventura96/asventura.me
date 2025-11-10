// src/app/admin/skills/new/page.tsx
import { prisma } from '@/lib/prismaClient'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import Link from 'next/link'

// --- PARTE 1: A LÓGICA DO SERVIDOR (Server Action ATUALIZADA) ---
async function addSkill(formData: FormData) {
  'use server' 

  // 1. Pega os dados do novo formulário
  const data = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    category: formData.get('category') as string,
  }

  // Validação
  if (!data.name || !data.description || !data.category) {
    console.error("Dados da competência incompletos.")
    return
  }

  // 2. Salva os dados no banco
  try {
    await prisma.skills.create({
      data: data, // Salva o objeto 'data' diretamente
    })
  } catch (error) {
    console.error("Erro ao salvar competência:", error)
    return
  }

  // 3. Limpa o cache
  revalidatePath('/') 
  revalidatePath('/admin/skills') 

  // 4. Redireciona
  redirect('/admin/skills')
}

// --- PARTE 2: O NOVO FORMULÁRIO (Componente React) ---
export default function NewSkillPage() {
  const inputStyle = "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md shadow-sm dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"

  return (
    <div className="flex min-h-screen justify-center bg-zinc-100 dark:bg-zinc-900">
      <main className="w-full max-w-2xl p-8 my-12 bg-white dark:bg-black shadow-xl rounded-xl">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Adicionar Competência
          </h1>
          <Link href="/admin/skills" className="text-sm text-indigo-600 hover:text-indigo-500">
            &larr; Cancelar
          </Link>
        </div>

        <form action={addSkill} className="space-y-6">

          {/* Linha 1: Nome e Categoria */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                Competência (Ex: Python & Django)
              </label>
              <input id="name" name="name" type="text" required className={inputStyle} />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                Categoria
              </label>
              {/* Sugiro um <select> para padronizar as categorias */}
              <select id="category" name="category" required className={inputStyle}>
                <option value="">Selecione uma categoria</option>
                <option value="Back-end">Back-end</option>
                <option value="Front-end">Front-end</option>
                <option value="Bancos de Dados">Bancos de Dados</option>
                <option value="Plataformas & Ferramentas">Plataformas & Ferramentas</option>
                <option value="Infraestrutura & Redes">Infraestrutura & Redes</option>
                <option value="Soft Skill">Soft Skill (Comportamental)</option>
              </select>
            </div>
          </div>

          {/* Linha 2: Descrição */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
              Descrição (O texto que o recrutador vai ler)
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              className={inputStyle}
              placeholder="Ex: Conhecimento prático em Python com experiência em desenvolvimento..."
            />
          </div>

          {/* Botão Salvar */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              Salvar Competência
            </button>
          </div>
        </form>

      </main>
    </div>
  )
}