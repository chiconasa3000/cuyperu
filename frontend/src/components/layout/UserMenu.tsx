'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';
import { useAuthStore, selectIsAuthenticated } from '@/store/auth';

export default function UserMenu() {
  const router = useRouter();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  if (!isAuthenticated) {
    return (
      <Link
        href="/login"
        className="hidden rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark sm:block"
      >
        Ingresar
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/account"
        title={user?.name ?? 'Mi cuenta'}
        className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
      >
        <User className="h-4 w-4" />
        <span className="hidden max-w-[100px] truncate lg:block">
          {user?.name ?? user?.email}
        </span>
      </Link>
      <button
        onClick={() => {
          logout();
          router.push('/');
          router.refresh();
        }}
        aria-label="Cerrar sesión"
        className="rounded-full border border-stone-300 p-2 text-stone-600 transition-colors hover:border-red-400 hover:text-red-500 dark:border-stone-700 dark:text-stone-300"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}