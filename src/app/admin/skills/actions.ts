// src/app/admin/skills/actions.ts
'use server'

import { prisma } from '@/lib/prismaClient'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

/**
 * Schema Zod para validar os dados de entrada do formulário de Competência.
 * 'showOnProfile' é transformado de 'on' (string) ou 'undefined' para booleano.
 */
const SkillSchema = z.object({
  name: z.string().min(2, "O nome da competência é obrigatório."),
  description: z.string().min(10, "A descrição é obrigatória."),
  category: z.string().min(3, "A categoria é obrigatória."),
  /**
   * Transforma o 'showOnProfile' do FormData:
   * 'on' (marcado) vira true.
   * null/undefined (desmarcado) vira false.
   */
  showOnProfile: z.preprocess((val) => val === 'on', z.boolean().default(false)),
});

/**
 * Server Action para adicionar uma nova competência ao banco de dados.
 */
export async function addSkill(formData: FormData) {

  // Extrai os dados brutos do FormData
  const data = {
    name: formData.get('name'),
    description: formData.get('description'),
    category: formData.get('category'),
    showOnProfile: formData.get('showOnProfile'), // Chega como 'on' ou null
  }

  // Valida e transforma os dados usando o Schema Zod
  const validated = SkillSchema.safeParse(data);

  if (!validated.success) {
    console.error("Erro de validação (Add):", validated.error.flatten().fieldErrors);
    return { success: false, message: "Dados inválidos. Verifique os campos." };
  }

  // Persiste os dados validados e transformados no banco
  try {
    await prisma.skills.create({
      data: validated.data, // 'validated.data' contém 'showOnProfile' como booleano
    })
  } catch (error) {
    console.error("Erro ao salvar competência:", error)
    return { success: false, message: "Erro ao salvar."}
  }

  // Revalida o cache das páginas afetadas para refletir as mudanças imediatamente
  revalidatePath('/') // Home pública
  revalidatePath('/admin/skills') // Lista de skills no admin
  redirect('/admin/skills')
}

/**
 * Server Action para atualizar uma competência existente.
 */
export async function updateSkill(formData: FormData) {

  const id = parseInt(formData.get('id') as string, 10)
  if (isNaN(id)) {
    return { success: false, message: "ID inválido." }
  }

  // Extrai os dados brutos do FormData
  const data = {
    name: formData.get('name'),
    description: formData.get('description'),
    category: formData.get('category'),
    showOnProfile: formData.get('showOnProfile'), // Chega como 'on' ou null
  }

  // Valida e transforma os dados
  const validated = SkillSchema.safeParse(data);

  if (!validated.success) {
    console.error("Erro de validação (Update):", validated.error.flatten().fieldErrors);
    return { success: false, message: "Dados inválidos. Verifique os campos." };
  }

  // Persiste os dados atualizados
  try {
    await prisma.skills.update({
      where: { id: id },
      data: validated.data, // 'validated.data' contém 'showOnToplevel' como booleano
    })
  } catch (error) {
    console.error("Erro ao ATUALIZAR competência:", error)
    return { success: false, message: "Erro ao atualizar." }
  }

  // Revalida o cache e retorna sucesso para o componente exibir feedback
  revalidatePath('/')
  revalidatePath('/admin/skills')
  return { success: true, message: "Competência atualizada com sucesso!" }
}

/**
 * Server Action para excluir uma competência.
 */
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