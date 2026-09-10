import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <span className="text-6xl">🔍</span>
      <h1 className="mt-6 text-4xl font-extrabold tracking-tight">404</h1>
      <p className="mt-3 text-stone-500 dark:text-stone-400">
        Lo sentimos, la página que buscas no existe o el producto ya no está
        disponible.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
      >
        Volver al inicio
      </Link>
    </div>
  );
}