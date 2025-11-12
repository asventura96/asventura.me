// src/components/EducationForm.tsx
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

type EducationFormProps = {
  action: FormAction;
  initialData?: {
    id?: number;
    institution: string | null;
    level: string | null;
    course_name: string | null;
    start_date: string | null;
    end_date: string | null;
    status: string | null;
    description: string | null;
  };
  buttonText: string;
};

export default function EducationForm({ action, initialData, buttonText }: EducationFormProps) {
  
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
        <label htmlFor="institution" className="block text-sm font-medium text-zinc-800">
          Instituição (Ex: PUC Minas)
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <option value="Ensino Médio">Ensino Médio</option>
            <option value="Técnico">Técnico</option>
            <option value="Graduação">Graduação</option>
            <option value="Pós-graduação">Pós-graduação</option>
            <option value="Mestrado">Mestrado</option>
            <option value="Doutorado">Doutorado</option>
          </select>
        </div>
        <div>
          <label htmlFor="course_name" className="block text-sm font-medium text-zinc-800">
            Nome do Curso (Ex: Engenharia de Software)
          </label>
          <input
            id="course_name"
            name="course_name"
            type="text"
            required
            className={inputStyle}
            defaultValue={initialData?.course_name || ''}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="start_date" className="block text-sm font-medium text-zinc-800">
            Data Início (mm/aaaa)
          </label>
          <IMaskInput
            {...dateMask}
            id="start_date"
            name="start_date"
            type="text"
            required
            className={inputStyle}
            defaultValue={initialData?.start_date || ''}
            placeholder="08/2021"
          />
        </div>
        <div>
          <label htmlFor="end_date" className="block text-sm font-medium text-zinc-800">
            Data Conclusão (mm/aaaa)
          </label>
          <IMaskInput
            {...dateMask}
            id="end_date"
            name="end_date"
            type="text"
            className={inputStyle}
            defaultValue={initialData?.end_date || ''}
            placeholder="09/2026"
          />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-zinc-800">
            Status (Obrigatório)
          </label>
          <select
            id="status"
            name="status"
            required
            className={inputStyle}
            defaultValue={initialData?.status || ''}
          >
            <option value="">Selecione o status</option>
            <option value="Concluído">Concluído</option>
            <option value="Cursando">Cursando</option>
            <option value="Trancado">Trancado</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-zinc-800">
          Descrição (Opcional)
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className={inputStyle}
          placeholder="Detalhes adicionais sobre o curso ou TCC..."
          defaultValue={initialData?.description || ''}
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[color:var(--acento-laranja)] hover:opacity-90"
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