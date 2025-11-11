// src/components/CourseForm.tsx
'use client' // <-- Marca como Componente de Cliente

import { useTransition, useState } from 'react'
import { useRouter } from 'next/navigation'
import { IMaskInput } from 'react-imask' // Importa a Máscara

// Define o tipo de 'action' que o formulário vai chamar
type FormAction = (formData: FormData) => Promise<any>;

// Define os dados que o formulário recebe (para pré-preencher)
type CourseFormProps = {
  action: FormAction;
  initialData?: {
    id?: number;
    name: string;
    type: string;
    institution: string;
    date: string;
    workload: string | null;
    skills_acquired: string | null;
    url: string | null;
    notes: string | null;
  };
  buttonText: string;
};

export default function CourseForm({ action, initialData, buttonText }: CourseFormProps) {

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const inputStyle = "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md shadow-sm dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500";

  // Máscara para a data (mm/aaaa)
  const dateMask = {
    mask: 'MM/YYYY',
    blocks: {
      MM: { mask: IMask.MaskedRange, from: 1, to: 12, maxLength: 2, placeholderChar: 'm' },
      YYYY: { mask: IMask.MaskedRange, from: 1980, to: 2050, maxLength: 4, placeholderChar: 'a' }
    },
    placeholderChar: '_',
  };

  const handleSubmit = (formData: FormData) => {
    setMessage(null);

    startTransition(async () => {
      try {
        const result = await action(formData);

        if (result && result.success === false) {
          setMessage({ text: result.message || "Erro desconhecido.", type: 'error' });
        } else {
          if (result && result.message) {
             setMessage({ text: result.message, type: 'success' });
          }
        }
      } catch (error) {
        setMessage({ text: "Erro ao salvar. Tente novamente.", type: 'error' });
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-6">

      {initialData?.id && (
        <input type="hidden" name="id" value={initialData.id} />
      )}

      {/* --- Linha 1: Nome e Tipo --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
            Nome do Curso/Certificação
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
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
            Tipo (Obrigatório)
          </label>
          <select
            id="type"
            name="type"
            required
            className={inputStyle}
            defaultValue={initialData?.type || ''}
          >
            <option value="">Selecione o tipo</option>
            <option value="Curso">Curso</option>
            <option value="Certificação">Certificação</option>
            <option value="Workshop">Workshop</option>
            <option value="Palestra">Palestra</option>
          </select>
        </div>
      </div>

      {/* --- Linha 2: Instituição, Data e Carga-Horária --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="institution" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
            Instituição Emitente
          </label>
          <input
            id="institution"
            name="institution"
            type="text"
            required
            className={inputStyle}
            defaultValue={initialData?.institution || ''}
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
            Data Conclusão (mm/aaaa)
          </label>
          <IMaskInput
            {...dateMask}
            id="date"
            name="date"
            type="text"
            required
            className={inputStyle}
            defaultValue={initialData?.date || ''}
            placeholder="05/2024"
          />
        </div>
        <div>
          <label htmlFor="workload" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
            Carga Horária (Opcional)
          </label>
          <input
            id="workload"
            name="workload"
            type="text"
            className={inputStyle}
            defaultValue={initialData?.workload || ''}
            placeholder="Ex: 40h"
          />
        </div>
      </div>

      {/* --- Linha 3: URL do Certificado --- */}
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
          URL do Certificado (Opcional)
        </label>
        <input
          id="url"
          name="url"
          type="url"
          className={inputStyle}
          defaultValue={initialData?.url || ''}
          placeholder="https://..."
        />
      </div>

      {/* --- Linha 4: Competências Adquiridas --- */}
      <div>
        <label htmlFor="skills_acquired" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
          Competências Adquiridas (Skills)
        </label>
        <textarea
          id="skills_acquired"
          name="skills_acquired"
          rows={3}
          className={inputStyle}
          placeholder="Liste as principais habilidades aprendidas..."
          defaultValue={initialData?.skills_acquired || ''}
        />
      </div>

      {/* --- Linha 5: Observações --- */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
          Observações (Opcional)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          className={inputStyle}
          placeholder="Qualquer detalhe extra..."
          defaultValue={initialData?.notes || ''}
        />
      </div>

      {/* --- Botão Salvar --- */}
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