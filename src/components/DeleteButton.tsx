// src/components/DeleteButton.tsx
'use client' 

import { useTransition } from 'react'

/**
 * Props para o botão de exclusão genérico.
 * Recebe o 'id' do item e a 'deleteAction' (Server Action) a ser executada.
 */
type DeleteButtonProps = {
  id: number;
  deleteAction: (id: number) => Promise<void>; 
};

/**
 * Um botão de cliente reutilizável que chama uma Server Action de exclusão
 * após uma confirmação (window.confirm).
 */
export default function DeleteButton({ id, deleteAction }: DeleteButtonProps) {

  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.')) {

      startTransition(async () => {
        try {
          await deleteAction(id);
        } catch (error) {
          console.error("Erro ao executar a ação de exclusão:", error);
          // Um feedback de erro mais robusto pode ser adicionado aqui
        }
      });
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending} 
      className="text-sm text-[color:var(--acento-laranja)] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending ? 'Excluindo...' : 'Excluir'}
    </button>
  )
}