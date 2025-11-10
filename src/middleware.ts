import { withAuth } from "next-auth/middleware"

// O 'withAuth' é a função que o Next.js quer
export default withAuth(
  // Esta função é chamada QUANDO o login é bem sucedido
  function middleware(req) {
    // Você pode adicionar lógicas aqui no futuro, se quiser
    // Por agora, não faz nada
  },
  {
    // Configurações do 'withAuth'
    callbacks: {
      // Define se o usuário está autorizado
      authorized: ({ token }) => !!token // Se o 'token' existir, está autorizado
    },
    // Se o login falhar ou for necessário,
    // redireciona para a página que criámos
    pages: {
      signIn: '/admin/login',
    },
  }
)

// Define quais rotas serão protegidas (isto fica igual)
export const config = { matcher: ["/admin/:path*"] }