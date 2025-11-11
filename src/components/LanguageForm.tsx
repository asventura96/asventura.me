// src/components/LanguageForm.tsx
'use client' 

import { useTransition, useState } from 'react'

/**
 * Define o tipo de retorno esperado da Server Action (para o Zod).
 */
type FormActionResult = {
  success: boolean;
  message?: string;
} | void; // 'void' para ações que redirecionam

/**
 * Define o tipo da Server Action que o formulário vai chamar.
 */
type FormAction = (formData: FormData) => Promise<FormActionResult>;

/**
 * Props para o formulário genérico de Idioma.
 */
type LanguageFormProps = {
  action: FormAction;
  initialData?: {
    id?: number;
    name: string;
    level: string;
  };
  buttonText: string;
};

export default function LanguageForm({ action, initialData, buttonText }: LanguageFormProps) {

  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const inputStyle = "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md shadow-sm dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500";

  const handleSubmit = (formData: FormData) => {
    setMessage(null);

    startTransition(async () => {
      try {
        const result = await action(formData);

        if (result && result.success === false) {
          setMessage({ text: result.message || "Erro desconhecido.", type: 'error' });
        } else if (result && result.message) {
          setMessage({ text: result.message, type: 'success' });
        }
      } catch (e) { // 'error' foi substituído por 'e' e agora é usado
        console.error(e); // Loga o erro real no console
        setMessage({ text: "Erro ao salvar. Tente novamente.", type: 'error' });
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-6">

      {initialData?.id && (
        <input type="hidden" name="id" value={initialData.id} />
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
          Idioma (Ex: Inglês)
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className={inputStyle}
          defaultValue={initialData?.name || ''}
        />
      </div>

      <div>
        <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
          Nível (Obrigatório)
        </label>
        <select
          id="level"
          name="level"
          required
          className={inputStyle}
          defaultValue={initialData?.level || ''}
        >
          <option value="">Selecione o nível</option>
          <option value="Nativo">Nativo</option>
          <option value="Fluente">Fluente</option>
          <option value="Avançado">Avançado</option>
          <option value="Intermediário">Intermediário</option>
          <option value="Básico">Básico</option>
        </select>
      </div>

      <div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
        >
          {isPending ? 'Salvando...' : buttonText}
        </button>
        {message && (
          <p className={`text-center text-sm mt-4 ${
            message.type === 'success' ? 'text-green-500' : 'text-red-500'
          }`}>
            {message.text}
          </p>
        )}
      </div>
    </form>
  );
}