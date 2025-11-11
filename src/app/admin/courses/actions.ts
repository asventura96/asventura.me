// src/app/admin/courses/actions.ts
'use server' 

import { prisma } from '@/lib/prismaClient'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Função para converter o workload (que vem como string) para Int ou null
function parseWorkload(formData: FormData): number | null {
  const workloadString = formData.get('workload') as string
  if (!workloadString) {
    return null // Se for vazio, salva como nulo
  }
  const workloadInt = parseInt(workloadString, 10)
  return isNaN(workloadInt) ? null : workloadInt // Se não for um número, salva como nulo
}

// --- FUNÇÃO DE ADICIONAR (Atualizada) ---
export async function addCourse(formData: FormData) {

  const data = {
    name: formData.get('name') as string,
    type: formData.get('type') as string,
    institution: formData.get('institution') as string,
    date: formData.get('date') as string,
    workload: parseWorkload(formData), // <-- MUDANÇA AQUI
    skills_acquired: formData.get('skills_acquired') as string || null,
    url: formData.get('url') as string || null,
    notes: formData.get('notes') as string || null,
  }

  if (!data.name || !data.type || !data.institution || !data.date) {
    return { success: false, message: "Campos obrigatórios (Nome, Tipo, Instituição, Data) estão faltando." }
  }

  try {
    await prisma.course.create({ data: data })
  } catch (error) {
    console.error("Erro ao salvar curso:", error)
    return { success: false, message: "Erro do servidor ao salvar." }
  }

  revalidatePath('/') 
  revalidatePath('/admin/courses') 
  redirect('/admin/courses')
}

// --- FUNÇÃO DE ATUALIZAR (Atualizada) ---
export async function updateCourse(formData: FormData) {

  const id = parseInt(formData.get('id') as string, 10)
  if (isNaN(id)) {
    return { success: false, message: "ID inválido." }
  }

  const data = {
    name: formData.get('name') as string,
    type: formData.get('type') as string,
    institution: formData.get('institution') as string,
    date: formData.get('date') as string,
    workload: parseWorkload(formData), // <-- MUDANÇA AQUI
    skills_acquired: formData.get('skills_acquired') as string || null,
    url: formData.get('url') as string || null,
    notes: formData.get('notes') as string || null,
  }

  if (!data.name || !data.type || !data.institution || !data.date) {
    return { success: false, message: "Campos obrigatórios estão faltando." }
  }

  try {
    await prisma.course.update({
      where: { id: id },
      data: data,
    })
  } catch (error) {
    console.error("Erro ao atualizar curso:", error)
    return { success: false, message: "Erro do servidor ao atualizar." }
  }

  revalidatePath('/') 
  revalidatePath('/admin/courses') 
  return { success: true, message: "Curso atualizado com sucesso!" }
}

// --- FUNÇÃO DE EXCLUIR (Sem mudanças) ---
export async function deleteCourse(id: number) {
  if (!id) {
    console.error("Erro: ID não fornecido para exclusão.")
    return
  }
  try {
    await prisma.course.delete({ where: { id: id } })
  } catch (error) {
    console.error("Erro ao excluir curso:", error)
    return
  }
  revalidatePath('/') 
  revalidatePath('/admin/courses') 
}