// src/components/DeleteLanguageButton.tsx
'use client' // <-- Marca este como um Componente de Cliente

// Importa a Server Action que acabamos de criar
import { deleteLanguage } from '@/app/admin/languages/actions' 

// O componente recebe o ID do item que ele deve excluir
export default function DeleteLanguageButton({ id }: { id: number }) {

  const handleDelete = () => {
    // 1. Mostra o pop-up de confirmação
    if (window.confirm('Tem certeza que deseja excluir este idioma?')) {

      // 2. Se o usuário clicar "OK", chama a Server Action
      deleteLanguage(id)
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="text-sm text-red-500 hover:underline"
    >
      Excluir
    </button>
  )
}