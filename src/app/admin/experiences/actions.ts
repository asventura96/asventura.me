// src/app/admin/experiences/actions.ts
'use server' 

import { prisma } from '@/lib/prismaClient'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// --- FUNÇÃO DE ADICIONAR ---
export async function addExperience(formData: FormData) {

  const data = {
    role: formData.get('role') as string,
    company: formData.get('company') as string,
    location: formData.get('location') as string || null,
    start_date: formData.get('start_date') as string, // mm/aaaa
    end_date: formData.get('end_date') as string || null, // mm/aaaa
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
    await prisma.experiences.create({
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
    console.error("Erro ao salvar experiência:", error)
    return { success: false, message: "Erro ao salvar."}
  }

  revalidatePath('/') 
  revalidatePath('/admin/experiences') 
  redirect('/admin/experiences')
}

// --- FUNÇÃO DE ATUALIZAR ---
export async function updateExperience(formData: FormData) {

  const id = parseInt(formData.get('id') as string, 10)
  if (isNaN(id)) {
    return { success: false, message: "ID inválido." }
  }

  const data = {
    role: formData.get('role') as string,
    company: formData.get('company') as string,
    location: formData.get('location') as string || null,
    start_date: formData.get('start_date') as string,
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
    return { success: false, message: "Erro ao atualizar." }
  }

  revalidatePath('/') 
  revalidatePath('/admin/experiences') 
  return { success: true, message: "Experiência atualizada com sucesso!" }
}

// --- FUNÇÃO DE EXCLUIR (Já a tinhas) ---
export async function deleteExperience(id: number) {
  if (!id) {
    console.error("Erro: ID não fornecido para exclusão.")
    return
  }
  try {
    await prisma.experiences.delete({
      where: { id: id },
    })
  } catch (error) {
    console.error("Erro ao excluir experiência:", error)
    return
  }
  revalidatePath('/') 
  revalidatePath('/admin/experiences') 
}