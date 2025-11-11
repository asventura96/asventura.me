// src/components/DeleteEducationButton.tsx
'use client' // <-- Marca este como um Componente de Cliente

// Importa a Server Action que acabamos de criar
import { deleteEducation } from '@/app/admin/education/actions' 

// O componente recebe o ID do item que ele deve excluir
export default function DeleteEducationButton({ id }: { id: number }) {

  const handleDelete = () => {
    // 1. Mostra o pop-up de confirmação
    if (window.confirm('Tem certeza que deseja excluir este item de formação?')) {

      // 2. Se o usuário clicar "OK", chama a Server Action
      deleteEducation(id)
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