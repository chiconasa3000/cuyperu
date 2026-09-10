import type { Product } from '@/lib/types';
import { CATEGORY_LABELS } from '@/lib/types';

interface ProductJsonLdProps {
  product: Product;
}

export default function ProductJsonLd({ product }: ProductJsonLdProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const url = `${baseUrl}/products/${product.slug}`;

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.imageUrl ? [`${baseUrl}${product.imageUrl}`] : undefined,
    description: product.description ?? undefined,
    sku: product.slug,
    brand: { '@type': 'Brand', name: 'CuyPeru' },
    category: CATEGORY_LABELS[product.category],
    weight: `${product.weightGrams}g`,
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'PEN',
      price: product.price,
      availability:
        product.stockQuantity > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}