'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GitCompareArrows, Trash2 } from 'lucide-react';
import type { Product } from '@/lib/types';
import { CATEGORY_LABELS } from '@/lib/types';
import { api } from '@/lib/api';
import { useCompareStore, compareMax } from '@/store/compare';
import { formatPrice } from '@/lib/format';
import AddToCartButton from '@/components/product/AddToCartButton';

export default function ComparePage() {
  const slugs = useCompareStore((s) => s.slugs);
  const remove = useCompareStore((s) => s.remove);
  const clear = useCompareStore((s) => s.clear);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (slugs.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }
      try {
        const all = await api.getProducts({ limit: 100 });
        if (mounted) {
          const bySlug = new Map(all.items.map((p) => [p.slug, p]));
          setProducts(slugs.map((slug) => bySlug.get(slug)).filter(Boolean) as Product[]);
        }
      } catch {
        if (mounted) setProducts([]);
      }
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [slugs]);

  if (loading) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <p className="text-stone-500 dark:text-stone-400">Cargando comparación...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight">Comparar productos</h1>
        <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 py-24 text-center dark:border-stone-700">
          <GitCompareArrows className="h-12 w-12 text-stone-300 dark:text-stone-600" />
          <h2 className="mt-4 text-xl font-semibold">Nada para comparar</h2>
          <p className="mt-2 max-w-sm text-stone-500 dark:text-stone-400">
            Agrega hasta {compareMax} productos para compararlos lado a lado.
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

  const nutritionRow = (getter: (p: Product) => string | number | null | undefined, label: string) => (
    <tr className="border-b border-stone-100 dark:border-stone-800">
      <td className="py-3 pr-4 text-sm font-medium text-stone-500 dark:text-stone-400">{label}</td>
      {products.map((product) => (
        <td key={product.id} className="px-3 py-3 text-center text-sm">
          {getter(product) ?? '—'}
        </td>
      ))}
    </tr>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight">
          Comparación ({products.length}/{compareMax})
        </h1>
        <button
          onClick={clear}
          className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-600 transition-colors hover:border-red-300 hover:text-red-500 dark:border-stone-700 dark:text-stone-300"
        >
          <Trash2 className="h-4 w-4" />
          Vaciar
        </button>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-stone-200 dark:border-stone-800">
              <th className="w-40 py-4 pr-4 text-sm font-semibold text-stone-500 dark:text-stone-400">
                Producto
              </th>
              {products.map((product) => (
                <th key={product.id} className="px-3 py-4 text-center">
                  <div className="flex justify-end">
                    <button
                      onClick={() => remove(product.slug)}
                      aria-label={`Quitar ${product.name}`}
                      className="p-1 text-stone-400 transition-colors hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-stone-100 text-3xl dark:bg-stone-800">
                    🐹
                  </div>
                  <Link
                    href={`/products/${product.slug}`}
                    className="mt-2 block font-semibold hover:text-primary"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {CATEGORY_LABELS[product.category]}
                  </p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-stone-100 dark:border-stone-800">
              <td className="py-3 pr-4 text-sm font-medium text-stone-500 dark:text-stone-400">Precio</td>
              {products.map((product) => (
                <td key={product.id} className="px-3 py-3 text-center">
                  <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
                  {product.comparePrice && (
                    <span className="ml-2 text-xs text-stone-400 line-through">
                      {formatPrice(product.comparePrice)}
                    </span>
                  )}
                </td>
              ))}
            </tr>
            {nutritionRow((p) => `~${p.weightGrams}g`, 'Peso')}
            {nutritionRow((p) => p.totalSales, 'Vendidos')}
            {nutritionRow((p) => p.stockQuantity, 'Stock')}
            {nutritionRow((p) => (p.nutrition ? p.nutrition.calories : null), 'Calorías (100g)')}
            {nutritionRow((p) => (p.nutrition ? `${p.nutrition.protein}g` : null), 'Proteína')}
            {nutritionRow((p) => (p.nutrition ? `${p.nutrition.fat}g` : null), 'Grasa')}
            {nutritionRow((p) => (p.nutrition ? `${p.nutrition.carbs}g` : null), 'Carbohidratos')}
            <tr>
              <td className="py-4 pr-4 text-sm font-medium text-stone-500 dark:text-stone-400">Acción</td>
              {products.map((product) => (
                <td key={product.id} className="px-3 py-4 text-center">
                  <div className="flex justify-center">
                    <AddToCartButton product={product} variant="full" className="px-4 py-2 text-sm" />
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}