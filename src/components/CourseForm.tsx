// src/components/CourseForm.tsx
'use client' 

import { useTransition, useState } from 'react'
import { IMaskInput } from 'react-imask' 
import IMask from 'imask' 

type FormActionResult = {
  success: boolean;
  message?: string;
} | void; 

type FormAction = (formData: FormData) => Promise<FormActionResult>; 

const dateMask = {
  mask: 'MM/YYYY',
  blocks: {
    MM: { mask: IMask.MaskedRange, from: 1, to: 12, maxLength: 2, placeholderChar: 'm' },
    YYYY: { mask: IMask.MaskedRange, from: 1980, to: 2050, maxLength: 4, placeholderChar: 'a' }
  },
  placeholderChar: '_',
};

type CourseFormProps = {
  action: FormAction;
  initialData?: {
    id?: number;
    name: string | null;
    type: string | null;
    institution: string | null;
    date: string | null;
    workload: number | null;
    skills_acquired: string | null;
    url: string | null;
    notes: string | null;
  };
  buttonText: string;
};

export default function CourseForm({ action, initialData, buttonText }: CourseFormProps) {

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
          <label htmlFor="type" className="block text-sm font-medium text-zinc-800">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="institution" className="block text-sm font-medium text-zinc-800">
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
          <label htmlFor="date" className="block text-sm font-medium text-zinc-800">
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
          <label htmlFor="workload" className="block text-sm font-medium text-zinc-800">
            Carga Horária (em horas)
          </label>
          <input
            id="workload"
            name="workload"
            type="number"
            min="0"
            className={inputStyle}
            defaultValue={initialData?.workload || ''}
            placeholder="Ex: 40"
          />
        </div>
      </div>

      <div>
        <label htmlFor="url" className="block text-sm font-medium text-zinc-800">
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

      <div>
        <label htmlFor="skills_acquired" className="block text-sm font-medium text-zinc-800">
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

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-zinc-800">
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