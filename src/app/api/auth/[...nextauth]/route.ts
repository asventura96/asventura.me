import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Usuário", type: "text" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        
        // --- MUDE AQUI ---
        // Defina o usuário e senha que você quer usar
        const adminUser = "admin"
        const adminPass = "admin"
        // --- MUDE AQUI ---

        const isValidUser = credentials?.username === adminUser && credentials?.password === adminPass
        
        if (isValidUser) {
          return { id: "1", name: "André Ventura", email: "admin@asventura.me" }
        } else {
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/admin/login' // Vamos criar esta página de login mais tarde
  }
})

export { handler as GET, handler as POST }