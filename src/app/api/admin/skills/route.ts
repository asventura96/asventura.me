// src/app/api/admin/skills/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient'; 
import { getAuthSession } from '@/lib/auth'; 

/**
 * @route GET /api/admin/skills
 * @description Busca skills para o autocomplete do painel admin.
 */
export async function GET(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('search');

    const skillList = await prisma.skills.findMany({
      where: {
        name: {
          contains: query || '',
          // 'mode' removido para corrigir erro de tipo
        },
      },
      take: 10,
    });
    
    return NextResponse.json(skillList);
  } catch (error) {
    console.error("[SKILLS_GET]", error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

/**
 * @route POST /api/admin/skills
 * @description Cria uma nova skill a partir do formulário de cursos.
 */
export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { name } = await req.json();

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    const existingSkill = await prisma.skills.findFirst({
      where: { 
        name: { 
          equals: name 
          // 'mode' removido para corrigir erro de tipo
        } 
      },
    });

    if (existingSkill) {
      return NextResponse.json(existingSkill);
    }

    const newSkill = await prisma.skills.create({
      data: {
        name: name,
        showOnProfile: false, 
        description: `Skill '${name}' adicionada via formulário de cursos.`,
        category: 'Geral', 
      },
    });

    return NextResponse.json(newSkill, { status: 201 });
  } catch (error) {
    console.error("[SKILLS_POST]", error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}