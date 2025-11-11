// src/app/admin/profile/actions.ts
'use server' 

import { prisma } from '@/lib/prismaClient'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {

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
    birthdate: (formData.get('birthdate') ? new Date(formData.get('birthdate') as string) : null) as Date | null,
    // --- CAMPO NOVO ---
    photo_url: formData.get('photo_url') as string || null 
  }

  try {
    await prisma.profile.upsert({
      where: { id: 1 }, 
      update: data, // Atualiza com todos os dados
      create: {     // Cria com todos os dados
        id: 1,
        ...data,
      },
    })
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error)
    throw new Error("Falha ao salvar o perfil.")
  }

  revalidatePath('/') // Atualiza o site público

  return { success: true, message: "Perfil atualizado com sucesso!" }
}