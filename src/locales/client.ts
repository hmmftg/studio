'use client'

import { createI18nClient } from 'next-international/client'

export const { useI18n, useScopedI18n, I18nProvider, useChangeLocale, useCurrentLocale, useSetLocale } = createI18nClient({
  en: () => import('./en.json'),
  fa: () => import('./fa.json'),
  ar: () => import('./ar.json'),
  tr: () => import('./tr.json'),
  ur: () => import('./ur.json')
})
