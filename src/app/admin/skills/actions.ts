// src/app/admin/skills/actions.ts
'use server' 

import { prisma } from '@/lib/prismaClient'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod' // <-- 1. IMPORTA O ZOD

// --- 2. CRIA O "MOLDE" DE VALIDAÇÃO (SCHEMA) ---
const SkillSchema = z.object({
  name: z.string().min(2, "O nome da competência é obrigatório."),
  description: z.string().min(10, "A descrição é obrigatória."),
  category: z.string().min(3, "A categoria é obrigatória."),
});

// --- 3. ATUALIZA A FUNÇÃO 'addSkill' ---
export async function addSkill(formData: FormData) {

  // Converte o FormData num objeto para o Zod
  const data = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    category: formData.get('category') as string,
  }

  // --- 4. VALIDAÇÃO DE SEGURANÇA ---
  const validated = SkillSchema.safeParse(data);

  if (!validated.success) {
    console.error("Erro de validação (Add):", validated.error.flatten().fieldErrors);
    return { success: false, message: "Dados inválidos. Verifique os campos." };
  }

  // Se a validação PASSAR, continua...
  try {
    await prisma.skills.create({
      data: validated.data, // Usa os dados limpos e validados
    })
  } catch (error) {
    console.error("Erro ao salvar competência:", error)
    return { success: false, message: "Erro ao salvar."}
  }

  revalidatePath('/') 
  revalidatePath('/admin/skills') 
  redirect('/admin/skills')
}

// --- 5. ATUALIZA A FUNÇÃO 'updateSkill' ---
export async function updateSkill(formData: FormData) {

  const id = parseInt(formData.get('id') as string, 10)
  if (isNaN(id)) {
    return { success: false, message: "ID inválido." }
  }

  // Converte o FormData num objeto para o Zod
  const data = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    category: formData.get('category') as string,
  }

  // --- 6. VALIDAÇÃO DE SEGURANÇA ---
  const validated = SkillSchema.safeParse(data);

  if (!validated.success) {
    console.error("Erro de validação (Update):", validated.error.flatten().fieldErrors);
    return { success: false, message: "Dados inválidos. Verifique os campos." };
  }

  // Se a validação PASSAR, continua...
  try {
    await prisma.skills.update({
      where: { id: id }, 
      data: validated.data, // Usa os dados limpos e validados
    })
  } catch (error) {
    console.error("Erro ao ATUALIZAR competência:", error)
    return { success: false, message: "Erro ao atualizar." }
  }

  revalidatePath('/') 
  revalidatePath('/admin/skills') 
  return { success: true, message: "Competência atualizada com sucesso!" }
}

// --- FUNÇÃO DE EXCLUIR (Não precisa de Zod) ---
export async function deleteSkill(id: number) {
  if (!id) {
    console.error("Erro: ID não fornecido para exclusão.")
    return
  }
  try {
    await prisma.skills.delete({
      where: { id: id },
    })
  } catch (error)
  {
    console.error("Erro ao excluir competência:", error)
    return
  }
  revalidatePath('/') 
  revalidatePath('/admin/skills') 
}