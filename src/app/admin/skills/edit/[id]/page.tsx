// src/app/admin/skills/edit/[id]/page.tsx
import { prisma } from '@/lib/prismaClient'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { notFound } from 'next/navigation'

// --- PARTE 1: BUSCAR A COMPETÊNCIA PELO ID ---
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

// --- PARTE 2: A LÓGICA DO SERVIDOR (Server Action ATUALIZADA) ---
async function updateSkill(formData: FormData) {
  'use server' 

  const id = parseInt(formData.get('id') as string, 10)
  if (isNaN(id)) {
    console.error("ID inválido para atualização.")
    return
  }

  // 1. Pega os dados do formulário
  const data = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    category: formData.get('category') as string,
  }

  // 2. ATUALIZA (Update) os dados no banco
  try {
    await prisma.skills.update({
      where: { id: id }, // Acha o registro pelo ID
      data: data,
    })
  } catch (error) {
    console.error("Erro ao ATUALIZAR competência:", error)
    return
  }

  // 3. Limpa o cache e redireciona
  revalidatePath('/') 
  revalidatePath('/admin/skills') 
  redirect('/admin/skills')
}

// --- PARTE 3: O FORMULÁRIO PRÉ-PREENCHIDO ---
export default async function EditSkillPage({ params }: { params: Promise<{ id: string }> }) {

  // Desembrulha o ID (correção para Turbopack)
  const { id } = await params;

  // Busca os dados da competência específica
  const skill = await getSkillById(id)

  // Se o ID for inválido ou não existir, mostra 404
  if (!skill) {
    notFound()
  }

  const inputStyle = "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md shadow-sm dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"

  return (
    <div className="flex min-h-screen justify-center bg-zinc-100 dark:bg-zinc-900">
      <main className="w-full max-w-2xl p-8 my-12 bg-white dark:bg-black shadow-xl rounded-xl">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Editar Competência
          </h1>
          <Link href="/admin/skills" className="text-sm text-indigo-600 hover:text-indigo-500">
            &larr; Cancelar
          </Link>
        </div>

        <form action={updateSkill} className="space-y-6">

          {/* Campo de ID (escondido) */}
          <input type="hidden" name="id" value={skill.id} />

          {/* Linha 1: Nome e Categoria */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                Competência (Ex: Python & Django)
              </label>
              <input id="name" name="name" type="text" required className={inputStyle}
                defaultValue={skill.name} />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                Categoria
              </label>
              <select id="category" name="category" required className={inputStyle}
                defaultValue={skill.category}>
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
              defaultValue={skill.description}
            />
          </div>

          {/* Botão Salvar */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              Salvar Alterações
            </button>
          </div>
        </form>

      </main>
    </div>
  )
}