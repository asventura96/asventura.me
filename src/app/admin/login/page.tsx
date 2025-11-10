// Este TEM que ser um Componente de Cliente, pois tem interação do usuário
'use client'

// Imports necessários
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  // Função que roda quando o formulário é enviado
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null) // Limpa erros antigos

    const formData = new FormData(event.currentTarget)
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    // Tenta fazer o login usando as 'credentials' que definimos
    const result = await signIn('credentials', {
      redirect: false, // Importante: não redireciona automático
      username: username,
      password: password,
    })

    // Verifica se o login deu certo
    if (result?.ok) {
      // Deu certo! Manda o usuário para o painel admin.
      router.push('/admin') 
    } else {
      // Deu errado! Mostra uma mensagem de erro.
      setError('Credenciais inválidas. Tente novamente.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 dark:bg-zinc-900">
      <main className="w-full max-w-md p-8 bg-white dark:bg-black shadow-xl rounded-xl">
        <h1 className="text-3xl font-bold text-center text-black dark:text-white mb-6">
          Login Admin
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo Usuário */}
          <div>
            <label 
              htmlFor="username" 
              className="block text-sm font-medium text-gray-700 dark:text-zinc-300"
            >
              Usuário
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-zinc-800 dark:text-white"
            />
          </div>

          {/* Campo Senha */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 dark:text-zinc-300"
            >
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-zinc-800 dark:text-white"
            />
          </div>

          {/* Mensagem de Erro (se houver) */}
          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          {/* Botão de Entrar */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Entrar
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}