// src/app/admin/courses/actions.ts
'use server' 

import { prisma } from '@/lib/prismaClient'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod' // <-- 1. IMPORTA O ZOD

// --- 2. CRIA O "MOLDE" DE VALIDAÇÃO (SCHEMA) ---
const CourseSchema = z.object({
  name: z.string().min(3, "O nome do curso é obrigatório."),
  type: z.string().min(3, "O tipo é obrigatório."),
  institution: z.string().min(2, "A instituição é obrigatória."),
  date: z.string().regex(/^\d{2}\/\d{4}$/, "Data inválida (use mm/aaaa)."),

  // Converte o workload (string vazia) para 'null'
  // e depois valida se é um número (Int)
  workload: z.preprocess((val) => (val === "" ? null : val), 
    z.coerce.number().int().positive("A carga horária deve ser um número positivo.").nullable()
  ),

  skills_acquired: z.string().nullable(),
  url: z.string().url("URL do certificado inválida.").nullable().or(z.literal("")),
  notes: z.string().nullable(),
});

// --- 3. ATUALIZA A FUNÇÃO 'addCourse' ---
export async function addCourse(formData: FormData) {

  // Converte o FormData num objeto para o Zod
  const data = {
    name: formData.get('name') as string,
    type: formData.get('type') as string,
    institution: formData.get('institution') as string,
    date: formData.get('date') as string,
    workload: formData.get('workload') as string, // Zod vai converter
    skills_acquired: formData.get('skills_acquired') as string || null,
    url: formData.get('url') as string || null,
    notes: formData.get('notes') as string || null,
  }

  // --- 4. VALIDAÇÃO DE SEGURANÇA ---
  const validated = CourseSchema.safeParse(data);

  if (!validated.success) {
    console.error("Erro de validação (Add):", validated.error.flatten().fieldErrors);
    // Retorna a primeira mensagem de erro para o formulário
    const firstError = validated.error.flatten().fieldErrors;
    const firstErrorMessage = Object.values(firstError)[0]?.[0] || "Dados inválidos.";
    return { success: false, message: firstErrorMessage };
  }

  // Se a validação PASSAR, continua...
  try {
    await prisma.course.create({ 
      data: validated.data // Usa os dados limpos e validados
    })
  } catch (error) {
    console.error("Erro ao salvar curso:", error)
    return { success: false, message: "Erro do servidor ao salvar." }
  }

  revalidatePath('/') 
  revalidatePath('/admin/courses') 
  redirect('/admin/courses')
}

// --- 5. ATUALIZA A FUNÇÃO 'updateCourse' ---
export async function updateCourse(formData: FormData) {

  const id = parseInt(formData.get('id') as string, 10)
  if (isNaN(id)) {
    return { success: false, message: "ID inválido." }
  }

  // Converte o FormData num objeto para o Zod
  const data = {
    name: formData.get('name') as string,
    type: formData.get('type') as string,
    institution: formData.get('institution') as string,
    date: formData.get('date') as string,
    workload: formData.get('workload') as string, // Zod vai converter
    skills_acquired: formData.get('skills_acquired') as string || null,
    url: formData.get('url') as string || null,
    notes: formData.get('notes') as string || null,
  }

  // --- 6. VALIDAÇÃO DE SEGURANÇA ---
  const validated = CourseSchema.safeParse(data);

  if (!validated.success) {
    console.error("Erro de validação (Update):", validated.error.flatten().fieldErrors);
    const firstError = validated.error.flatten().fieldErrors;
    const firstErrorMessage = Object.values(firstError)[0]?.[0] || "Dados inválidos.";
    return { success: false, message: firstErrorMessage };
  }

  // Se a validação PASSAR, continua...
  try {
    await prisma.course.update({
      where: { id: id },
      data: validated.data, // Usa os dados limpos e validados
    })
  } catch (error) {
    console.error("Erro ao atualizar curso:", error)
    return { success: false, message: "Erro do servidor ao atualizar." }
  }

  revalidatePath('/') 
  revalidatePath('/admin/courses') 
  return { success: true, message: "Curso atualizado com sucesso!" }
}

// --- FUNÇÃO DE EXCLUIR (Não precisa de Zod) ---
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
  revalidatePath('/') 
  revalidatePath('/admin/courses') 
}