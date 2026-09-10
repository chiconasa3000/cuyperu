import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Category, CATEGORY_LABELS, CATEGORY_DESCRIPTIONS } from '@/lib/types';
import { api } from '@/lib/api';
import ProductCard from '@/components/product/ProductCard';

const CATEGORIES: Category[] = ['COMMERCIAL', 'MEDIUM', 'LARGE', 'BONELESS', 'GOURMET'];

async function getProducts(category?: string, search?: string): Promise<Product[]> {
  try {
    const data = await api.getProducts({
      ...(category && (Object.keys(CATEGORY_LABELS) as string[]).includes(category)
        ? { category: category as Category }
        : {}),
      ...(search ? { search } : {}),
    });
    return Array.isArray(data) ? data : data.items;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

export default async function ProductsPage(
  props: PageProps<"/products">
) {
  const searchParams = await props.searchParams;
  const rawCategory = searchParams.category;
  const activeCategory = Array.isArray(rawCategory) ? rawCategory[0] : rawCategory;
  const rawSearch = searchParams.search;
  const searchQuery = Array.isArray(rawSearch) ? rawSearch[0] : rawSearch;

  const products = await getProducts(activeCategory, searchQuery);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {searchQuery
            ? `Resultados para “${searchQuery}”`
            : activeCategory
              ? CATEGORY_LABELS[activeCategory as Category]
              : 'Todos los productos'}
        </h1>
        <p className="mt-2 text-stone-500 dark:text-stone-400">
          Carne de cuy peruano de la más alta calidad.
        </p>
        {searchQuery && (
          <Link
            href="/products"
            className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
          >
            Limpiar búsqueda
          </Link>
        )}
      </div>

      <div className="mb-10 flex flex-wrap gap-2">
        <Link
          href="/products"
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            !activeCategory
              ? 'bg-primary text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300'
          }`}
        >
          Todos
        </Link>
        {CATEGORIES.map((category) => (
          <Link
            key={category}
            href={`/products?category=${category}`}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === category
                ? 'bg-primary text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300'
            }`}
          >
            {CATEGORY_LABELS[category]}
          </Link>
        ))}
      </div>

      {activeCategory && (
        <p className="-mt-4 mb-8 text-sm text-stone-500 dark:text-stone-400">
          {CATEGORY_DESCRIPTIONS[activeCategory as Category]}
        </p>
      )}

      {products.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-stone-300 p-12 text-center text-stone-500 dark:border-stone-700">
          {searchQuery
            ? `No se encontraron productos para “${searchQuery}”.`
            : 'No se encontraron productos en esta categoría.'}
        </div>
      )}
    </div>
  );
}