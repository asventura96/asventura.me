// src/app/admin/profile/actions.ts
'use server' // <-- Marca o arquivo TODO como Server Actions

import { prisma } from '@/lib/prismaClient'
import { revalidatePath } from 'next/cache'

// Esta é a função que estava na tua 'page.tsx'
// Agora ela vive aqui
export async function updateProfile(formData: FormData) {
  // 1. Pega os dados do formulário
  const data = {
    name: formData.get('name') as string,
    title: formData.get('title') as string,
    email: formData.get('email') as string || null,
    phone: formData.get('phone') as string || null,
    location: formData.get('location') as string || null,
    linkedin_url: formData.get('linkedin_url') as string || null,
    github_url: formData.get('github_url') as string || null,
    website_url: formData.get('website_url') as string || null,
    marital_status: formData.get('marital_status') as string || null,
    personal_summary: formData.get('personal_summary') as string || null,
    professional_objectives: formData.get('professional_objectives') as string || null,

    // Trata o campo de data (HTML envia 'YYYY-MM-DD' ou string vazia)
    birthdate: (formData.get('birthdate') ? new Date(formData.get('birthdate') as string) : null) as Date | null
  }

  // 2. ATUALIZA (Update) ou CRIA (Insert) o registro
  try {
    await prisma.profile.upsert({
      where: { id: 1 }, // Acha o registro com ID 1
      update: data,      // Se achar, atualiza com os novos dados
      create: {          // Se NÃO achar, cria o registro 1
        id: 1,
        ...data,
      },
    })
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error)
    // No futuro, podemos retornar o erro para o formulário
    throw new Error("Falha ao salvar o perfil.")
  }

  // 3. "Limpa o cache"
  revalidatePath('/') // <-- Atualiza o seu currículo PÚBLICO

  // (Não redirecionamos, ficamos na mesma página)
  return { success: true, message: "Perfil atualizado com sucesso!" }
}