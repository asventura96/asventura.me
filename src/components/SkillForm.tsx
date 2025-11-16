// src/components/SkillForm.tsx
'use client'

import { useTransition, useState } from 'react'

/**
 * Define o formato de resposta padronizado para a Server Action.
 */
type FormActionResult = {
  success: boolean;
  message?: string;
} | void;

/**
 * Define a assinatura da Server Action (função que recebe FormData).
 */
type FormAction = (formData: FormData) => Promise<FormActionResult>;

/**
 * Define as propriedades do componente SkillForm.
 * @property action - A Server Action (addSkill ou updateSkill) a ser executada.
 * @property initialData - Dados opcionais para popular o formulário no modo de edição.
 * @property buttonText - Texto dinâmico para o botão de submit.
 */
type SkillFormProps = {
  action: FormAction;
  initialData?: {
    id?: number;
    name: string;
    description: string;
    category: string;
    showOnProfile: boolean; // Campo adicionado para controlar a visibilidade pública
  };
  buttonText: string;
};

/**
 * Componente de formulário reutilizável para criar ou editar uma Competência (Skill).
 * Utiliza Server Actions para mutação de dados e 'useTransition' para feedback de UI.
 */
export default function SkillForm({ action, initialData, buttonText }: SkillFormProps) {

  // Hook para feedback de UI durante a execução da Server Action (pending state)
  const [isPending, startTransition] = useTransition();
  // Estado local para exibir mensagens de sucesso ou erro retornadas pela Action
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  // Estilos reutilizáveis para os inputs (Tailwind CSS)
  const inputStyle = "mt-1 block w-full px-3 py-2 border border-zinc-400 rounded-sm shadow-sm bg-white text-black focus:outline-none focus:ring-[color:var(--acento-verde)] focus:border-[color:var(--acento-verde)]";

  /**
   * Wrapper da Server Action para gerenciar o estado 'isPending' e
   * capturar as mensagens de retorno (sucesso/erro).
   */
  const handleSubmit = (formData: FormData) => {
    setMessage(null); // Limpa feedback anterior

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

      {/* Input oculto para o ID, essencial para a ação 'update' identificar o registro */}
      {initialData?.id && (
        <input type="hidden" name="id" value={initialData.id} />
      )}

      {/* --- GRID: Nome e Categoria --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-zinc-800">
            Competência (Ex: Python & Django)
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
          <label htmlFor="category" className="block text-sm font-medium text-zinc-800">
            Categoria
          </label>
          <select 
            id="category" 
            name="category" 
            required 
            className={inputStyle} 
            defaultValue={initialData?.category || ''}
          >
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

      {/* --- Descrição Detalhada --- */}
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

      {/* --- Checkbox de Visibilidade --- */}
      <div className="flex items-center space-x-3 p-4 bg-zinc-50 rounded-md border border-zinc-200">
        <input
          id="showOnProfile"
          name="showOnProfile"
          type="checkbox"
          className="h-5 w-5 text-[color:var(--acento-verde)] focus:ring-[color:var(--acento-verde)] border-gray-300 rounded"
          // O valor 'on' é enviado se marcado. Se não, nada é enviado.
          // Define como 'true' por padrão ao criar uma nova skill por aqui.
          defaultChecked={initialData?.showOnProfile ?? true}
        />
        <label htmlFor="showOnProfile" className="flex flex-col">
          <span className="text-sm font-medium text-zinc-900">Exibir no Perfil Público?</span>
          <span className="text-xs text-zinc-500">
            Se desmarcado, esta competência ficará oculta na Home, mas poderá ser vinculada a cursos.
          </span>
        </label>
      </div>

      {/* --- Botão de Ação e Feedback --- */}
      <div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-[color:var(--acento-laranja)] hover:opacity-90"
        >
          {isPending ? 'Salvando...' : buttonText}
        </button>
        
        {/* Exibe a mensagem de retorno da Server Action */}
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