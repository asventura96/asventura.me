// src/app/admin/courses/actions.ts
'use server'

import { prisma } from '@/lib/prismaClient'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

/**
 * Schema de validação do Zod para os dados do formulário do Curso.
 * O campo 'skills_acquired' foi removido, pois será substituído
 * pela lógica de relação com 'skillIdsJson'.
 */
const CourseSchema = z.object({
  name: z.string().min(3, "O nome do curso é obrigatório."),
  type: z.string().min(3, "O tipo é obrigatório."),
  institution: z.string().min(2, "A instituição é obrigatória."),
  date: z.string().regex(/^\d{2}\/\d{4}$/, "Data inválida (use mm/aaaa)."),

  workload: z.preprocess((val) => (val === "" ? null : val),
    z.coerce.number().int().positive("A carga horária deve ser um número positivo.").nullable()
  ),

  // skills_acquired: z.string().nullable(), // <-- CAMPO REMOVIDO
  url: z.string().url("URL do certificado inválida.").nullable().or(z.literal("")),
  notes: z.string().nullable(),
});

/**
 * Função auxiliar para parsear com segurança o JSON de IDs enviado pelo formulário.
 * @param jsonString O valor de 'skillIdsJson' (ex: "[1, 5, 12]")
 * @returns Um array de números (IDs), ou um array vazio se houver erro.
 */
function parseSkillIds(jsonString: FormDataEntryValue | null): number[] {
  if (!jsonString || typeof jsonString !== 'string') {
    return [];
  }
  try {
    // Valida e faz o parse dos IDs
    const ids = JSON.parse(jsonString);
    if (Array.isArray(ids)) {
      return ids.filter(id => typeof id === 'number') as number[];
    }
    return [];
  } catch (e) {
    console.error("Erro ao parsear skill IDs:", e);
    return [];
  }
}

/**
 * Ação de Servidor para adicionar um novo curso e suas relações de skills.
 */
export async function addCourse(formData: FormData) {

  // 1. Extrai os dados do curso para validação do Zod
  const data = {
    name: formData.get('name') as string,
    type: formData.get('type') as string,
    institution: formData.get('institution') as string,
    date: formData.get('date') as string,
    workload: formData.get('workload') as string,
    url: formData.get('url') as string || null,
    notes: formData.get('notes') as string || null,
    // 'skills_acquired' não é mais lido
  }

  // 2. Extrai e parseia os IDs das skills (separadamente da validação do Zod)
  const skillIdsJson = formData.get('skillIdsJson');
  const skillIds = parseSkillIds(skillIdsJson);

  // 3. Validação de Segurança
  const validated = CourseSchema.safeParse(data);

  if (!validated.success) {
    console.error("Erro de validação (Add):", validated.error.flatten().fieldErrors);
    const firstError = validated.error.flatten().fieldErrors;
    const firstErrorMessage = Object.values(firstError)[0]?.[0] || "Dados inválidos.";
    return { success: false, message: firstErrorMessage };
  }

  // 4. Execução da Query
  try {
    await prisma.course.create({
      data: {
        ...validated.data, // Insere os dados validados do curso (name, type, etc.)
        // Cria as relações na tabela de junção (SkillsEmCursos)
        skills: {
          create: skillIds.map(id => ({
            skill: {
              connect: { id: id } // Conecta cada ID de skill
            }
          }))
        }
      }
    })
  } catch (error) {
    console.error("Erro ao salvar curso:", error)
    return { success: false, message: "Erro do servidor ao salvar." }
  }

  revalidatePath('/')
  revalidatePath('/admin/courses')
  redirect('/admin/courses')
}

/**
 * Ação de Servidor para atualizar um curso e suas relações de skills.
 */
export async function updateCourse(formData: FormData) {

  const id = parseInt(formData.get('id') as string, 10)
  if (isNaN(id)) {
    return { success: false, message: "ID inválido." }
  }

  // 1. Extrai os dados do curso
  const data = {
    name: formData.get('name') as string,
    type: formData.get('type') as string,
    institution: formData.get('institution') as string,
    date: formData.get('date') as string,
    workload: formData.get('workload') as string,
    url: formData.get('url') as string || null,
    notes: formData.get('notes') as string || null,
  }

  // 2. Extrai e parseia os IDs das skills
  const skillIdsJson = formData.get('skillIdsJson');
  const skillIds = parseSkillIds(skillIdsJson);

  // 3. Validação de Segurança
  const validated = CourseSchema.safeParse(data);

  if (!validated.success) {
    console.error("Erro de validação (Update):", validated.error.flatten().fieldErrors);
    const firstError = validated.error.flatten().fieldErrors;
    const firstErrorMessage = Object.values(firstError)[0]?.[0] || "Dados inválidos.";
    return { success: false, message: firstErrorMessage };
  }

  // 4. Execução da Query (dentro de uma transação)
  try {
    /**
     * Usa uma transação para garantir a consistência dos dados:
     * 1. Deleta todas as relações de skills antigas.
     * 2. Atualiza os dados do curso e cria as novas relações.
     */
    await prisma.$transaction(async (tx) => {
      // 1. Deleta todas as relações existentes em 'SkillsEmCursos' para este curso
      await tx.skillsEmCursos.deleteMany({
        where: { cursoId: id }
      });

      // 2. Atualiza o curso e cria as novas relações
      await tx.course.update({
        where: { id: id },
        data: {
          ...validated.data, // Insere os dados validados
          skills: {
            create: skillIds.map(skillId => ({
              skill: {
                connect: { id: skillId } // Conecta cada novo ID de skill
              }
            }))
          }
        },
      });
    });

  } catch (error) {
    console.error("Erro ao atualizar curso:", error)
    return { success: false, message: "Erro do servidor ao atualizar." }
  }

  revalidatePath('/')
  revalidatePath('/admin/courses')
  return { success: true, message: "Curso atualizado com sucesso!" }
}

/**
 * Ação de Servidor para excluir um curso.
 * Nenhuma alteração necessária, 'onDelete: Cascade' no schema.prisma
 * cuidará de limpar as relações em 'SkillsEmCursos'.
 */
export async function deleteCourse(id: number) {
  if (!id) {
    console.error("Erro: ID não fornecido para exclusão.")
    return
  }
  try {
    await prisma.course.delete({
      where: { id: id },
    })
  } catch (error) {
    console.error("Erro ao excluir curso:", error)
    return
  }
  revalidatePath('/')
  revalidatePath('/admin/courses')
}