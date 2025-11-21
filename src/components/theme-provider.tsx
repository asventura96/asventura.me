// src/components/theme-provider.tsx
"use client"

/**
 * Encapsula o provider do next-themes.
 * Centraliza a configuração de tema da aplicação.
 *
 * Motivo:
 * - Evita importações diretas de next-themes espalhadas pela codebase.
 * - Facilita substituição futura do sistema de temas sem refatorar todo o app.
 * - Mantém a árvore de providers clara no layout principal.
 */

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes"

/**
 * Wrapper responsável por expor o ThemeProvider com props controladas.
 * Permite definir atributos como:
 *  - attribute: controla onde o tema é aplicado (ex: class, data-theme)
 *  - defaultTheme: tema inicial (“system”, “light”, “dark”)
 *  - enableSystem: permite que o tema siga o SO
 *  - disableTransitionOnChange: remove transições ao alternar o tema
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
  )
}
