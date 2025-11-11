// src/app/admin/layout.tsx

/**
 * Este é o Layout (o "template") para TODAS as páginas
 * dentro de /admin (exceto /admin/login).
 * Ele garante o fundo escuro e o contêiner centralizado.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // O 'bg-fundo-dark' (azul) já vem do layout.tsx principal.
  // Apenas centramos o conteúdo.
  return (
    <div className="flex min-h-screen justify-center items-center p-4">

      {/* Este 'main' é o "cartão" central cinza-escuro (zinc-900). */}
      <main className="w-full max-w-3xl p-8 my-12 bg-zinc-900 shadow-xl rounded-xl">
        {children}
      </main>

    </div>
  );
}