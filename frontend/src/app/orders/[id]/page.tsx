'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Package } from 'lucide-react';
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
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

const STATUS_LABELS: Record<Order['status'], string> = {
  PENDING: 'Pendiente',
  PROCESSING: 'Procesando',
  SHIPPED: 'En camino',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
};

const PAYMENT_LABELS: Record<Order['paymentMethod'], string> = {
  VISA: 'Tarjeta Visa',
  MASTERCARD: 'Tarjeta Mastercard',
  PAYPAL: 'PayPal',
  BANK_TRANSFER: 'Transferencia bancaria',
  CASH_ON_DELIVERY: 'Pago contra entrega',
};

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const isAuthenticated = useAuthStore((s) => Boolean(s.token));
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !params.id) return;
    api
      .getOrder(params.id)
      .then(setOrder)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Error al cargar el pedido')
      );
  }, [isAuthenticated, params.id]);

  if (!isAuthenticated) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <Package className="h-16 w-16 text-stone-300 dark:text-stone-700" />
        <h1 className="mt-6 text-2xl font-bold tracking-tight">Detalle del pedido</h1>
        <p className="mt-2 text-stone-500 dark:text-stone-400">
          Inicia sesión para ver tu pedido.
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

  if (!order && !error) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <p className="text-stone-500 dark:text-stone-400">Cargando pedido...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <p className="text-red-500">{error || 'Pedido no encontrado'}</p>
        <Link
          href="/orders"
          className="mt-6 rounded-full bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          Volver a mis pedidos
        </Link>
      </div>
    );
  }

  const address = order.shippingAddress as Record<string, string | undefined>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/orders"
        className="inline-flex items-center gap-1 text-sm font-medium text-stone-500 hover:text-primary dark:text-stone-400"
      >
        <ArrowLeft className="h-4 w-4" /> Mis pedidos
      </Link>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight">
          Pedido N.º {order.id.slice(0, 8).toUpperCase()}
        </h1>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
          {STATUS_LABELS[order.status]}
        </span>
      </div>
      <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
        Realizado el {formatDate(order.createdAt)}
      </p>

      <div className="mt-8 space-y-6">
        <div className="rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900">
          <h2 className="text-lg font-bold">Artículos</h2>
          <div className="mt-4 divide-y divide-stone-100 dark:divide-stone-800">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-3 text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100 text-xl dark:bg-stone-800">
                    🐹
                  </span>
                  <div>
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="font-semibold hover:text-primary"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-stone-500 dark:text-stone-400">
                      {item.quantity} × {formatPrice(Number(item.priceAtPurchase))}
                    </p>
                  </div>
                </div>
                <span className="font-bold">
                  {formatPrice(Number(item.priceAtPurchase) * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t border-stone-200 pt-4 text-sm dark:border-stone-800">
            <div className="flex justify-between text-stone-500 dark:text-stone-400">
              <span>Subtotal</span>
              <span>{formatPrice(Number(order.totalAmount))}</span>
            </div>
            <div className="flex justify-between text-stone-500 dark:text-stone-400">
              <span>Envío</span>
              <span>Según destino</span>
            </div>
            <div className="flex justify-between border-t border-stone-200 pt-3 text-base font-bold dark:border-stone-800">
              <span>Total</span>
              <span>{formatPrice(Number(order.totalAmount))}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900">
            <h2 className="text-lg font-bold">Entrega</h2>
            <div className="mt-3 space-y-1 text-sm text-stone-600 dark:text-stone-300">
              <p className="font-medium">{address.fullName}</p>
              <p>{address.address}</p>
              <p>
                {address.district ? `${address.district}, ` : ''}
                {address.city}
              </p>
              <p>{address.phone}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900">
            <h2 className="text-lg font-bold">Pago</h2>
            <div className="mt-3 space-y-1 text-sm text-stone-600 dark:text-stone-300">
              <p className="font-medium">{PAYMENT_LABELS[order.paymentMethod]}</p>
              {order.notes && <p className="text-stone-500">Notas: {order.notes}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}