// src/components/DeleteCourseButton.tsx
'use client' // <-- Marca este como um Componente de Cliente

// Importa a Server Action que acabamos de criar
import { deleteCourse } from '@/app/admin/courses/actions' 

// O componente recebe o ID do item que ele deve excluir
export default function DeleteCourseButton({ id }: { id: number }) {

  const handleDelete = () => {
    // 1. Mostra o pop-up de confirmação
    if (window.confirm('Tem certeza que deseja excluir este curso?')) {

      // 2. Se o usuário clicar "OK", chama a Server Action
      deleteCourse(id)
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