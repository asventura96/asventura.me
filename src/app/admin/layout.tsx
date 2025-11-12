// src/app/admin/layout.tsx
import React from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen justify-center items-center p-4">
      <main className="w-full max-w-3xl p-8 my-12 bg-[color:var(--background-card)]">
        {children}
      </main>
    </div>
  );
}