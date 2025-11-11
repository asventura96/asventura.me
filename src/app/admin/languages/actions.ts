// src/app/admin/languages/actions.ts
'use server' 

import { prisma } from '@/lib/prismaClient'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod' // <-- 1. IMPORTA O ZOD

// --- 2. CRIA O "MOLDE" DE VALIDAÇÃO (SCHEMA) ---
const LanguageSchema = z.object({
  name: z.string().min(2, "O nome do idioma é obrigatório."),
  level: z.string().min(3, "O nível é obrigatório."),
});

// --- FUNÇÃO PARA 'addLanguage' (Atualizada) ---
// (Esta função estava antes no page.tsx, agora está aqui)
export async function addLanguage(formData: FormData) {

  const data = {
    name: formData.get('name') as string,
    level: formData.get('level') as string,
  }

  // --- VALIDAÇÃO DE SEGURANÇA ---
  const validated = LanguageSchema.safeParse(data);

  if (!validated.success) {
    console.error("Erro de validação (Add):", validated.error.flatten().fieldErrors);
    // Retorna o erro para o formulário (que ainda não está configurado para mostrar, mas devia)
    // Por agora, apenas falhamos silenciosamente
    return { success: false, message: "Dados inválidos." };
  }

  try {
    await prisma.language.create({
      data: validated.data, // Usa os dados limpos
    })
  } catch (error) {
    console.error("Erro ao salvar idioma:", error)
    return { success: false, message: "Erro ao salvar." }
  }

  revalidatePath('/') 
  revalidatePath('/admin/languages') 
  redirect('/admin/languages')
}

// --- FUNÇÃO PARA 'updateLanguage' (Atualizada) ---
// (Esta função também estava no page.tsx, agora está aqui)
export async function updateLanguage(formData: FormData) {

  const id = parseInt(formData.get('id') as string, 10)
  if (isNaN(id)) {
    return { success: false, message: "ID inválido." }
  }

  const data = {
    name: formData.get('name') as string,
    level: formData.get('level') as string,
  }

  // --- VALIDAÇÃO DE SEGURANÇA ---
  const validated = LanguageSchema.safeParse(data);

  if (!validated.success) {
    console.error("Erro de validação (Update):", validated.error.flatten().fieldErrors);
    return { success: false, message: "Dados inválidos." }; 
  }

  try {
    await prisma.language.update({
      where: { id: id },
      data: validated.data, // Usa os dados limpos
    })
  } catch (error) {
    console.error("Erro ao ATUALIZAR idioma:", error)
    return { success: false, message: "Erro ao atualizar." }
  }

  revalidatePath('/') 
  revalidatePath('/admin/languages') 
  redirect('/admin/languages') 
}

// --- FUNÇÃO DE EXCLUIR (Já a tinhas) ---
export async function deleteLanguage(id: number) {
  if (!id) {
    console.error("Erro: ID não fornecido para exclusão.")
    return
  }
  try {
    await prisma.language.delete({
      where: { id: id },
    })
  } catch (error) {
    console.error("Erro ao excluir idioma:", error)
    return
  }
  revalidatePath('/') 
  revalidatePath('/admin/languages') 
}