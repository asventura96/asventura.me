// src/components/LanguageForm.tsx
'use client' 

import { useTransition, useState } from 'react'

// --- Tipos de Código Limpo ---
type FormActionResult = {
  success: boolean;
  message?: string;
} | void; 

type FormAction = (formData: FormData) => Promise<FormActionResult>; 

type LanguageFormProps = {
  action: FormAction;
  initialData?: {
    id?: number;
    name: string | null;
    level: string | null;
  };
  buttonText: string;
};

export default function LanguageForm({ action, initialData, buttonText }: LanguageFormProps) {

  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const inputStyle = "mt-1 block w-full px-3 py-2 border border-zinc-400 rounded-sm shadow-sm bg-white text-black focus:outline-none focus:ring-[color:var(--acento-verde)] focus:border-[color:var(--acento-verde)]";

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
      } catch (e) {
        console.error(e);
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
        <label htmlFor="name" className="block text-sm font-medium text-zinc-800">
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
        <label htmlFor="level" className="block text-sm font-medium text-zinc-800">
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
          className="w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-[color:var(--acento-laranja)] hover:opacity-90"
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