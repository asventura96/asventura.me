// src/components/admin/SkillSelector.tsx
"use client";

import React from "react";
import AsyncCreatableSelect from "react-select/async-creatable";
// Importa os tipos necessários do react-select
import { type StylesConfig, type GroupBase } from "react-select";
import axios from "axios";
import { type skills } from "@prisma/client";

/**
 * Define o formato de opção que o react-select espera.
 * { value: ID_DA_SKILL, label: "Nome da Skill" }
 */
interface SelectOption {
  readonly value: number;
  readonly label: string;
}

/**
 * Define as propriedades que o componente SkillSelector receberá.
 */
interface SkillSelectorProps {
  value: readonly SelectOption[];
  onChange: (value: readonly SelectOption[]) => void;
}

/**
 * Define a configuração de estilos para o react-select,
 * tipando corretamente para o modo 'strict' do TypeScript.
 */
const selectStyles: StylesConfig<SelectOption, true, GroupBase<SelectOption>> = {
  control: (base) => ({
    ...base,
    backgroundColor: "#2D3748",
    borderColor: "#4A5568",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#2D3748",
  }),
  option: (base, { isFocused, isSelected }) => ({
    ...base,
    backgroundColor: isSelected
      ? "#2B6CB0"
      : isFocused
        ? "#4A5568"
        : "#2D3748",
    color: "#E2E8F0",
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#4A5568",
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "#E2E8F0",
  }),
  input: (base) => ({
    ...base,
    color: "#E2E8F0",
  }),
};

/**
 * Componente assíncrono para buscar e criar skills.
 * Utiliza o react-select para fornecer uma UI de autocomplete "criável".
 */
const SkillSelector: React.FC<SkillSelectorProps> = ({ value, onChange }) => {

  const loadOptions = async (inputValue: string): Promise<SelectOption[]> => {
    try {
      const response = await axios.get(
        `/api/admin/skills?search=${inputValue}`
      );
      const skills: skills[] = response.data;
      return skills.map((skill) => ({
        value: skill.id,
        label: skill.name,
      }));
    } catch (error) {
      console.error("Erro ao buscar skills:", error);
      return [];
    }
  };

  const handleCreate = async (inputValue: string) => {
    try {
      const response = await axios.post("/api/admin/skills", {
        name: inputValue,
      });

      const newSkill: skills = response.data;
      const newOption: SelectOption = {
        value: newSkill.id,
        label: newSkill.name,
      };
      onChange([...value, newOption]);
    } catch (error) {
      console.error("Erro ao criar skill:", error);
    }
  };

  return (
    <AsyncCreatableSelect
      isMulti
      cacheOptions
      value={value}
      onChange={onChange}
      loadOptions={loadOptions}
      onCreateOption={handleCreate}
      placeholder="Digite para buscar ou criar uma skill..."
      formatCreateLabel={(inputValue) => `Criar e adicionar "${inputValue}"`}
      styles={selectStyles} // Aplica os estilos tipados
    />
  );
};

export default SkillSelector;