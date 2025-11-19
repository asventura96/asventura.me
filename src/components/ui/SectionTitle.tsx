// src/components/ui/SectionTitle.tsx
interface SectionTitleProps {
  title: string;
}

export function SectionTitle({ title }: SectionTitleProps) {
  return (
    <h2 className="text-2xl mb-6 uppercase tracking-widest text-[color:var(--acento-verde)] border-b-2 border-[color:var(--acento-verde)] pb-2">
      {title}
    </h2>
  );
}