// src/components/ui/button.tsx

/**
 * Componente de botão baseado em Radix + tailwind-variants (CVA).
 * 
 * - Centraliza variações visuais (variant/size) usando `cva`.
 * - Mantém semântica flexível com `Slot` quando `asChild` é usado,
 *   permitindo transformar o botão em qualquer elemento/âncora mantendo os estilos.
 * - Aplica estados de acessibilidade: foco visível, aria-invalid, disabled etc.
 * - Ícones são normalizados via seletores globais ([&_svg]) dentro do próprio botão.
 */

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Definição de variantes visuais do botão.
 * `cva` gera dinamicamente classes com base nas props (variant/size).
 * Isso evita repetição de CSS e padroniza o design system.
 */
const buttonVariants = cva(
  // Estilos base aplicados a todos os botões
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all " +
    "disabled:pointer-events-none disabled:opacity-50 " +
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 " +
    "outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] " +
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      /**
       * `variant`: tratam variações semânticas do botão.
       * Útil para padronizar hierarquia visual (primário, secundário, ghost etc).
       */
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },

      /**
       * `size`: controla dimensões e espaçamentos internos.
       * Evita duplicação de classes nos componentes que usam o botão.
       */
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },

    // Valores padrão quando nenhum prop é passado
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Componente base do botão.
 *
 * - Usa `<Slot>` para permitir que componentes externos assumam a semântica
 *   preservando as classes (ex: transformar o botão em link).
 * - Aplica classes geradas pelo `cva`.
 * - Todos os outros props são repassados ao elemento final (Comp).
 */
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  
  // Slot permite substituir a tag padrão mantendo o mesmo estilo
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
