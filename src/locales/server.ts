import { createI18nServer } from 'next-international/server'
 
export const { getI18n, getScopedI18n, getStaticParams } = createI18nServer({
  en: () => import('./en.json'),
  fa: () => import('./fa.json'),
  ar: () => import('./ar.json'),
  tr: () => import('./tr.json'),
  ur: () => import('./ur.json')
})
