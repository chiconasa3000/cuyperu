'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import type { Order } from '@/lib/types';

function formatPrice(value: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(value);
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

const STATUS_LABELS: Record<Order['status'], string> = {
  PENDING: 'Pendiente',
  PROCESSING: 'Procesando',
  SHIPPED: 'En camino',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
};

const STATUS_COLORS: Record<Order['status'], string> = {
  PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  PROCESSING: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  SHIPPED: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  DELIVERED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function OrdersPage() {
  const isAuthenticated = useAuthStore((s) => Boolean(s.token));
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return;
    api
      .getOrders()
      .then(setOrders)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Error al cargar pedidos')
      );
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <Package className="h-16 w-16 text-stone-300 dark:text-stone-700" />
        <h1 className="mt-6 text-2xl font-bold tracking-tight">Mis pedidos</h1>
        <p className="mt-2 text-stone-500 dark:text-stone-400">
          Inicia sesión para ver tus pedidos.
        </p>
        <Link
          href="/login?redirect=/orders"
          className="mt-6 rounded-full bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  if (orders === null || error) {
    if (error) {
      return (
        <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center sm:px-6">
          <p className="text-red-500">{error}</p>
        </div>
      );
    }
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <p className="text-stone-500 dark:text-stone-400">Cargando pedidos...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <Package className="h-16 w-16 text-stone-300 dark:text-stone-700" />
        <h1 className="mt-6 text-2xl font-bold tracking-tight">Mis pedidos</h1>
        <p className="mt-2 text-stone-500 dark:text-stone-400">
          Aún no tienes pedidos. ¡Anímate a probar nuestro cuy!
        </p>
        <Link
          href="/products"
          className="mt-6 rounded-full bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Link
        href="/account"
        className="inline-flex items-center gap-1 text-sm font-medium text-stone-500 hover:text-primary dark:text-stone-400"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a mi cuenta
      </Link>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">Mis pedidos</h1>

      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="block rounded-2xl border border-stone-200 bg-white p-5 transition-shadow hover:shadow-md dark:border-stone-800 dark:bg-stone-900"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-bold">
                    N.º {order.id.slice(0, 8).toUpperCase()}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[order.status]}`}
                  >
                    {STATUS_LABELS[order.status]}
                  </span>
                </div>
                <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                  {formatDate(order.createdAt)} · {order.items.length} artículo
                  {order.items.length !== 1 ? 's' : ''}
                </p>
              </div>
              <span className="text-lg font-bold">
                {formatPrice(Number(order.totalAmount))}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {order.items.map((item) => (
                <span
                  key={item.id}
                  className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600 dark:bg-stone-800 dark:text-stone-300"
                >
                  {item.quantity} × {item.product.name}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}