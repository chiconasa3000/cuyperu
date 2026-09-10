import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  Share2,
  Eye,
  Package,
} from 'lucide-react';
import type { Product } from '@/lib/types';
import { CATEGORY_LABELS, CATEGORY_DESCRIPTIONS } from '@/lib/types';
import { api } from '@/lib/api';
import AddToCartButton from '@/components/product/AddToCartButton';
import CompareButton from '@/components/product/CompareButton';
import WishlistButton from '@/components/product/WishlistButton';
import PriceAlertButton from '@/components/product/PriceAlertButton';
import ProductCard from '@/components/product/ProductCard';
import ProductTabs from '@/components/product/ProductTabs';
import ProductJsonLd from '@/components/ProductJsonLd';

async function getProduct(slug: string): Promise<Product | null> {
  try {
    return await api.getProduct(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata(
  props: PageProps<"/products/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description:
      product.description ??
      `Compra ${product.name} (${CATEGORY_LABELS[product.category]}) - ~${product.weightGrams}g, precio S/. ${product.price}. Cuy frisco entregado a tu puerta.`,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.name,
      description:
        product.description ??
        `${CATEGORY_LABELS[product.category]} ~${product.weightGrams}g.`,
      url: `/products/${product.slug}`,
      type: 'website',
      images: product.imageUrl ? [{ url: product.imageUrl }] : undefined,
    },
  };
}

async function getRelatedProducts(slug: string): Promise<Product[]> {
  try {
    const data = await api.getRelatedProducts(slug);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function formatPrice(value: string): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(Number(value));
}

export default async function ProductDetailPage(
  props: PageProps<"/products/[slug]">
) {
  const { slug } = await props.params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(slug);

  const discount =
    product.comparePrice && Number(product.price) < Number(product.comparePrice)
      ? Math.round(
          (1 - Number(product.price) / Number(product.comparePrice)) * 100
        )
      : 0;

  const shareUrl = typeof window === 'undefined'
    ? `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/products/${product.slug}`
    : window.location.href;
  const shareText = encodeURIComponent(`Prueba ${product.name} de CuyPeru!`);
  const whatsappShare = `https://wa.me/?text=${shareText}%20${encodeURIComponent(shareUrl)}`;
  const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const twitterShare = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`;

  const deliveryTimes = [
    { zone: 'Lima Metropolitana', time: '24 - 48 horas' },
    { zone: 'Provincias (Costa)', time: '48 - 72 horas' },
    { zone: 'Provincias (Sierra/Selva)', time: '3 - 5 días' },
  ];

  const paymentMethods = ['Visa', 'Mastercard', 'PayPal', 'Transferencia bancaria', 'Pago contra entrega'];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <ProductJsonLd product={product} />
      <nav className="mb-6 text-sm text-stone-500 dark:text-stone-400">
        <Link href="/" className="hover:text-primary">Inicio</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-primary">Productos</Link>
        <span className="mx-2">/</span>
        <span className="text-stone-700 dark:text-stone-200">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-3xl bg-stone-100 dark:bg-stone-800">
          <div className="flex h-full items-center justify-center text-[10rem]">🐹</div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {CATEGORY_LABELS[product.category]}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-2 text-stone-500 dark:text-stone-400">
            {CATEGORY_DESCRIPTIONS[product.category]}
          </p>

          <div className="mt-4 flex items-center gap-4 text-sm text-stone-500 dark:text-stone-400">
            <span className="inline-flex items-center gap-1">
              <Package className="h-4 w-4" />
              {product.totalSales} unidades vendidas
            </span>
            <span className="inline-flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span className="font-medium text-emerald-600 dark:text-emerald-400">12</span>
              viendo ahora
            </span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-4xl font-extrabold tracking-tight text-primary">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && (
              <>
                <span className="text-lg text-stone-400 line-through">
                  {formatPrice(product.comparePrice)}
                </span>
                <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-600 dark:bg-red-900/30 dark:text-red-400">
                  Ahorra {discount}%
                </span>
              </>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <AddToCartButton product={product} variant="full" />
            <CompareButton product={product} variant="text" />
            <WishlistButton product={product} variant="text" />
          </div>

          <PriceAlertButton product={product} />

          <div className="mt-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
              Métodos de pago
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {paymentMethods.map((method) => (
                <span
                  key={method}
                  className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-300"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
              Tiempo estimado de entrega
            </h3>
            <div className="mt-2 space-y-1.5">
              {deliveryTimes.map((delivery) => (
                <div
                  key={delivery.zone}
                  className="flex items-center justify-between border-b border-dashed border-stone-200 pb-1.5 text-sm last:border-0 dark:border-stone-800"
                >
                  <span className="text-stone-600 dark:text-stone-300">{delivery.zone}</span>
                  <span className="font-medium">{delivery.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <span className="text-sm font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
              Compartir:
            </span>
            <div className="flex gap-2">
              <a
                href={facebookShare}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Compartir en Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-stone-600 transition-colors hover:bg-blue-600 hover:text-white dark:bg-stone-800 dark:text-stone-300"
              >
                <Share2 className="h-4 w-4" />
              </a>
              <a
                href={whatsappShare}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Compartir en WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-stone-600 transition-colors hover:bg-[#25D366] hover:text-white dark:bg-stone-800 dark:text-stone-300"
              >
                <Share2 className="h-4 w-4" />
              </a>
              <a
                href={twitterShare}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Compartir en Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-stone-600 transition-colors hover:bg-sky-500 hover:text-white dark:bg-stone-800 dark:text-stone-300"
              >
                <Share2 className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 rounded-3xl border border-stone-200 dark:border-stone-800">
        <ProductTabs
          tabs={[
            {
              id: 'description',
              label: 'Descripción',
              content: product.description ? (
                <p className="max-w-3xl leading-7 text-stone-600 dark:text-stone-300">
                  {product.description}
                </p>
              ) : (
                <p className="text-stone-400">Descripción próximamente.</p>
              ),
            },
            {
              id: 'nutrition',
              label: 'Información nutricional',
              content: product.nutrition ? (
                <table className="w-full max-w-lg text-left text-sm">
                  <thead>
                    <tr className="border-b border-stone-200 dark:border-stone-800">
                      <th className="pb-2">Nutriente</th>
                      <th className="pb-2 text-right">Por 100g</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                    <tr>
                      <td className="py-2">Calorías</td>
                      <td className="py-2 text-right font-medium">
                        {product.nutrition.calories} kcal
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2">Proteína</td>
                      <td className="py-2 text-right font-medium">
                        {product.nutrition.protein} g
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2">Grasa</td>
                      <td className="py-2 text-right font-medium">
                        {product.nutrition.fat} g
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2">Carbohidratos</td>
                      <td className="py-2 text-right font-medium">
                        {product.nutrition.carbs} g
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2">Fibras</td>
                      <td className="py-2 text-right font-medium">
                        {product.nutrition.fiber} g
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2">Vitaminas</td>
                      <td className="py-2 text-right font-medium">
                        {product.nutrition.vitamins.join(', ')}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2">Minerales</td>
                      <td className="py-2 text-right font-medium capitalize">
                        {product.nutrition.minerals.join(', ')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <p className="text-stone-400">Información nutricional próximamente.</p>
              ),
            },
          ]}
        />
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight">Productos relacionados</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}