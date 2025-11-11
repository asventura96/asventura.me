// src/app/admin/courses/actions.ts
'use server' 

import { prisma } from '@/lib/prismaClient'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// --- FUNÇÃO DE ADICIONAR (JÁ EXISTIA) ---
export async function addCourse(formData: FormData) {

  const data = {
    name: formData.get('name') as string,
    type: formData.get('type') as string,
    institution: formData.get('institution') as string,
    date: formData.get('date') as string,
    workload: formData.get('workload') as string || null,
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

// --- FUNÇÃO DE ATUALIZAR (JÁ EXISTIA) ---
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
    workload: formData.get('workload') as string || null,
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

// --- FUNÇÃO NOVA DE EXCLUIR ---
export async function deleteCourse(id: number) {
  if (!id) {
    console.error("Erro: ID não fornecido para exclusão.")
    return
  }

  try {
    await prisma.course.delete({
      where: { id: id },
    })
  } catch (error) {
    console.error("Erro ao excluir curso:", error)
    return
  }

  // Limpa o cache e atualiza as páginas
  revalidatePath('/') // Atualiza o seu currículo PÚBLICO
  revalidatePath('/admin/courses') // Atualiza a LISTA no admin
}