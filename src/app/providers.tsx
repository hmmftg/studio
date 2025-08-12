"use client"

import { TranslationsProvider } from '@/hooks/use-translations';

export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TranslationsProvider>
      {children}
    </TranslationsProvider>
  );
}
