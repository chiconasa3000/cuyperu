import Link from 'next/link';

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.384 4.482A13.944 13.944 0 011.67 3.149a4.916 4.916 0 001.523 6.574 4.897 4.897 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.224.084 4.918 4.918 0 004.6 3.417A9.867 9.867 0 010 19.54a13.94 13.94 0 007.548 2.212c9.142 0 14.307-7.721 13.995-14.646A10.025 10.025 0 0024 4.557z" />
    </svg>
  );
}

const SHOP_LINKS = [
  { href: '/products?category=COMMERCIAL', label: 'Cuy Comercial' },
  { href: '/products?category=MEDIUM', label: 'Cuy Mediano' },
  { href: '/products?category=LARGE', label: 'Cuy Grande' },
  { href: '/products?category=BONELESS', label: 'Cuy Deshuesado' },
  { href: '/products?category=GOURMET', label: 'Cuy Gourmet' },
];

const COMPANY_LINKS = [
  { href: '/about', label: 'Nosotros' },
  { href: '/contact', label: 'Contacto' },
  { href: '/privacy', label: 'Política de Privacidad' },
  { href: '/terms', label: 'Términos y Condiciones' },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-base font-bold text-white">
              C
            </span>
            <span className="text-lg font-bold tracking-tight">
              Cuy<span className="text-primary">Peru</span>
            </span>
          </Link>
          <p className="mt-4 text-sm leading-6 text-stone-500 dark:text-stone-400">
            Cuy peruano de alta calidad, criado con pasión y entregado fresco a tu
            puerta.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-900 dark:text-stone-100">
            Productos
          </h3>
          <ul className="mt-4 space-y-2">
            {SHOP_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-stone-500 transition-colors hover:text-primary dark:text-stone-400"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-900 dark:text-stone-100">
            Empresa
          </h3>
          <ul className="mt-4 space-y-2">
            {COMPANY_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-stone-500 transition-colors hover:text-primary dark:text-stone-400"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-900 dark:text-stone-100">
            Síguenos
          </h3>
          <div className="mt-4 flex gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-200 text-stone-600 transition-colors hover:bg-primary hover:text-white dark:bg-stone-800 dark:text-stone-300"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-200 text-stone-600 transition-colors hover:bg-primary hover:text-white dark:bg-stone-800 dark:text-stone-300"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-200 text-stone-600 transition-colors hover:bg-primary hover:text-white dark:bg-stone-800 dark:text-stone-300"
            >
              <TwitterIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-stone-200 dark:border-stone-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-stone-400 sm:flex-row sm:px-6 dark:text-stone-500">
          <p>&copy; {new Date().getFullYear()} CuyPeru. Todos los derechos reservados.</p>
          <p>Hecho con cariño en Perú 🇵🇪</p>
        </div>
      </div>
    </footer>
  );
}