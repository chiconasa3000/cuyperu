'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { api } from '@/lib/api';
import { useCartStore, selectCartCount, selectCartTotal } from '@/store/cart';

function formatPrice(value: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(value);
}

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const setItems = useCartStore((s) => s.setItems);
  const count = useCartStore(selectCartCount);
  const total = useCartStore(selectCartTotal);

  useEffect(() => {
    api
      .getCart()
      .then((serverItems) => {
        if (serverItems.length > 0) {
          setItems(
            serverItems.map((item) => ({
              productId: item.productId,
              slug: item.product.slug,
              name: item.product.name,
              price: Number(item.product.price),
              imageUrl: item.product.imageUrl,
              quantity: item.quantity,
            }))
          );
        }
      })
      .catch(() => {});
  }, [setItems]);

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 sm:px-6">
        <ShoppingBag className="h-16 w-16 text-stone-300 dark:text-stone-700" />
        <h1 className="mt-6 text-2xl font-bold tracking-tight">
          Tu carrito está vacío
        </h1>
        <p className="mt-2 text-stone-500 dark:text-stone-400">
          Explora nuestros productos y agrega tu cuy favorito.
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
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">
        Carrito ({count} artículos)
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 rounded-2xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900"
            >
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-4xl dark:bg-stone-800">
                🐹
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-semibold hover:text-primary"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-stone-500 dark:text-stone-400">
                      {formatPrice(item.price)} c/u
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    aria-label={`Eliminar ${item.name}`}
                    className="p-1 text-stone-400 transition-colors hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-2 rounded-full border border-stone-200 dark:border-stone-700">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      aria-label="Disminuir cantidad"
                      className="p-2 text-stone-500 hover:text-primary"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      aria-label="Aumentar cantidad"
                      className="p-2 text-stone-500 hover:text-primary"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="font-bold">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900">
          <h2 className="text-lg font-bold">Resumen</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-stone-500 dark:text-stone-400">
              <span>Subtotal ({count} artículos)</span>
              <span className="font-medium text-stone-800 dark:text-stone-200">
                {formatPrice(total)}
              </span>
            </div>
            <div className="flex justify-between text-stone-500 dark:text-stone-400">
              <span>Envío</span>
              <span className="font-medium">Calculado al pagar</span>
            </div>
            <div className="flex justify-between border-t border-stone-200 pt-3 text-base font-bold dark:border-stone-800">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="mt-6 block rounded-full bg-primary py-3 text-center font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Proceder al pago
          </Link>
          <Link
            href="/products"
            className="mt-3 block text-center text-sm font-medium text-stone-500 hover:text-primary dark:text-stone-400"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}