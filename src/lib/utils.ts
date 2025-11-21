// src/lib/utils.ts

// Importa clsx para compor classes condicionalmente.
// Importa twMerge para normalizar/mesclar classes Tailwind evitando conflitos (ex: px-2 vs px-4).
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Helper centralizado para composição de classes.
// Pipeline:
// 1. clsx resolve condicionais, arrays e objetos.
// 2. twMerge resolve conflitos entre utilitários Tailwind gerando a versão final correta.
// Rationale: padroniza composição de classes em todos os componentes do design system.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
