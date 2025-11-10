// src/app/admin/experiences/edit/[id]/page.tsx
import { prisma } from '@/lib/prismaClient'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { notFound } from 'next/navigation'

// --- PARTE 1: BUSCAR A EXPERIÊNCIA PELO ID (Sem mudanças) ---
async function getExperienceById(id: string) {
  const experienceId = parseInt(id, 10)
  if (isNaN(experienceId)) {
    return null
  }
  const experience = await prisma.experiences.findUnique({
    where: { id: experienceId },
  })
  return experience
}

// --- PARTE 2: A LÓGICA DO SERVIDOR (Sem mudanças) ---
async function updateExperience(formData: FormData) {
  'use server' 
  
  const id = parseInt(formData.get('id') as string, 10)
  if (isNaN(id)) {
    console.error("ID inválido para atualização.")
    return
  }
  
  const data = {
    role: formData.get('role') as string,
    company: formData.get('company') as string,
    location: formData.get('location') as string || null,
    start_date: formData.get('start_date') as string || null,
    end_date: formData.get('end_date') as string || null,
    is_current: formData.get('is_current') === 'on',
    activities: formData.get('activities') as string,
    salary: formData.get('salary') as string || null,
    exit_reason: formData.get('exit_reason') as string || null,
  }

  let period_string = data.start_date || 'Data não informada';
  if (data.is_current) {
    period_string += " - Presente";
  } else if (data.end_date) {
    period_string += ` - ${data.end_date}`;
  }
  
  try {
    await prisma.experiences.update({
      where: { id: id }, 
      data: {
        role: data.role,
        company: data.company,
        location: data.location,
        start_date: data.start_date,
        end_date: data.is_current ? null : data.end_date,
        is_current: data.is_current,
        salary: data.salary,
        exit_reason: data.is_current ? null : data.exit_reason,
        period: period_string,
        description: data.activities,
      },
    })
  } catch (error) {
    console.error("Erro ao ATUALIZAR experiência:", error)
    return
  }

  revalidatePath('/') 
  revalidatePath('/admin/experiences') 
  redirect('/admin/experiences')
}

// --- PARTE 3: O FORMULÁRIO PRÉ-PREENCHIDO (CORRIGIDO) ---
// A 'Page' agora recebe 'params' (parâmetros da URL, como o ID)
// A assinatura (type) de 'params' foi atualizada para 'Promise'
export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  
  // ------ CORREÇÃO AQUI ------
  // O Next.js 16 (Turbopack) passa 'params' como uma Promise.
  // Precisamos 'desembrulhar' (await) antes de usar.
  // Esta é a correção da linha 91 que causou o erro.
  const { id } = await params;
  
  // Busca os dados da experiência específica
  const experience = await getExperienceById(id) // Agora usa o 'id' desembrulhado

  // Se o ID for inválido ou não existir, mostra 404
  if (!experience) {
    notFound()
  }

  const inputStyle = "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md shadow-sm dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"

  return (
    <div className="flex min-h-screen justify-center bg-zinc-100 dark:bg-zinc-900">
      <main className="w-full max-w-2xl p-8 my-12 bg-white dark:bg-black shadow-xl rounded-xl">
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Editar Experiência
          </h1>
          <Link href="/admin/experiences" className="text-sm text-indigo-600 hover:text-indigo-500">
            &larr; Cancelar
          </Link>
        </div>

        <form action={updateExperience} className="space-y-6">
          <input type="hidden" name="id" value={experience.id} />

          {/* ... (O resto do formulário (linhas 1-5) é exatamente igual ao anterior) ... */}
          
          {/* --- Linha 1: Cargo e Empresa --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Cargo</label>
              <input id="role" name="role" type="text" required className={inputStyle} 
                defaultValue={experience.role} />
            </div>
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Empresa</label>
              <input id="company" name="company" type="text" required className={inputStyle}
                defaultValue={experience.company} />
            </div>
          </div>

          {/* --- Linha 2: Local e Checkbox 'Atual' --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Local (Ex: Belo Horizonte, MG)</label>
              <input id="location" name="location" type="text" className={inputStyle}
                defaultValue={experience.location || ''} />
            </div>
            <div className="flex items-center h-10">
              <input id="is_current" name="is_current" type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                defaultChecked={experience.is_current} />
              <label htmlFor="is_current" className="ml-2 block text-sm text-gray-900 dark:text-zinc-200">
                Estou atualmente nesta empresa
              </label>
            </div>
          </div>

          {/* --- Linha 3: Data Admissão e Data Desligamento --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Data Admissão (Ex: 10/2021)</label>
              <input id="start_date" name="start_date" type="text" required className={inputStyle}
                defaultValue={experience.start_date || ''} />
            </div>
            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Data Desligamento (Ex: 05/2025)</label>
              <input id="end_date" name="end_date" type="text" placeholder="Deixe em branco se atual" className={inputStyle}
                defaultValue={experience.end_date || ''} />
            </div>
          </div>
          
          {/* --- Linha 4: Atividades Desenvolvidas --- */}
          <div>
            <label htmlFor="activities" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Atividades Desenvolvidas</label>
            <textarea id="activities" name="activities" rows={5} required className={inputStyle}
              defaultValue={experience.description} /> 
          </div>

          {/* --- Linha 5: Salário e Motivo Desligamento --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="salary" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Salário (Opcional)</label>
              <input id="salary" name="salary" type="text" placeholder="Ex: R$ 5.000,00" className={inputStyle}
                defaultValue={experience.salary || ''} />
            </div>
            <div>
              <label htmlFor="exit_reason" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Motivo Desligamento (Opcional)</label>
              <input id="exit_reason" name="exit_reason" type="text" className={inputStyle}
                defaultValue={experience.exit_reason || ''} />
            </div>
          </div>

          {/* --- Botão Salvar --- */}
          <div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
              Salvar Alterações
            </button>
          </div>
        </form>

      </main>
    </div>
  )
}