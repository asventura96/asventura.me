// src/app/admin/profile/actions.ts
'use server' 

import { prisma } from '@/lib/prismaClient'
import { revalidatePath } from 'next/cache'
import { z } from 'zod' // <-- 1. IMPORTA O ZOD

// --- 2. CRIA O "MOLDE" DE VALIDAÇÃO (SCHEMA) ---
const ProfileSchema = z.object({
  name: z.string().min(3, "O nome é obrigatório."),
  title: z.string().min(3, "O título é obrigatório."),

  // 'nullable()' significa que pode ser nulo ou o tipo definido
  email: z.string().email("Formato de email inválido.").nullable(),
  phone: z.string().nullable(),
  location: z.string().nullable(),
  linkedin_url: z.string().url("URL do LinkedIn inválida.").nullable(),
  github_url: z.string().url("URL do GitHub inválida.").nullable(),
  website_url: z.string().url("URL do Site Pessoal inválida.").nullable(),

  // Converte a string vazia "" para 'null' antes de validar
  marital_status: z.string().nullable().or(z.literal("")), 
  personal_summary: z.string().nullable(),
  professional_objectives: z.string().nullable(),

  // Converte a data (string) para um objeto Date ou null
  birthdate: z.date().nullable(),
  photo_url: z.string().nullable(),
});

// --- 3. ATUALIZA A FUNÇÃO PARA USAR O ZOD ---
export async function updateProfile(formData: FormData) {

  // Converte o FormData (que é "burro") num objeto simples
  const data = {
    name: formData.get('name'),
    title: formData.get('title'),
    email: formData.get('email') || null,
    phone: formData.get('phone') || null,
    location: formData.get('location') || null,
    linkedin_url: formData.get('linkedin_url') || null,
    github_url: formData.get('github_url') || null,
    website_url: formData.get('website_url') || null,
    marital_status: formData.get('marital_status') || null,
    personal_summary: formData.get('personal_summary') || null,
    professional_objectives: formData.get('professional_objectives') || null,
    photo_url: formData.get('photo_url') || null,
    birthdate: (formData.get('birthdate') ? new Date(formData.get('birthdate') as string) : null)
  }

  // --- 4. VALIDAÇÃO DE SEGURANÇA ---
  const validated = ProfileSchema.safeParse(data);

  if (!validated.success) {
    // Se a validação falhar, retorna o erro
    console.error("Erro de validação:", validated.error.flatten().fieldErrors);
    return { success: false, message: "Dados inválidos. Verifique os campos." };
  }

  // 5. Se a validação PASSAR, continua para o banco
  try {
    await prisma.profile.upsert({
      where: { id: 1 }, 
      update: validated.data, // Usa os dados limpos e validados
      create: { 
        id: 1,
        ...validated.data, // Usa os dados limpos e validados
      },
    })
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error)
    return { success: false, message: "Erro do servidor ao salvar." }
  }

  revalidatePath('/') 

  return { success: true, message: "Perfil atualizado com sucesso!" }
}