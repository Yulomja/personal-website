import { withBasePath } from './paths';
export const locales = ['en', 'de'] as const;
export type Locale = (typeof locales)[number];
export const isLocale = (value: string): value is Locale => locales.includes(value as Locale);
export function otherLocale(locale: Locale): Locale { return locale === 'en' ? 'de' : 'en'; }
export function localePath(locale: Locale, path = ''): string {
  return withBasePath(`/${locale}/${path.replace(/^\/+|\/+$/g, '')}${path.replace(/^\/+|\/+$/g, '') ? '/' : ''}`);
}
export function formatDate(date: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'de-CH', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`));
}
