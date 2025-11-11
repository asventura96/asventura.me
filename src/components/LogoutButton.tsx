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
      className="flex items-center justify-center px-6 py-2 bg-[color:var(--acento-laranja)] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
    >
      <i className="fas fa-sign-out-alt mr-2"></i> Sair (Logout)
    </button>
  )
}