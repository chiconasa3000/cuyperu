import Link from 'next/link';
import {
  HeartPulse,
  Beef,
  Scale,
  Flame,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import type { Product } from '@/lib/types';
import { api } from '@/lib/api';
import ProductCard from '@/components/product/ProductCard';

export const revalidate = 300;

const HEALTH_BENEFITS = [
  {
    icon: HeartPulse,
    title: 'Bajo en colesterol',
    description: 'Contiene menos colesterol que otras carnes rojas.',
  },
  {
    icon: Beef,
    title: 'Alto en proteína',
    description: 'Más de 20g de proteína por porción de 100g.',
  },
  {
    icon: Scale,
    title: 'Bajo en grasa',
    description: 'Ideal para dietas balanceadas y saludables.',
  },
  {
    icon: Flame,
    title: 'Fuente de hierro',
    description: 'Excelente aporte de hierro y minerales esenciales.',
  },
];

const FEATURES = [
  {
    icon: Truck,
    title: 'Entrega rápida',
    description: 'Recibe tu pedido fresco y a tiempo.',
  },
  {
    icon: ShieldCheck,
    title: 'Calidad garantizada',
    description: 'Cuy criado en condiciones óptimas.',
  },
];

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const data = await api.getProducts({ limit: 6 });
    return Array.isArray(data) ? data : data.items;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

export default async function Home() {
  const products = await getFeaturedProducts();

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-transparent to-accent/10">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div className="flex flex-col justify-center">
            <span className="mb-4 inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              🐹 Criado con amor en Perú
            </span>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Carne de Cuy Premium,
              <span className="text-primary"> entregada fresca a tu puerta</span>
            </h1>
            <p className="mt-4 max-w-lg text-lg leading-8 text-stone-600 dark:text-stone-300">
              Descubre la tradición culinaria peruana con nuestro cuy seleccionado
              a mano: comercial, mediano, grande, deshuesado y gourmet.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="rounded-full bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                Ver productos
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-stone-300 px-6 py-3 font-semibold text-stone-700 transition-colors hover:border-primary hover:text-primary dark:border-stone-700 dark:text-stone-200"
              >
                Hacer pedido
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="flex h-72 w-72 items-center justify-center rounded-full bg-gradient-to-br from-accent/20 to-primary/20 text-[8rem]">
              🐹
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HEALTH_BENEFITS.map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900"
            >
              <benefit.icon className="h-8 w-8 text-primary" />
              <h3 className="mt-3 font-semibold">{benefit.title}</h3>
              <p className="mt-1 text-sm leading-6 text-stone-500 dark:text-stone-400">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Nuestros productos
            </h2>
            <p className="mt-2 text-stone-500 dark:text-stone-400">
              Selección fresca de la granja a tu mesa.
            </p>
          </div>
          <Link
            href="/products"
            className="font-semibold text-primary hover:underline"
          >
            Ver todos →
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-stone-300 p-12 text-center text-stone-500 dark:border-stone-700">
            No se pudieron cargar los productos. Asegúrate de que el backend esté
            corriendo en el puerto 5000.
          </div>
        )}
      </section>

      <section className="bg-stone-900 py-14 text-white dark:bg-stone-950">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-2">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/20">
                <feature.icon className="h-6 w-6 text-primary" />
              </span>
              <div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="mt-1 text-stone-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}