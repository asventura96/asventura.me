// src/components/LogoutButton.tsx
'use client' // <-- Marca como Componente de Cliente

// Importa a função de 'sair' do next-auth
import { signOut } from 'next-auth/react'

export default function LogoutButton() {

  const handleLogout = () => {
    // Chama a função signOut
    // callbackUrl: Para onde o usuário vai DEPOIS de sair
    signOut({ callbackUrl: '/admin/login' })
  }

  return (
    <button
      onClick={handleLogout}
      className="block w-full text-center p-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
    >
      Sair (Logout)
    </button>
  )
}