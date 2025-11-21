// src/components/ProfileForm.tsx
'use client' 

import { useTransition, useState } from 'react'
import { IMaskInput } from 'react-imask' 

type FormActionResult = {
  success: boolean;
  message?: string;
} | void; 

type FormAction = (formData: FormData) => Promise<FormActionResult>; 

type ProfileFormProps = {
  action: FormAction; 
  initialData?: {
    id?: number; name: string | null; title: string | null; email: string | null; 
    phone: string | null; location: string | null; linkedin_url: string | null; 
    github_url: string | null; website_url: string | null; birthdate: Date | null; 
    marital_status: string | null; personal_summary: string | null; 
    professional_objectives: string | null; photo_url: string | null;
  };
  buttonText: string;
};

// Funções de cálculo de Idade/Signo
function getAge(dateString: string): number | null {
  if (!dateString) return null;
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function getZodiacSign(dateString: string): string {
  if (!dateString) return "---";
  const date = new Date(dateString);
  const day = date.getDate() + 1; 
  const month = date.getMonth() + 1;
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquário ♒";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Peixes ♓";
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Áries ♈";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Touro ♉";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gêmeos ♊";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Câncer ♋";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leão ♌";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgem ♍";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra ♎";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Escorpião ♏";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagitário ♐";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricórnio ♑";
  return "---";
}
// A variável 'dateMask' (que causava alerta) foi removida

export default function ProfileForm({ action, initialData, buttonText }: ProfileFormProps) {
  
  const [birthdate, setBirthdate] = useState(
    initialData?.birthdate ? initialData.birthdate.toISOString().split('T')[0] : ''
  )
  const [age, setAge] = useState<number | null>(getAge(birthdate))
  const [sign, setSign] = useState<string>(getZodiacSign(birthdate))
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] =useState<{ text: string, type: 'success' | 'error' } | null>(null);
  
  const inputStyle = "mt-1 block w-full px-3 py-2 border border-zinc-400 rounded-sm shadow-sm bg-white text-black focus:outline-none focus:ring-[color:var(--acento-verde)] focus:border-[color:var(--acento-verde)]";
  const labelStyle = "block text-sm font-medium text-zinc-800"; // Labels escuras

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value
    setBirthdate(newDate)
    setAge(getAge(newDate))
    setSign(getZodiacSign(newDate))
  }

  const handleSubmit = (formData: FormData) => {
    setMessage(null) 
    startTransition(async () => {
      try {
        const result = await action(formData)
        if (result && result.success === false) {
          setMessage({ text: result.message || "Erro desconhecido.", type: 'error' })
        } else if (result && result.message) {
          setMessage({ text: result.message, type: 'success' })
        }
      } catch (e) { 
        console.error(e)
        setMessage({ text: "Erro ao salvar. Tente novamente.", type: 'error' })
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      
      <div className="space-y-6 p-4 border border-zinc-300 rounded-lg">
        <h2 className="text-lg font-semibold text-zinc-800">Informações Básicas</h2>
        <div>
          <label htmlFor="name" className={labelStyle}>Seu Nome</label>
          <input id="name" name="name" type="text" required className={inputStyle} defaultValue={initialData?.name || ''} />
        </div>
        <div>
          <label htmlFor="title" className={labelStyle}>Seu Título</label>
          <input id="title" name="title" type="text" required className={inputStyle} defaultValue={initialData?.title || ''} />
        </div>
        <div>
          <label htmlFor="location" className={labelStyle}>Local (Ex: Belo Horizonte, MG)</label>
          <input id="location" name="location" type="text" className={inputStyle} defaultValue={initialData?.location || ''} />
        </div>
        <div>
          <label htmlFor="photo_url" className={labelStyle}>Caminho da Foto de Perfil</label>
          <input id="photo_url" name="photo_url" type="text" className={inputStyle} defaultValue={initialData?.photo_url || ''} placeholder="Ex: /minha-foto.jpg" />
        </div>
      </div>

      <div className="space-y-6 p-4 border border-zinc-300 rounded-lg">
        <h2 className="text-lg font-semibold text-zinc-800">Contato</h2>
        <div>
          <label htmlFor="email" className={labelStyle}>Email</label>
          <input id="email" name="email" type="email" className={inputStyle} defaultValue={initialData?.email || ''} />
        </div>
        <div>
          <label htmlFor="phone" className={labelStyle}>Telefone</label>
          <IMaskInput
            mask="+55 (00) 00000-0000"
            id="phone"
            name="phone"
            type="tel"
            className={inputStyle}
            defaultValue={initialData?.phone || ''}
            placeholder="+55 (31) 99999-9999"
          />
        </div>
      </div>

      <div className="space-y-6 p-4 border border-zinc-300 rounded-lg">
        <h2 className="text-lg font-semibold text-zinc-800">Redes Sociais (URLs completas)</h2>
        <div>
          <label htmlFor="linkedin_url" className={labelStyle}>LinkedIn</label>
          <input id="linkedin_url" name="linkedin_url" type="url" className={inputStyle} defaultValue={initialData?.linkedin_url || ''} />
        </div>
        <div>
          <label htmlFor="github_url" className={labelStyle}>GitHub</label>
          <input id="github_url" name="github_url" type="url" className={inputStyle} defaultValue={initialData?.github_url || ''} />
        </div>
        <div>
          <label htmlFor="website_url" className={labelStyle}>Site Pessoal / Portfólio</label>
          <input id="website_url" name="website_url" type="url" className={inputStyle} defaultValue={initialData?.website_url || ''} />
        </div>
      </div>
      
      <div className="space-y-6 p-4 border border-zinc-300 rounded-lg">
        <h2 className="text-lg font-semibold text-zinc-800">Informações Pessoais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="birthdate" className={labelStyle}>Data de Nascimento</label>
            <input id="birthdate" name="birthdate" type="date" className={inputStyle} value={birthdate} onChange={handleDateChange} />
          </div>
          <div className="flex space-x-4">
            <div>
              <label className={labelStyle}>Idade</label>
              <div className="mt-1 flex items-center justify-center h-10 px-3 py-2 text-lg font-medium text-black">
                {age !== null ? `${age} anos` : '---'}
              </div>
            </div>
            <div>
              <label className={labelStyle}>Signo</label>
              <div className="mt-1 flex items-center justify-center h-10 px-3 py-2 text-lg font-medium text-black">
                {sign}
              </div>
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="marital_status" className={labelStyle}>Estado Civil</label>
          <select id="marital_status" name="marital_status" className={inputStyle} defaultValue={initialData?.marital_status || ''}>
            <option value="">Prefiro não informar</option>
            <option value="Solteiro">Solteiro</option>
            <option value="Casado">Casado</option>
            <option value="União Estável">União Estável</option>
            <option value="Divorciado">Divorciado</option>
            <option value="Viúvo">Viúvo</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-6 p-4 border border-zinc-300 rounded-lg">
        <h2 className="text-lg font-semibold text-zinc-800">Textos de Apresentação</h2>
        <div>
          <label htmlFor="personal_summary" className={labelStyle}>Perfil Pessoal (Carta de Apresentação)</label>
          <textarea id="personal_summary" name="personal_summary" rows={5} className={inputStyle} defaultValue={initialData?.personal_summary || ''} />
        </div>
        <div>
          <label htmlFor="professional_objectives" className={labelStyle}>Objetivos Profissionais</label>
          <textarea id="professional_objectives" name="professional_objectives" rows={5} className={inputStyle} defaultValue={initialData?.professional_objectives || ''} />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isPending} 
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[color:var(--acento-laranja)] hover:opacity-90 disabled:opacity-50"
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
  )
}