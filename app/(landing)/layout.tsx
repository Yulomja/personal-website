import '@fontsource-variable/dm-sans';
import '../globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><Header locale="en" /><div className="page-content">{children}</div><Footer locale="en" /></body></html>;
}
