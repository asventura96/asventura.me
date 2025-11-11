// src/app/admin/languages/actions.ts
'use server' // <-- Marca TODAS as funções neste arquivo como Server Actions

import { prisma } from '@/lib/prismaClient'
import { revalidatePath } from 'next/cache'

// A nossa nova função de Excluir
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

  // Limpa o cache e atualiza as páginas
  revalidatePath('/') // Atualiza o seu currículo PÚBLICO
  revalidatePath('/admin/languages') // Atualiza a LISTA no admin
}