// src/lib/auth.ts

import { prisma } from '@/lib/prismaClient'; // Importa seu Prisma
import { getServerSession, type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import * as bcrypt from 'bcrypt';

// 1. Copiamos suas opções de autenticação para cá
export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Usuário", type: "text" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { username: credentials.username }
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (isPasswordCorrect) {
          return {
            id: user.id,
            name: user.name,
            email: user.email
          };
        }
        return null;
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/admin/login'
  }
};

// 2. Criamos o "getAuthSession" que estava faltando
export const getAuthSession = () => getServerSession(authOptions);