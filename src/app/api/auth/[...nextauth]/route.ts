// src/app/api/auth/[...nextauth]/route.ts

import { prisma } from '@/lib/prismaClient'
import * as bcrypt from 'bcrypt'

import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        // Você está usando 'username', então vamos usá-lo para a busca
        username: { label: "Usuário", type: "text" }, 
        password: { label: "Senha", type: "password" }
      },

      // --- AQUI ESTÁ A LÓGICA ATUALIZADA ---
      async authorize(credentials) {
        
        // 1. Valida se o usuário e senha foram enviados
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        // 2. Busca o usuário no banco de dados pelo 'username'
        const user = await prisma.user.findUnique({
          where: {
            username: credentials.username 
          }
        });

        // 3. Se usuário não existe ou não tem um hash de senha
        if (!user || !user.passwordHash) {
          console.log("Usuário não encontrado ou sem hash de senha");
          return null
        }

        // 4. Compara a senha enviada com o hash salvo no banco
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.passwordHash 
        );

        if (isPasswordCorrect) {
          // 5. Sucesso! Retorna os dados do usuário para a sessão
          return {
            id: user.id,
            name: user.name,
            email: user.email 
            // ...quaisquer outros dados do usuário
          }
        }
        
        // Se a senha estiver incorreta
        console.log("Senha incorreta");
        return null
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/admin/login' 
  }
})

export { handler as GET, handler as POST }