// src/app/admin/login/layout.tsx

/**
 * Este layout "anula" o layout principal do /admin (o "cartão" cinza).
 * Ele apenas renderiza os filhos (a página de login)
 * diretamente, para que a página de login possa ter o seu
 * próprio layout de "cartão" de login.
 */
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}