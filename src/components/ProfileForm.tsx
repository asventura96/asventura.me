// src/components/ProfileForm.tsx
'use client' 

import { useState, useTransition } from 'react'
import { updateProfile } from '@/app/admin/profile/actions' 
import { IMaskInput } from 'react-imask'

// --- (Funções de cálculo de Idade e Signo - sem mudanças) ---
function getAge(dateString: string): number | null {
  if (!dateString) return null
  const today = new Date()
  const birthDate = new Date(dateString)
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}
function getZodiacSign(dateString: string): string {
  if (!dateString) return "---"
  const date = new Date(dateString)
  const day = date.getDate() + 1; const month = date.getMonth() + 1;
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquário ♒"
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Peixes ♓"
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Áries ♈"
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Touro ♉"
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gêmeos ♊"
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Câncer ♋"
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leão ♌"
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgem ♍"
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra ♎"
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Escorpião ♏"
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagitário ♐"
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricórnio ♑"
  return "---"
}

// --- O COMPONENTE DO FORMULÁRIO ---
export default function ProfileForm({ profileData }: { profileData: any }) {

  const [birthdate, setBirthdate] = useState(
    profileData.birthdate ? profileData.birthdate.toISOString().split('T')[0] : ''
  )
  const [age, setAge] = useState<number | null>(getAge(birthdate))
  const [sign, setSign] = useState<string>(getZodiacSign(birthdate))
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null)

  const inputStyle = "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md shadow-sm dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"

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
        const result: any = await updateProfile(formData)
        setMessage({ text: result.message || "Perfil salvo com sucesso!", type: 'success' })
      } catch (error) {
        setMessage({ text: "Erro ao salvar o perfil. Tente novamente.", type: 'error' })
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-8">

      {/* --- SEÇÃO: INFORMAÇÕES BÁSICAS --- */}
      <div className="space-y-6 p-4 border border-gray-200 dark:border-zinc-700 rounded-lg">
        <h2 className="text-lg font-semibold text-black dark:text-white">Informações Básicas</h2>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Seu Nome</label>
          <input id="name" name="name" type="text" required className={inputStyle} defaultValue={profileData.name || ''} />
        </div>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Seu Título</label>
          <input id="title" name="title" type="text" required className={inputStyle} defaultValue={profileData.title || ''} />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Local (Ex: Belo Horizonte, MG)</label>
          <input id="location" name="location" type="text" className={inputStyle} defaultValue={profileData.location || ''} />
        </div>

        {/* --- CAMPO NOVO ADICIONADO AQUI --- */}
        <div>
          <label htmlFor="photo_url" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Caminho da Foto de Perfil</label>
          <input
            id="photo_url"
            name="photo_url"
            type="text"
            className={inputStyle}
            defaultValue={profileData.photo_url || ''}
            placeholder="Ex: /minha-foto.jpg"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-zinc-400">
            Coloque sua foto na pasta `public` e use o caminho (começando com /).
          </p>
        </div>

      </div>

      {/* --- SEÇÃO: CONTATO (COM MÁSCARA) --- */}
      <div className="space-y-6 p-4 border border-gray-200 dark:border-zinc-700 rounded-lg">
        {/* ... (código do contato com máscara) ... */}
        <h2 className="text-lg font-semibold text-black dark:text-white">Contato</h2>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Email</label>
          <input id="email" name="email" type="email" className={inputStyle} defaultValue={profileData.email || ''} />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Telefone</label>
          <IMaskInput
            mask="+55 (00) 00000-0000"
            id="phone"
            name="phone"
            type="tel"
            className={inputStyle}
            defaultValue={profileData.phone || ''}
            placeholder="+55 (31) 99999-9999"
          />
        </div>
      </div>

      {/* ... (O resto do formulário: Redes Sociais, Pessoal, Textos, Botão Salvar - sem mudanças) ... */}

      {/* --- SEÇÃO: REDES SOCIAIS --- */}
      <div className="space-y-6 p-4 border border-gray-200 dark:border-zinc-700 rounded-lg">
        <h2 className="text-lg font-semibold text-black dark:text-white">Redes Sociais (URLs completas)</h2>
        <div>
          <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">LinkedIn</label>
          <input id="linkedin_url" name="linkedin_url" type="url" className={inputStyle} defaultValue={profileData.linkedin_url || ''} />
        </div>
        <div>
          <label htmlFor="github_url" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">GitHub</label>
          <input id="github_url" name="github_url" type="url" className={inputStyle} defaultValue={profileData.github_url || ''} />
        </div>
        <div>
          <label htmlFor="website_url" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Site Pessoal / Portfólio</label>
          <input id="website_url" name="website_url" type="url" className={inputStyle} defaultValue={profileData.website_url || ''} />
        </div>
      </div>

      {/* --- SEÇÃO: PESSOAL (COM INOVAÇÃO) --- */}
      <div className="space-y-6 p-4 border border-gray-200 dark:border-zinc-700 rounded-lg">
        <h2 className="text-lg font-semibold text-black dark:text-white">Informações Pessoais</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Data de Nascimento</label>
            <input id="birthdate" name="birthdate" type="date" className={inputStyle} value={birthdate} onChange={handleDateChange} />
          </div>
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Idade</label>
              <div className="mt-1 flex items-center justify-center h-10 px-3 py-2 text-lg font-bold dark:text-white">
                {age !== null ? `${age} anos` : '---'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Signo</label>
              <div className="mt-1 flex items-center justify-center h-10 px-3 py-2 text-lg font-bold dark:text-white">
                {sign}
              </div>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="marital_status" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Estado Civil</label>
          <select id="marital_status" name="marital_status" className={inputStyle} defaultValue={profileData.marital_status || ''}>
            <option value="">Prefiro não informar</option>
            <option value="Solteiro">Solteiro</option>
            <option value="Casado">Casado</option>
            <option value="União Estável">União Estável</option>
            <option value="Divorciado">Divorciado</option>
            <option value="Viúvo">Viúvo</option>
          </select>
        </div>
      </div>

      {/* --- SEÇÃO: TEXTOS LONGOS --- */}
      <div className="space-y-6 p-4 border border-gray-200 dark:border-zinc-700 rounded-lg">
        <h2 className="text-lg font-semibold text-black dark:text-white">Textos de Apresentação</h2>
        <div>
          <label htmlFor="personal_summary" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Perfil Pessoal (Carta de Apresentação)</label>
          <textarea id="personal_summary" name="personal_summary" rows={5} className={inputStyle} defaultValue={profileData.personal_summary || ''} />
        </div>
        <div>
          <label htmlFor="professional_objectives" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Objetivos Profissionais</label>
          <textarea id="professional_objectives" name="professional_objectives" rows={5} className={inputStyle} defaultValue={profileData.professional_objectives || ''} />
        </div>
      </div>

      {/* --- Botão Salvar (com feedback) --- */}
      <div>
        <button
          type="submit"
          disabled={isPending} 
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
        >
          {isPending ? 'Salvando...' : 'Salvar Alterações do Perfil'}
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