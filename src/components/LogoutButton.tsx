// src/components/LogoutButton.tsx
'use client' 

import { signOut } from 'next-auth/react'

export default function LogoutButton() {

  const handleLogout = () => {
    signOut({ callbackUrl: '/admin/login' })
  }

  return (
    <button
      onClick={handleLogout}
      className="block w-full text-center p-3 bg-[color:var(--acento-laranja)] text-white rounded-lg font-medium hover:opacity-90 transition-colors"
    >
      Sair (Logout)
    </button>
  )
}