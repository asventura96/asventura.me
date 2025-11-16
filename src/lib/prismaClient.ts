// src/lib/prismaClient.ts

import { PrismaClient } from '@prisma/client'

// Declara um 'global' para armazenar o client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Verifica se já existe uma instância. Se não, cria uma.
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // (Opcional) Log para ver o que está acontecendo
    // log: ['query'], 
  })

// No modo de desenvolvimento, salva a instância no 'global'
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}