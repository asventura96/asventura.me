import { withAuth } from "next-auth/middleware"

export default withAuth({
  // Configurações do 'withAuth'
  callbacks: {
    // Define se o usuário está autorizado
    authorized: ({ token }) => !!token, // Se o 'token' existir, está autorizado
  },
  // Se o login falhar ou for necessário,
  // redireciona para a página que criámos
  pages: {
    signIn: '/admin/login',
  },
})

// Define quais rotas serão protegidas
export const config = { matcher: ["/admin/:path*"] }