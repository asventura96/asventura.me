// src/components/DeleteExperienceButton.tsx
'use client' // <-- Marca este como um Componente de Cliente

import { deleteExperience } from '@/app/admin/experiences/actions' // Importa a Server Action que criamos

// O componente recebe o ID da experiência que ele deve excluir
export default function DeleteExperienceButton({ id }: { id: number }) {

  const handleDelete = () => {
    // 1. Mostra o pop-up de confirmação
    if (window.confirm('Tem certeza que deseja excluir esta experiência? Esta ação não pode ser desfeita.')) {

      // 2. Se o usuário clicar "OK", chama a Server Action
      //    (Nós não precisamos nos preocupar com 'await' ou 'loading'
      //     porque a página vai se revalidar automaticamente)
      deleteExperience(id)
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