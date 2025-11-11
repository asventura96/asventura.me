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
  
  const inputStyle = "mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm bg-zinc-100 text-black focus:outline-none focus:ring-[color:var(--acento-verde)] focus:border-[color:var(--acento-verde)]";

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <main className="w-full max-w-md p-8 bg-white shadow-xl rounded-xl">
        
        <h1 
          className="text-3xl text-center text-black mb-6"
          style={{ fontFamily: 'var(--font-concert-one)' }} // Usa a tua fonte de título
        >
          Acesso ao Painel
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="username" 
              className="block text-sm font-medium text-zinc-700"
            >
              Nome de usuário / E-mail:
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
              className="block text-sm font-medium text-zinc-700"
            >
              Senha:
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
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[color:var(--acento-laranja)] hover:opacity-90"
            >
              <i className="fas fa-arrow-right mr-2"></i> Acessar
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}