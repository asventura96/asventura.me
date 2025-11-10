// src/components/DeleteSkillButton.tsx
'use client' // <-- Marca este como um Componente de Cliente

// Importa a Server Action que acabamos de criar
import { deleteSkill } from '@/app/admin/skills/actions' 

// O componente recebe o ID da competência que ele deve excluir
export default function DeleteSkillButton({ id }: { id: number }) {

  const handleDelete = () => {
    // 1. Mostra o pop-up de confirmação
    if (window.confirm('Tem certeza que deseja excluir esta competência?')) {

      // 2. Se o usuário clicar "OK", chama a Server Action
      deleteSkill(id)
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