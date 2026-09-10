'use client';

import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCartStore, selectCartCount } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';

export default function HeaderIcons() {
  const cartCount = useCartStore(selectCartCount);
  const wishCount = useWishlistStore((s) => s.ids.length);

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/wishlist"
        aria-label="Favoritos"
        className="relative p-2 text-stone-600 transition-colors hover:text-primary dark:text-stone-300"
      >
        <Heart className="h-5 w-5" />
        {wishCount > 0 && (
          <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {wishCount}
          </span>
        )}
      </Link>
      <Link
        href="/cart"
        aria-label="Carrito"
        className="relative p-2 text-stone-600 transition-colors hover:text-primary dark:text-stone-300"
      >
        <ShoppingCart className="h-5 w-5" />
        {cartCount > 0 && (
          <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
            {cartCount}
          </span>
        )}
      </Link>
    </div>
  );
}