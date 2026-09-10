'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import type { Product } from '@/lib/types';
import { api } from '@/lib/api';
import { useWishlistStore, wishlistApi } from '@/store/wishlist';
import ProductCard from '@/components/product/ProductCard';

export default function WishlistPage() {
  const ids = useWishlistStore((s) => s.ids);
  const sync = useWishlistStore((s) => s.sync);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const remote = await wishlistApi.fetchRemote();
      if (!mounted) return;
      if (remote) {
        sync(remote.map((id) => ({ productId: id })));
      }
      try {
        const all = await api.getProducts({ limit: 100 });
        if (mounted) setProducts(all.items);
      } catch {
        if (mounted) setProducts([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [sync]);

  const wishlistProducts = products.filter((p) => ids.includes(p.id));

  if (wishlistProducts.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight">Mis favoritos</h1>
        <p className="mt-2 text-stone-500 dark:text-stone-400">
          Los productos que guardas aparecerán aquí para que los encuentres rápido.
        </p>

        <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 py-24 text-center dark:border-stone-700">
          <Heart className="h-12 w-12 text-stone-300 dark:text-stone-600" />
          <h2 className="mt-4 text-xl font-semibold">
            Aún no tienes favoritos
          </h2>
          <p className="mt-2 max-w-sm text-stone-500 dark:text-stone-400">
            Toca el corazón en cualquier producto para guardarlo aquí.
          </p>
          <Link
            href="/products"
            className="mt-6 rounded-full bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Explorar productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Mis favoritos</h1>
      <p className="mt-2 text-stone-500 dark:text-stone-400">
        {wishlistProducts.length} producto
        {wishlistProducts.length !== 1 ? 's' : ''} guardado
        {wishlistProducts.length !== 1 ? 's' : ''}.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {wishlistProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}