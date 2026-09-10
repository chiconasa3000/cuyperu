'use client';

import { useEffect, useState } from 'react';
import { GitCompareArrows, Check } from 'lucide-react';
import type { Product } from '@/lib/types';
import { useCompareStore, isCompareFull, compareMax } from '@/store/compare';

interface CompareButtonProps {
  product: Product;
  variant?: 'icon' | 'text';
  className?: string;
}

export default function CompareButton({
  product,
  variant = 'icon',
  className = '',
}: CompareButtonProps) {
  const slugs = useCompareStore((s) => s.slugs);
  const toggle = useCompareStore((s) => s.toggle);
  const selected = slugs.includes(product.slug);
  const full = isCompareFull(slugs);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(false), 1500);
    return () => clearTimeout(t);
  }, [flash]);

  const handleClick = () => {
    if (!selected && full) {
      setFlash(true);
      return;
    }
    toggle(product.slug);
  };

  if (variant === 'text') {
    return (
      <div className="flex flex-col gap-1">
        <button
          onClick={handleClick}
          className={`inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
            selected
              ? 'border-primary bg-primary/5 text-primary'
              : 'border-stone-300 text-stone-600 hover:border-primary hover:text-primary dark:border-stone-700 dark:text-stone-300'
          } ${className}`}
        >
          <GitCompareArrows className="h-4 w-4" />
          {selected ? 'Quitar de comparar' : 'Comparar'}
        </button>
        {flash && (
          <span className="text-xs text-red-500">
            Máximo {compareMax} productos para comparar
          </span>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      aria-label={selected ? `Quitar ${product.name} de comparación` : `Agregar ${product.name} a comparación`}
      className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
        selected
          ? 'border-primary bg-primary/5 text-primary'
          : 'border-stone-300 text-stone-500 hover:border-primary hover:text-primary dark:border-stone-700 dark:text-stone-300'
      } ${className}`}
      title={selected ? 'Quitar de comparar' : 'Comparar'}
    >
      {selected ? <Check className="h-4 w-4" /> : <GitCompareArrows className="h-4 w-4" />}
    </button>
  );
}