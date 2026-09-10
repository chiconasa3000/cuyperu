'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { Bell, BellRing } from 'lucide-react';
import type { Product } from '@/lib/types';
import { api, ApiError } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { formatPrice } from '@/lib/format';

interface PriceAlertButtonProps {
  product: Product;
}

export default function PriceAlertButton({ product }: PriceAlertButtonProps) {
  const isAuthenticated = useAuthStore((s) => Boolean(s.token));
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const currentPrice = Number(product.price);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus('idle');
    const value = Number(target);
    if (!value || value <= 0) {
      setStatus('error');
      setMessage('Ingresa un precio válido');
      return;
    }
    if (value >= currentPrice) {
      setStatus('error');
      setMessage(`El precio objetivo debe ser menor a ${formatPrice(currentPrice)}`);
      return;
    }

    try {
      await api.createPriceAlert(product.id, value);
      setStatus('success');
      setMessage(
        `Alerta activada: te avisaremos cuando baje a ${formatPrice(value)}`
      );
      setTarget('');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof ApiError ? err.message : 'Error al crear la alerta');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="mt-4 rounded-2xl border border-stone-200 bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-900">
        <p className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
          <Bell className="h-3.5 w-3.5" /> ¿Buscas precio más bajo?
        </p>
        <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
          Inicia sesión y recibe alertas cuando baje el precio.
        </p>
        <Link
          href={`/login?redirect=/products/${product.slug}`}
          className="mt-3 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          Activar alerta
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-2xl border border-stone-200 bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-900">
      {!open ? (
        <>
          <p className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
            <Bell className="h-3.5 w-3.5" /> ¿Buscas precio más bajo?
          </p>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
            Suscríbete para recibir alertas cuando baje el precio.
          </p>
          <button
            onClick={() => setOpen(true)}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            <Bell className="h-4 w-4" />
            Activar alerta
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <p className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
            <BellRing className="h-3.5 w-3.5" /> Alerta de precio
          </p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-stone-400">
                S/
              </span>
              <input
                type="number"
                min="0.01"
                max={currentPrice - 0.01}
                step="0.01"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder={`< ${formatPrice(currentPrice)}`}
                className="w-full rounded-lg border border-stone-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-primary dark:border-stone-700 dark:bg-stone-800"
              />
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-stone-300 px-3 text-sm text-stone-500 hover:text-primary dark:border-stone-700"
            >
              Cancelar
            </button>
          </div>
          {status === 'success' && (
            <p className="text-sm text-emerald-600 dark:text-emerald-400">{message}</p>
          )}
          {status === 'error' && (
            <p className="text-sm text-red-500">{message}</p>
          )}
          <button
            type="submit"
            className="w-full rounded-full bg-primary py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Crear alerta
          </button>
        </form>
      )}
    </div>
  );
}