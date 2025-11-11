// src/app/admin/education/actions.ts
'use server' 

import { prisma } from '@/lib/prismaClient'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// --- FUNÇÃO DE ADICIONAR (JÁ EXISTIA) ---
export async function addEducation(formData: FormData) {

  const data = {
    institution: formData.get('institution') as string,
    level: formData.get('level') as string,
    course_name: formData.get('course_name') as string,
    start_date: formData.get('start_date') as string,
    end_date: formData.get('end_date') as string || null,
    status: formData.get('status') as string,
    description: formData.get('description') as string || null,
  }

  if (!data.institution || !data.level || !data.course_name || !data.start_date || !data.status) {
    return { success: false, message: "Campos obrigatórios estão faltando." }
  }

  try {
    await prisma.education.create({ data: data })
  } catch (error) {
    console.error("Erro ao salvar formação:", error)
    return { success: false, message: "Erro do servidor ao salvar." }
  }

  revalidatePath('/') 
  revalidatePath('/admin/education') 
  redirect('/admin/education')
}

// --- FUNÇÃO DE ATUALIZAR (JÁ EXISTIA) ---
export async function updateEducation(formData: FormData) {

  const id = parseInt(formData.get('id') as string, 10)
  if (isNaN(id)) {
    return { success: false, message: "ID inválido." }
  }

  const data = {
    institution: formData.get('institution') as string,
    level: formData.get('level') as string,
    course_name: formData.get('course_name') as string,
    start_date: formData.get('start_date') as string,
    end_date: formData.get('end_date') as string || null,
    status: formData.get('status') as string,
    description: formData.get('description') as string || null,
  }

  if (!data.institution || !data.level || !data.course_name || !data.start_date || !data.status) {
    return { success: false, message: "Campos obrigatórios estão faltando." }
  }

  try {
    await prisma.education.update({
      where: { id: id },
      data: data,
    })
  } catch (error) {
    console.error("Erro ao atualizar formação:", error)
    return { success: false, message: "Erro do servidor ao atualizar." }
  }

  revalidatePath('/') 
  revalidatePath('/admin/education') 
  return { success: true, message: "Formação atualizada com sucesso!" }
}

// --- FUNÇÃO NOVA DE EXCLUIR ---
export async function deleteEducation(id: number) {
  if (!id) {
    console.error("Erro: ID não fornecido para exclusão.")
    return
  }

  try {
    await prisma.education.delete({
      where: { id: id },
    })
  } catch (error) {
    console.error("Erro ao excluir formação:", error)
    return
  }

  // Limpa o cache e atualiza as páginas
  revalidatePath('/') // Atualiza o seu currículo PÚBLICO
  revalidatePath('/admin/education') // Atualiza a LISTA no admin
}