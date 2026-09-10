'use client';

import { Heart } from 'lucide-react';
import type { Product } from '@/lib/types';
import { useWishlistStore } from '@/store/wishlist';

interface WishlistButtonProps {
  product: Product;
  variant?: 'icon' | 'text';
  className?: string;
}

export default function WishlistButton({
  product,
  variant = 'icon',
  className = '',
}: WishlistButtonProps) {
  const ids = useWishlistStore((s) => s.ids);
  const wishlisted = ids.includes(product.id);
  const toggle = useWishlistStore((s) => s.toggle);

  if (variant === 'text') {
    return (
      <button
        onClick={() => toggle(product.id)}
        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
          wishlisted
            ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400'
            : 'border-stone-300 text-stone-600 hover:border-red-300 hover:text-red-500 dark:border-stone-700 dark:text-stone-300'
        } ${className}`}
      >
        <Heart className={`h-4 w-4 ${wishlisted ? 'fill-current' : ''}`} />
        {wishlisted ? 'En favoritos' : 'Guardar en favoritos'}
      </button>
    );
  }

  return (
    <button
      onClick={() => toggle(product.id)}
      aria-label={wishlisted ? `Quitar ${product.name} de favoritos` : `Agregar ${product.name} a favoritos`}
      className={`absolute right-3 top-3 rounded-full bg-white/90 p-2 transition-colors dark:bg-stone-900/90 ${
        wishlisted
          ? 'text-red-500'
          : 'text-stone-500 hover:text-red-500 dark:text-stone-300'
      } ${className}`}
    >
      <Heart className={`h-4 w-4 ${wishlisted ? 'fill-current' : ''}`} />
    </button>
  );
}