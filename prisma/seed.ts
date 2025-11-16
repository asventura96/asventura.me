// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

// Inicializa o Prisma Client
const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando o script de seed...')

  // --- PEGUE AS CREDENCIAIS DAS VARIÁVEIS DE AMBIENTE ---
  // Elas virão da Vercel (ou do seu .env local)
  const adminEmail = process.env.ADMIN_EMAIL
  const adminUsername = process.env.ADMIN_USERNAME
  const adminPassword = process.env.ADMIN_PASSWORD
  const adminName = process.env.ADMIN_NAME

  // 1. Validação
  if (!adminEmail || !adminUsername || !adminPassword) {
    throw new Error(
      'Variáveis de ambiente ADMIN_EMAIL, ADMIN_USERNAME, e ADMIN_PASSWORD são obrigatórias.'
    )
  }

  // 2. Verifica se o admin já existe
  const existingAdmin = await prisma.user.findUnique({
    where: { username: adminUsername },
  })

  if (existingAdmin) {
    console.log(`Usuário admin (${adminUsername}) já existe. Nada a fazer.`)
    return // Para o script se o usuário já existe
  }

  // 3. Se não existe, cria o admin
  console.log(`Criando usuário admin: ${adminUsername}...`)

  // Gera o hash da senha
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(adminPassword, saltRounds)

  // Cria o usuário
  await prisma.user.create({
    data: {
      username: adminUsername,
      email: adminEmail,
      name: adminName,
      passwordHash: passwordHash, // Salva o HASH, não a senha!
      // Se você tiver um campo "role", adicione aqui
      // role: 'ADMIN' 
    },
  })

  console.log('Usuário admin criado com sucesso!')
}

// Executa a função main e lida com erros
main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    // Fecha a conexão com o banco
    await prisma.$disconnect()
    console.log('Seed finalizado.')
  })