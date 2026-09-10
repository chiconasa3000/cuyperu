import Link from 'next/link';
import type { Product } from '@/lib/types';
import { CATEGORY_LABELS } from '@/lib/types';
import AddToCartButton from './AddToCartButton';
import WishlistButton from './WishlistButton';
import CompareButton from './CompareButton';

function formatPrice(value: string): string {
  const number = Number(value);
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(number);
}

export default function ProductCard({ product }: { product: Product }) {
  const discount =
    product.comparePrice && Number(product.price) < Number(product.comparePrice)
      ? Math.round(
          (1 - Number(product.price) / Number(product.comparePrice)) * 100
        )
      : 0;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-white transition-shadow hover:shadow-lg dark:border-stone-800 dark:bg-stone-900">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-stone-800">
          <div className="absolute inset-0 flex items-center justify-center text-5xl">
            🐹
          </div>
          {discount > 0 && (
            <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white">
              -{discount}%
            </span>
          )}
        </div>
      </Link>

      <WishlistButton product={product} />

      <div className="p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">
          {CATEGORY_LABELS[product.category]}
        </p>
        <Link href={`/products/${product.slug}`} className="mt-1 block">
          <h3 className="font-semibold text-stone-900 transition-colors group-hover:text-primary dark:text-stone-100">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          ~{product.weightGrams}g · {product.totalSales} vendidos
        </p>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-stone-900 dark:text-stone-100">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && (
              <span className="text-sm text-stone-400 line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <CompareButton product={product} />
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}