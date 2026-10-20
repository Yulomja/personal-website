'use client';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/lib/locales';
import { HeaderView } from './header-view';
export function Header({ locale, alternatePaths }: { locale: Locale; alternatePaths?: Record<string, Record<string, string>> }) {
  return <HeaderView locale={locale} pathname={usePathname()} alternatePaths={alternatePaths} />;
}
