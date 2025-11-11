// src/app/admin/education/actions.ts
'use server' 

import { prisma } from '@/lib/prismaClient'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod' // <-- 1. IMPORTA O ZOD

// --- 2. CRIA O "MOLDE" DE VALIDAÇÃO (SCHEMA) ---
const EducationSchema = z.object({
  institution: z.string().min(2, "O nome da instituição é obrigatório."),
  level: z.string().min(3, "O nível é obrigatório."),
  course_name: z.string().min(3, "O nome do curso é obrigatório."),
  start_date: z.string().regex(/^\d{2}\/\d{4}$/, "Data de início inválida (use mm/aaaa)."),
  end_date: z.string().regex(/^\d{2}\/\d{4}$/, "Data de conclusão inválida.").nullable().or(z.literal("")),
  status: z.string().min(3, "O status é obrigatório."),
  description: z.string().nullable(),
});

// --- 3. ATUALIZA A FUNÇÃO 'addEducation' ---
export async function addEducation(formData: FormData) {

  // Converte o FormData num objeto para o Zod
  const data = {
    institution: formData.get('institution') as string,
    level: formData.get('level') as string,
    course_name: formData.get('course_name') as string,
    start_date: formData.get('start_date') as string,
    end_date: formData.get('end_date') as string || null,
    status: formData.get('status') as string,
    description: formData.get('description') as string || null,
  }

  // --- 4. VALIDAÇÃO DE SEGURANÇA ---
  const validated = EducationSchema.safeParse(data);

  if (!validated.success) {
    console.error("Erro de validação (Add):", validated.error.flatten().fieldErrors);
    return { success: false, message: "Dados inválidos. Verifique os campos." };
  }

  // Se a validação PASSAR, continua...
  try {
    await prisma.education.create({ 
      data: validated.data // Usa os dados limpos e validados
    })
  } catch (error) {
    console.error("Erro ao salvar formação:", error)
    return { success: false, message: "Erro do servidor ao salvar." }
  }

  revalidatePath('/') 
  revalidatePath('/admin/education') 
  redirect('/admin/education')
}

// --- 5. ATUALIZA A FUNÇÃO 'updateEducation' ---
export async function updateEducation(formData: FormData) {

  const id = parseInt(formData.get('id') as string, 10)
  if (isNaN(id)) {
    return { success: false, message: "ID inválido." }
  }

  // Converte o FormData num objeto para o Zod
  const data = {
    institution: formData.get('institution') as string,
    level: formData.get('level') as string,
    course_name: formData.get('course_name') as string,
    start_date: formData.get('start_date') as string,
    end_date: formData.get('end_date') as string || null,
    status: formData.get('status') as string,
    description: formData.get('description') as string || null,
  }

  // --- 6. VALIDAÇÃO DE SEGURANÇA ---
  const validated = EducationSchema.safeParse(data);

  if (!validated.success) {
    console.error("Erro de validação (Update):", validated.error.flatten().fieldErrors);
    return { success: false, message: "Dados inválidos. Verifique os campos." };
  }

  // Se a validação PASSAR, continua...
  try {
    await prisma.education.update({
      where: { id: id },
      data: validated.data, // Usa os dados limpos e validados
    })
  } catch (error) {
    console.error("Erro ao atualizar formação:", error)
    return { success: false, message: "Erro do servidor ao atualizar." }
  }

  revalidatePath('/') 
  revalidatePath('/admin/education') 
  return { success: true, message: "Formação atualizada com sucesso!" }
}

// --- FUNÇÃO DE EXCLUIR (Não precisa de Zod) ---
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
  revalidatePath('/') 
  revalidatePath('/admin/education') 
}