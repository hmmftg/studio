import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AdminLayout } from '@/components/AdminLayout';
import { I18nProvider } from '@/locales/client';


export const metadata: Metadata = {
  title: 'MediQueue',
  description: 'Streamlining patient care for charity healthcare.',
};

export default function RootLayout({
  children,
  params: { locale }
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body bg-background antialiased">
        <I18nProvider locale={locale}>
            <AdminLayout>
              {children}
            </AdminLayout>
            <Toaster />
        </I18nProvider>
      </body>
    </html>
  );
}
