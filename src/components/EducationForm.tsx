// src/components/EducationForm.tsx
'use client' // <-- Marca como Componente de Cliente

import { useTransition, useState } from 'react'
import { useRouter } from 'next/navigation'
import { IMaskInput } from 'react-imask' // Importa a Máscara

// Define o tipo de 'action' que o formulário vai chamar
// (Neste caso, a nossa 'addEducation' ou 'updateEducation' no futuro)
type FormAction = (formData: FormData) => Promise<any>;

// Define os dados que o formulário recebe (para pré-preencher)
type EducationFormProps = {
  action: FormAction; // A função de salvar (add ou update)
  initialData?: { // Dados iniciais (para o 'editar')
    id?: number;
    institution: string;
    level: string;
    course_name: string;
    start_date: string;
    end_date: string | null;
    status: string;
    description: string | null;
  };
  buttonText: string; // Texto do botão (Ex: "Salvar" ou "Atualizar")
};

export default function EducationForm({ action, initialData, buttonText }: EducationFormProps) {

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  // Estilo reutilizável
  const inputStyle = "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md shadow-sm dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500";

  // Máscara para as datas
  const dateMask = {
    mask: 'MM/YYYY',
    blocks: {
      MM: { mask: IMask.MaskedRange, from: 1, to: 12, maxLength: 2, placeholderChar: 'm' },
      YYYY: { mask: IMask.MaskedRange, from: 1980, to: 2050, maxLength: 4, placeholderChar: 'a' }
    },
    placeholderChar: '_',
  };

  // Função que lida com o envio
  const handleSubmit = (formData: FormData) => {
    setMessage(null);

    startTransition(async () => {
      try {
        const result = await action(formData);

        if (result && result.success === false) {
          setMessage({ text: result.message || "Erro desconhecido.", type: 'error' });
        } else {
          // Se a action *não* redirecionar (ex: update), mostramos sucesso
          if (result && result.message) {
             setMessage({ text: result.message, type: 'success' });
          }
          // Se a action redirecionar (ex: add), o Next.js cuida disso
        }
      } catch (error) {
        setMessage({ text: "Erro ao salvar. Tente novamente.", type: 'error' });
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-6">

      {/* Se for um formulário de EDIÇÃO, precisamos do ID escondido */}
      {initialData?.id && (
        <input type="hidden" name="id" value={initialData.id} />
      )}

      {/* --- Linha 1: Instituição --- */}
      <div>
        <label htmlFor="institution" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
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

      {/* --- Linha 2: Nível e Curso --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <option value="Ensino Médio">Ensino Médio</option>
            <option value="Técnico">Técnico</option>
            <option value="Graduação">Graduação</option>
            <option value="Pós-graduação">Pós-graduação</option>
            <option value="Mestrado">Mestrado</option>
            <option value="Doutorado">Doutorado</option>
            <option value="Curso Extracurricular">Curso Extracurricular</option>
            <option value="Certificação">Certificação</option>
          </select>
        </div>
        <div>
          <label htmlFor="course_name" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
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

      {/* --- Linha 3: Datas (com máscara) e Status --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
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
          <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
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
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
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

      {/* --- Linha 4: Descrição (Opcional) --- */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
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