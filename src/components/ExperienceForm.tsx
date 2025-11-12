// src/components/ExperienceForm.tsx (Limpo e Corrigido)
'use client' 

import { useTransition, useState } from 'react'
import { IMaskInput } from 'react-imask' 
import IMask from 'imask' 

// --- Tipos de Código Limpo ---
type FormActionResult = {
  success: boolean;
  message?: string;
} | void; 

type FormAction = (formData: FormData) => Promise<FormActionResult>; 

// --- Configuração da Máscara de Data ---
const dateMask = {
  mask: 'MM/YYYY',
  blocks: {
    MM: { mask: IMask.MaskedRange, from: 1, to: 12, maxLength: 2, placeholderChar: 'm' },
    YYYY: { mask: IMask.MaskedRange, from: 1980, to: 2050, maxLength: 4, placeholderChar: 'a' }
  },
  placeholderChar: '_',
};

type ExperienceFormProps = {
  action: FormAction; 
  initialData?: {
    id?: number; role: string | null; company: string | null; location: string | null;
    start_date: string | null; end_date: string | null; is_current: boolean;
    activities: string | null; salary: string | null; exit_reason: string | null;
  };
  buttonText: string;
};

export default function ExperienceForm({ action, initialData, buttonText }: ExperienceFormProps) {

  const [isCurrent, setIsCurrent] = useState(initialData?.is_current || false);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null); 

  // Estilo de inputs: Fundo Branco (para combinar com o corpo do formulário)
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

      {initialData?.id && (<input type="hidden" name="id" value={initialData.id} />)}

      {/* --- Linha 1: Cargo e Empresa (Labels Legíveis) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-zinc-800">Cargo</label>
          <input id="role" name="role" type="text" required className={inputStyle} defaultValue={initialData?.role || ''} />
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-zinc-800">Empresa</label>
          <input id="company" name="company" type="text" required className={inputStyle} defaultValue={initialData?.company || ''} />
        </div>
      </div>

      {/* --- Linha 2: Local e Checkbox 'Atual' --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-zinc-800">Local (Ex: Belo Horizonte, MG)</label>
          <input id="location" name="location" type="text" className={inputStyle} defaultValue={initialData?.location || ''} />
        </div>
        <div className="flex items-center h-10">
          <input id="is_current" name="is_current" type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded" checked={isCurrent} onChange={(e) => setIsCurrent(e.target.checked)} />
          <label htmlFor="is_current" className="ml-2 block text-sm text-zinc-800">Estou atualmente nesta empresa</label>
        </div>
      </div>

      {/* --- Linha 3: Datas (COM MÁSCARA) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="start_date" className="block text-sm font-medium text-zinc-800">Data Admissão (mm/aaaa)</label>
          <IMaskInput {...dateMask} id="start_date" name="start_date" type="text" required className={inputStyle} defaultValue={initialData?.start_date || ''} placeholder="08/2021" />
        </div>
        {!isCurrent && (
          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-zinc-800">Data Desligamento (mm/aaaa)</label>
            <IMaskInput {...dateMask} id="end_date" name="end_date" type="text" className={inputStyle} defaultValue={initialData?.end_date || ''} placeholder="09/2026" />
          </div>
        )}
      </div>

      {/* --- Linha 4: Atividades Desenvolvidas --- */}
      <div>
        <label htmlFor="activities" className="block text-sm font-medium text-zinc-800">Atividades Desenvolvidas</label>
        <textarea id="activities" name="activities" rows={5} required className={inputStyle} defaultValue={initialData?.activities || ''} />
      </div>

      {/* --- Linha 5: Salário e Motivo Desligamento --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="salary" className="block text-sm font-medium text-zinc-800">Salário (Opcional)</label>
          <input id="salary" name="salary" type="text" placeholder="Ex: R$ 5.000,00" className={inputStyle} defaultValue={initialData?.salary || ''} />
        </div>
        {!isCurrent && (
          <div>
            <label htmlFor="exit_reason" className="block text-sm font-medium text-zinc-800">Motivo Desligamento (Opcional)</label>
            <input id="exit_reason" name="exit_reason" type="text" className={inputStyle} defaultValue={initialData?.exit_reason || ''} />
          </div>
        )}
      </div>

      {/* --- Botão Salvar (com feedback) --- */}
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