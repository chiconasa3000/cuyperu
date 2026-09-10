'use client';

import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import type { Product } from '@/lib/types';
import { useCartStore } from '@/store/cart';

interface AddToCartButtonProps {
  product: Product;
  variant?: 'icon' | 'full';
  className?: string;
}

export default function AddToCartButton({
  product,
  variant = 'icon',
  className = '',
}: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: Number(product.price),
      imageUrl: product.imageUrl,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (variant === 'full') {
    return (
      <button
        onClick={handleClick}
        className={`flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark ${className}`}
      >
        {added ? (
          <>
            <Check className="h-5 w-5" />
            Agregado
          </>
        ) : (
          <>
            <ShoppingCart className="h-5 w-5" />
            Agregar al carrito
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      aria-label={`Agregar ${product.name} al carrito`}
      className={`flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors ${
        added ? 'bg-emerald-500' : 'bg-primary hover:bg-primary-dark'
      } ${className}`}
    >
      {added ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
    </button>
  );
}