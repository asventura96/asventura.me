// src/app/admin/skills/actions.ts
'use server' // <-- Marca TODAS as funções neste arquivo como Server Actions

import { prisma } from '@/lib/prismaClient'
import { revalidatePath } from 'next/cache'

// A nossa nova função de Excluir
export async function deleteSkill(id: number) {
  if (!id) {
    console.error("Erro: ID não fornecido para exclusão.")
    return
  }

  try {
    await prisma.skills.delete({
      where: { id: id },
    })
  } catch (error) {
    console.error("Erro ao excluir competência:", error)
    return
  }

  // Limpa o cache e atualiza as páginas
  revalidatePath('/') // Atualiza o seu currículo PÚBLICO
  revalidatePath('/admin/skills') // Atualiza a LISTA no admin
}