// src/app/admin/experiences/actions.ts
'use server' 

import { prisma } from '@/lib/prismaClient'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod' // <-- 1. IMPORTA O ZOD

// --- 2. CRIA O "MOLDE" DE VALIDAÇÃO (SCHEMA) ---
// Define as regras para os campos de experiência
const ExperienceSchema = z.object({
  role: z.string().min(3, "O cargo é obrigatório."),
  company: z.string().min(2, "A empresa é obrigatória."),
  location: z.string().nullable(),
  start_date: z.string().regex(/^\d{2}\/\d{4}$/, "Data de início inválida (use mm/aaaa)."),
  end_date: z.string().regex(/^\d{2}\/\d{4}$/, "Data de desligamento inválida.").nullable().or(z.literal("")),
  is_current: z.boolean(),
  activities: z.string().min(10, "A descrição das atividades é obrigatória."),
  salary: z.string().nullable(),
  exit_reason: z.string().nullable(),
});

// --- 3. ATUALIZA A FUNÇÃO 'addExperience' ---
export async function addExperience(formData: FormData) {

  // Converte o FormData num objeto para o Zod
  const data = {
    role: formData.get('role') as string,
    company: formData.get('company') as string,
    location: formData.get('location') as string || null,
    start_date: formData.get('start_date') as string,
    end_date: formData.get('end_date') as string || null,
    is_current: formData.get('is_current') === 'on',
    activities: formData.get('activities') as string,
    salary: formData.get('salary') as string || null,
    exit_reason: formData.get('exit_reason') as string || null,
  }

  // --- 4. VALIDAÇÃO DE SEGURANÇA ---
  const validated = ExperienceSchema.safeParse(data);

  if (!validated.success) {
    console.error("Erro de validação (Add):", validated.error.flatten().fieldErrors);
    return { success: false, message: "Dados inválidos. Verifique os campos." };
  }

  // Se a validação PASSAR, continua...
  const { activities, ...dbData } = validated.data; // Separa 'activities'

  let period_string = dbData.start_date || 'Data não informada';
  if (dbData.is_current) {
    period_string += " - Presente";
  } else if (dbData.end_date) {
    period_string += ` - ${dbData.end_date}`;
  }

  try {
    await prisma.experiences.create({
      data: {
        ...dbData,
        end_date: dbData.is_current ? null : dbData.end_date,
        exit_reason: dbData.is_current ? null : dbData.exit_reason,
        period: period_string,
        description: activities, // Mapeia 'activities' para 'description'
      },
    })
  } catch (error) {
    console.error("Erro ao salvar experiência:", error)
    return { success: false, message: "Erro ao salvar."}
  }

  revalidatePath('/') 
  revalidatePath('/admin/experiences') 
  redirect('/admin/experiences')
}

// --- 5. ATUALIZA A FUNÇÃO 'updateExperience' ---
export async function updateExperience(formData: FormData) {

  const id = parseInt(formData.get('id') as string, 10)
  if (isNaN(id)) {
    return { success: false, message: "ID inválido." }
  }

  // Converte o FormData num objeto para o Zod
  const data = {
    role: formData.get('role') as string,
    company: formData.get('company') as string,
    location: formData.get('location') as string || null,
    start_date: formData.get('start_date') as string,
    end_date: formData.get('end_date') as string || null,
    is_current: formData.get('is_current') === 'on',
    activities: formData.get('activities') as string,
    salary: formData.get('salary') as string || null,
    exit_reason: formData.get('exit_reason') as string || null,
  }

  // --- 6. VALIDAÇÃO DE SEGURANÇA ---
  const validated = ExperienceSchema.safeParse(data);

  if (!validated.success) {
    console.error("Erro de validação (Update):", validated.error.flatten().fieldErrors);
    return { success: false, message: "Dados inválidos. Verifique os campos." };
  }

  // Se a validação PASSAR, continua...
  const { activities, ...dbData } = validated.data;

  let period_string = dbData.start_date || 'Data não informada';
  if (dbData.is_current) {
    period_string += " - Presente";
  } else if (dbData.end_date) {
    period_string += ` - ${dbData.end_date}`;
  }

  try {
    await prisma.experiences.update({
      where: { id: id }, 
      data: {
        ...dbData,
        end_date: dbData.is_current ? null : dbData.end_date,
        exit_reason: dbData.is_current ? null : dbData.exit_reason,
        period: period_string,
        description: activities,
      },
    })
  } catch (error) {
    console.error("Erro ao ATUALIZAR experiência:", error)
    return { success: false, message: "Erro ao atualizar." }
  }

  revalidatePath('/') 
  revalidatePath('/admin/experiences') 
  return { success: true, message: "Experiência atualizada com sucesso!" }
}

// --- FUNÇÃO DE EXCLUIR (Não precisa de Zod) ---
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
  revalidatePath('/') 
  revalidatePath('/admin/experiences') 
}