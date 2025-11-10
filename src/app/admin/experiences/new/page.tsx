// src/app/admin/experiences/new/page.tsx
import { prisma } from '@/lib/prismaClient'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import Link from 'next/link'

// --- PARTE 1: A LÓGICA DO SERVIDOR (Server Action ATUALIZADA) ---
async function addExperience(formData: FormData) {
  'use server' 

  // 1. Pega TODOS os dados do formulário
  const data = {
    role: formData.get('role') as string,
    company: formData.get('company') as string,
    location: formData.get('location') as string || null,
    start_date: formData.get('start_date') as string || null,
    end_date: formData.get('end_date') as string || null,
    is_current: formData.get('is_current') === 'on', // Checkbox 'on' se marcado, null se não
    activities: formData.get('activities') as string,
    salary: formData.get('salary') as string || null,
    exit_reason: formData.get('exit_reason') as string || null,
  }

  // 2. Lógica para construir o campo 'period' (para o site público)
  let period_string = data.start_date || 'Data não informada';
  if (data.is_current) {
    period_string += " - Presente";
  } else if (data.end_date) {
    period_string += ` - ${data.end_date}`;
  }

  // 3. Salva os dados no banco
  try {
    await prisma.experiences.create({
      data: {
        role: data.role,
        company: data.company,
        location: data.location,
        start_date: data.start_date,
        end_date: data.is_current ? null : data.end_date, // Se 'atual', força end_date a ser nulo
        is_current: data.is_current,
        salary: data.salary,
        exit_reason: data.is_current ? null : data.exit_reason, // Se 'atual', força motivo a ser nulo

        // Preenche os campos antigos para o site público
        period: period_string,
        description: data.activities, // 'Atividades' vai para 'description'
      },
    })
  } catch (error) {
    console.error("Erro ao salvar experiência:", error)
    return
  }

  // 4. Limpa o cache e redireciona
  revalidatePath('/') 
  revalidatePath('/admin/experiences') 
  redirect('/admin/experiences')
}

// --- PARTE 2: O NOVO FORMULÁRIO (Componente React) ---
export default function NewExperiencePage() {
  return (
    <div className="flex min-h-screen justify-center bg-zinc-100 dark:bg-zinc-900">
      <main className="w-full max-w-2xl p-8 my-12 bg-white dark:bg-black shadow-xl rounded-xl">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Adicionar Experiência
          </h1>
          <Link href="/admin/experiences" className="text-sm text-indigo-600 hover:text-indigo-500">
            &larr; Cancelar
          </Link>
        </div>

        <form action={addExperience} className="space-y-6">

          {/* --- Linha 1: Cargo e Empresa --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Cargo</label>
              <input id="role" name="role" type="text" required className="mt-1 block w-full input-form" />
            </div>
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Empresa</label>
              <input id="company" name="company" type="text" required className="mt-1 block w-full input-form" />
            </div>
          </div>

          {/* --- Linha 2: Local e Checkbox 'Atual' --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Local (Ex: Belo Horizonte, MG)</label>
              <input id="location" name="location" type="text" className="mt-1 block w-full input-form" />
            </div>
            <div className="flex items-center h-10">
              <input id="is_current" name="is_current" type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
              <label htmlFor="is_current" className="ml-2 block text-sm text-gray-900 dark:text-zinc-200">
                Estou atualmente nesta empresa
              </label>
            </div>
          </div>

          {/* --- Linha 3: Data Admissão e Data Desligamento --- */}
          {/* (No futuro, podemos trocar por Date Pickers) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Data Admissão (Ex: 10/2021)</label>
              <input id="start_date" name="start_date" type="text" required className="mt-1 block w-full input-form" />
            </div>
            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Data Desligamento (Ex: 05/2025)</label>
              <input id="end_date" name="end_date" type="text" placeholder="Deixe em branco se atual" className="mt-1 block w-full input-form" />
            </div>
          </div>

          {/* --- Linha 4: Atividades Desenvolvidas --- */}
          <div>
            <label htmlFor="activities" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Atividades Desenvolvidas</label>
            <textarea id="activities" name="activities" rows={5} required className="mt-1 block w-full input-form" />
          </div>

          {/* --- Linha 5: Salário e Motivo Desligamento --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="salary" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Salário (Opcional)</label>
              <input id="salary" name="salary" type="text" placeholder="Ex: R$ 5.000,00" className="mt-1 block w-full input-form" />
            </div>
            <div>
              <label htmlFor="exit_reason" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Motivo Desligamento (Opcional)</label>
              <input id="exit_reason" name="exit_reason" type="text" className="mt-1 block w-full input-form" />
            </div>
          </div>

          {/* --- Botão Salvar --- */}
          <div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
              Salvar Experiência
            </button>
          </div>
        </form>

        {/* CSS Helper para os inputs */}
        <style jsx global>{`
          .input-form {
            border-width: 1px;
            border-color: rgb(212 212 216 / 0.5); /* zinc-300/50 */
            background-color: rgb(39 39 42 / 0.8); /* zinc-800/80 */
            color: white;
            border-radius: 0.375rem; /* rounded-md */
            box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); /* shadow-sm */
            padding: 0.5rem 0.75rem; /* px-3 py-2 */
          }
          .input-form:focus {
            outline: none;
            border-color: rgb(99 102 241); /* focus:border-indigo-500 */
            ring-width: 1px;
            ring-color: rgb(99 102 241); /* focus:ring-indigo-500 */
          }
        `}</style>
      </main>
    </div>
  )
}