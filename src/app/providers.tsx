"use client"

import { I18nProvider } from '@/locales/client';

export function Providers({
  children,
  locale
}: Readonly<{
  children: React.ReactNode;
  locale: string;
}>) {
  return (
    <I18nProvider locale={locale}>
      {children}
    </I18nProvider>
  );
}
