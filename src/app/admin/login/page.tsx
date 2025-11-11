// src/app/admin/login/page.tsx
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null) 

    const formData = new FormData(event.currentTarget)
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    const result = await signIn('credentials', {
      redirect: false, 
      username: username,
      password: password,
    })

    if (result?.ok) {
      router.push('/admin') 
    } else {
      setError('Credenciais inválidas. Tente novamente.')
    }
  }

  // Estilo dos inputs para o tema escuro
  const inputStyle = "mt-1 block w-full px-3 py-2 border border-zinc-700 rounded-md shadow-sm bg-zinc-800 text-white focus:outline-none focus:ring-[color:var(--acento-verde)] focus:border-[color:var(--acento-verde)]";

  return (
    // O layout "cagado" foi removido.
    // A página de login agora tem o seu próprio "cartão"
    <div className="flex min-h-screen items-center justify-center bg-fundo-dark">
      <main className="w-full max-w-md p-8 bg-zinc-900 shadow-xl rounded-xl">
        <h1 className="text-3xl text-center text-texto-principal mb-6">
          Login Admin
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="username" 
              className="block text-sm font-medium text-texto-secundario"
            >
              Usuário
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className={inputStyle}
            />
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-texto-secundario"
            >
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className={inputStyle}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[color:var(--acento-verde)] hover:opacity-90"
            >
              Entrar
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}