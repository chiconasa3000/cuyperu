'use client';

import { useState, FormEvent, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { useCartStore } from '@/store/cart';
import { useWishlistStore, wishlistApi } from '@/store/wishlist';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);
  const setCartItems = useCartStore((s) => s.setItems);
  const wishlistSync = useWishlistStore((s) => s.sync);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.login({ email, password });
      setAuth(data.token, data.user);
      const merged = await api.mergeSessionCart().catch(() => null);
      if (merged && merged.length > 0) {
        setCartItems(
          merged.map((item) => ({
            productId: item.productId,
            slug: item.product.slug,
            name: item.product.name,
            price: Number(item.product.price),
            imageUrl: item.product.imageUrl,
            quantity: item.quantity,
          }))
        );
      }
      const remoteWishlist = await wishlistApi.fetchRemote();
      if (remoteWishlist) {
        wishlistSync(remoteWishlist.map((id) => ({ productId: id })));
      }
      const redirect = searchParams.get('redirect');
      router.push(redirect && redirect.startsWith('/') ? redirect : '/account');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <h1 className="text-center text-3xl font-bold tracking-tight">
        Iniciar sesión
      </h1>
      <p className="mt-2 text-center text-stone-500 dark:text-stone-400">
        Ingresa para continuar con tu compra.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-4 rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900"
      >
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-stone-300 px-4 py-2.5 outline-none transition-colors focus:border-primary dark:border-stone-700 dark:bg-stone-800"
            placeholder="tucorreo@ejemplo.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-stone-300 px-4 py-2.5 outline-none transition-colors focus:border-primary dark:border-stone-700 dark:bg-stone-800"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-primary py-3 font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-stone-500 dark:text-stone-400">
        ¿No tienes cuenta?{' '}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Regístrate gratis
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
          Cargando...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}