// src/components/SkillForm.tsx
'use client' 

import { useTransition, useState } from 'react'

// --- Tipos de Código Limpo ---
type FormActionResult = {
  success: boolean;
  message?: string;
} | void; 

type FormAction = (formData: FormData) => Promise<FormActionResult>; 

type SkillFormProps = {
  action: FormAction;
  initialData?: {
    id?: number;
    name: string;
    description: string;
    category: string;
  };
  buttonText: string;
};

export default function SkillForm({ action, initialData, buttonText }: SkillFormProps) {

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-zinc-800">
            Competência (Ex: Python & Django)
          </label>
          <input id="name" name="name" type="text" required className={inputStyle} defaultValue={initialData?.name || ''} />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-zinc-800">
            Categoria
          </label>
          <select id="category" name="category" required className={inputStyle} defaultValue={initialData?.category || ''}>
            <option value="">Selecione uma categoria</option>
            <option value="Back-end">Back-end</option>
            <option value="Front-end">Front-end</option>
            <option value="Bancos de Dados">Bancos de Dados</option>
            <option value="Plataformas & Ferramentas">Plataformas & Ferramentas</option>
            <option value="Infraestrutura & Redes">Infraestrutura & Redes</option>
            <option value="Soft Skill">Soft Skill (Comportamental)</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-zinc-800">
          Descrição
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          required
          className={inputStyle}
          placeholder="Ex: Conhecimento prático em Python com experiência em desenvolvimento..."
          defaultValue={initialData?.description || ''}
        />
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