// src/app/admin/experiences/actions.ts
'use server' // <-- Marca TODAS as funções neste arquivo como Server Actions

import { prisma } from '@/lib/prismaClient'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// A nossa nova função de Excluir
export async function deleteExperience(id: number) {
  if (!id) {
    console.error("Erro: ID não fornecido para exclusão.")
    return
  }

  try {
    await prisma.experiences.delete({
      where: { id: id },
    })
  } catch (error) {
    console.error("Erro ao excluir experiência:", error)
    return
  }

  // Limpa o cache e atualiza as páginas
  revalidatePath('/') // Atualiza o seu currículo PÚBLICO
  revalidatePath('/admin/experiences') // Atualiza a LISTA no admin

  // (Não precisamos de redirect, pois ficamos na mesma página)
}

/* NOTA: No futuro, podemos mover as funções 'addExperience' e 
'updateExperience' dos seus arquivos 'page.tsx' para aqui,
para manter tudo organizado. Mas por agora, deixe-as lá.
*/