import Link from 'next/link';
import UserMenu from './UserMenu';
import SearchBar from './SearchBar';
import HeaderIcons from './HeaderIcons';

const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/products', label: 'Productos' },
  { href: '/about', label: 'Nosotros' },
  { href: '/contact', label: 'Contacto' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/90 backdrop-blur dark:border-stone-800 dark:bg-stone-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-base font-bold text-white">
            C
          </span>
          <span className="text-lg font-bold tracking-tight">
            Cuy<span className="text-primary">Peru</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-stone-600 transition-colors hover:text-primary dark:text-stone-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <SearchBar />
          <HeaderIcons />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}