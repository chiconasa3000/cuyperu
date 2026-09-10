'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, Trash2, ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import type { PriceAlert } from '@/lib/types';
import { formatPrice } from '@/lib/format';

export default function AlertsPage() {
  const isAuthenticated = useAuthStore((s) => Boolean(s.token));
  const [alerts, setAlerts] = useState<PriceAlert[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return;
    let active = true;
    api
      .getPriceAlerts()
      .then((data) => {
        if (active) setAlerts(data);
      })
      .catch((err) => {
        if (active)
          setError(err instanceof Error ? err.message : 'Error al cargar alertas');
      });
    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  const handleDelete = async (id: string) => {
    try {
      await api.deletePriceAlert(id);
      setAlerts((prev) => (prev ?? []).filter((a) => a.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar alerta');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <Bell className="h-16 w-16 text-stone-300 dark:text-stone-700" />
        <h1 className="mt-6 text-2xl font-bold tracking-tight">Mis alertas de precio</h1>
        <p className="mt-2 text-stone-500 dark:text-stone-400">
          Inicia sesión para gestionar tus alertas.
        </p>
        <Link
          href="/login?redirect=/alerts"
          className="mt-6 rounded-full bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  if (alerts === null && !error) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <p className="text-stone-500 dark:text-stone-400">Cargando alertas...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/account"
        className="inline-flex items-center gap-1 text-sm font-medium text-stone-500 hover:text-primary dark:text-stone-400"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a mi cuenta
      </Link>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">Mis alertas de precio</h1>
      <p className="mt-2 text-stone-500 dark:text-stone-400">
        Te avisaremos cuando un producto baje a tu precio objetivo.
      </p>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      {alerts && alerts.length === 0 ? (
        <div className="mt-12 flex flex-col items-center rounded-2xl border border-dashed border-stone-300 py-20 text-center dark:border-stone-700">
          <Bell className="h-12 w-12 text-stone-300 dark:text-stone-600" />
          <h2 className="mt-4 text-xl font-semibold">Sin alertas activas</h2>
          <p className="mt-2 max-w-sm text-stone-500 dark:text-stone-400">
            Activa una alerta desde la página de cualquier producto.
          </p>
          <Link
            href="/products"
            className="mt-6 rounded-full bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Ver productos
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {alerts?.map((alert) => {
            const current = Number(alert.product.price);
            return (
              <div
                key={alert.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100 text-2xl dark:bg-stone-800">
                    🐹
                  </span>
                  <div>
                    <Link
                      href={`/products/${alert.product.slug}`}
                      className="font-semibold hover:text-primary"
                    >
                      {alert.product.name}
                    </Link>
                    <p className="text-sm text-stone-500 dark:text-stone-400">
                      Ahora <span className="font-medium">{formatPrice(current)}</span> · avisar
                      al llegar a{' '}
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatPrice(alert.targetPrice)}
                      </span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(alert.id)}
                  aria-label={`Eliminar alerta de ${alert.product.name}`}
                  className="p-2 text-stone-400 transition-colors hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}