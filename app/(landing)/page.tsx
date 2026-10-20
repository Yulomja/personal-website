import { Home } from '@/components/home';
import { copy } from '@/lib/copy';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata('en', 'Loredana Piazza', copy.en.description);
export default function Page() { return <Home locale="en" />; }
