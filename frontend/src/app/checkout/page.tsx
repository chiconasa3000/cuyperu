'use client';

import { useState, FormEvent, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api, ApiError } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { useCartStore, selectCartTotal, selectCartCount } from '@/store/cart';
import type { Order } from '@/lib/types';

function formatPrice(value: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(value);
}

const PAYMENT_METHODS = [
  { id: 'VISA', label: 'Tarjeta Visa' },
  { id: 'MASTERCARD', label: 'Tarjeta Mastercard' },
  { id: 'PAYPAL', label: 'PayPal' },
  { id: 'BANK_TRANSFER', label: 'Transferencia bancaria' },
  { id: 'CASH_ON_DELIVERY', label: 'Pago contra entrega' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => Boolean(s.token));
  const items = useCartStore((s) => s.items);
  const total = useCartStore(selectCartTotal);
  const count = useCartStore(selectCartCount);
  const clear = useCartStore((s) => s.clear);

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('CASH_ON_DELIVERY');
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: 'Lima',
    district: '',
    notes: '',
  });

  useEffect(() => {
    if (!isAuthenticated && items.length > 0) {
      router.replace(`/login?redirect=/checkout`);
    }
  }, [isAuthenticated, items.length, router]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      if (!isAuthenticated) return;
      setError('');
      setLoading(true);

      try {
        const created = await api.checkout({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          paymentMethod: paymentMethod as Order['paymentMethod'],
          shippingAddress: {
            fullName: formData.fullName,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            district: formData.district,
          },
          notes: formData.notes || undefined,
        });
        setOrder(created);
        clear();
      } catch (err) {
        setError(
          err instanceof ApiError ? err.message : 'Error al procesar el pedido'
        );
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, items, paymentMethod, formData, clear]
  );

  if (order) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center sm:px-6">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl dark:bg-emerald-900/30">
          ✅
        </span>
        <h1 className="mt-6 text-3xl font-bold tracking-tight">
          ¡Pedido confirmado!
        </h1>
        <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
          Pedido n.º {order.id.slice(0, 8).toUpperCase()} ·{' '}
          {formatPrice(Number(order.totalAmount))}
        </p>
        <p className="mt-3 text-stone-500 dark:text-stone-400">
          Gracias por tu compra. Te contactaremos por WhatsApp para coordinar el
          envío.
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            href="/orders"
            className="rounded-full bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Ver mis pedidos
          </Link>
          <Link
            href="/products"
            className="rounded-full border border-stone-300 px-6 py-3 font-semibold text-stone-600 transition-colors hover:border-primary hover:text-primary dark:border-stone-700 dark:text-stone-300"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight">No hay productos</h1>
        <p className="mt-3 text-stone-500 dark:text-stone-400">
          Agrega productos a tu carrito antes de continuar con el pago.
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
      <h1 className="text-3xl font-bold tracking-tight">Finalizar compra</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-8 flex items-center gap-2 text-sm font-medium">
            <button
              onClick={() => setStep(1)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 ${
                step >= 1
                  ? 'bg-primary text-white'
                  : 'bg-stone-100 text-stone-500 dark:bg-stone-800'
              }`}
            >
              1. Envío
            </button>
            <div className="h-px w-8 bg-stone-300 dark:bg-stone-700" />
            <button
              onClick={() => setStep(2)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 ${
                step >= 2
                  ? 'bg-primary text-white'
                  : 'bg-stone-100 text-stone-500 dark:bg-stone-800'
              }`}
            >
              2. Pago
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {step === 1 && (
              <div className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900">
                <h2 className="text-lg font-bold">Datos de envío</h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium">
                      Nombre completo *
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-lg border border-stone-300 px-4 py-2.5 outline-none focus:border-primary dark:border-stone-700 dark:bg-stone-800"
                      placeholder="Juan Pérez"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium">
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-lg border border-stone-300 px-4 py-2.5 outline-none focus:border-primary dark:border-stone-700 dark:bg-stone-800"
                      placeholder="+51 999 999 999"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium">
                    Dirección *
                  </label>
                  <input
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-stone-300 px-4 py-2.5 outline-none focus:border-primary dark:border-stone-700 dark:bg-stone-800"
                    placeholder="Av. Los Pinos 123, Dpto 402"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium">
                      Ciudad *
                    </label>
                    <select
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-lg border border-stone-300 px-4 py-2.5 outline-none focus:border-primary dark:border-stone-700 dark:bg-stone-800"
                    >
                      <option value="Lima">Lima</option>
                      <option value="Arequipa">Arequipa</option>
                      <option value="Cusco">Cusco</option>
                      <option value="Trujillo">Trujillo</option>
                      <option value="Huancayo">Huancayo</option>
                      <option value="Iquitos">Iquitos</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="district" className="block text-sm font-medium">
                      Distrito
                    </label>
                    <input
                      id="district"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-lg border border-stone-300 px-4 py-2.5 outline-none focus:border-primary dark:border-stone-700 dark:bg-stone-800"
                      placeholder="Miraflores"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium">
                    Notas del pedido
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-stone-300 px-4 py-2.5 outline-none focus:border-primary dark:border-stone-700 dark:bg-stone-800"
                    placeholder="Ej: preferencia de corte, horario de entrega..."
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full rounded-full bg-primary py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
                >
                  Continuar al pago
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900">
                <h2 className="text-lg font-bold">Método de pago</h2>

                <div className="space-y-2">
                  {PAYMENT_METHODS.map((method) => (
                    <label
                      key={method.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${
                        paymentMethod === method.id
                          ? 'border-primary bg-primary/5'
                          : 'border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)}
                        className="h-4 w-4 accent-primary"
                      />
                      <span className="font-medium">{method.label}</span>
                    </label>
                  ))}
                </div>

                {paymentMethod === 'BANK_TRANSFER' && (
                  <div className="rounded-xl bg-stone-50 p-4 text-sm dark:bg-stone-800">
                    <p className="font-semibold">Datos de transferencia:</p>
                    <p className="mt-1 text-stone-500 dark:text-stone-400">
                      BCP 123-4567890-12 · CuyPeru S.A.C
                      <br />
                      Envía el voucher por WhatsApp para confirmar tu pedido.
                    </p>
                  </div>
                )}

                {error && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
                    {error}
                  </div>
                )}

                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="rounded-full border border-stone-300 px-6 py-3 font-semibold text-stone-600 transition-colors hover:border-primary hover:text-primary dark:border-stone-700 dark:text-stone-300"
                  >
                    ← Volver
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 rounded-full bg-primary py-3 font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
                  >
                    {loading ? 'Procesando...' : `Confirmar pedido · ${formatPrice(total)}`}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="h-fit rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900">
          <h2 className="text-lg font-bold">Resumen ({count} artículos)</h2>
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div key={item.productId} className="flex items-center justify-between text-sm">
                <span className="text-stone-600 dark:text-stone-300">
                  {item.quantity} × {item.name}
                </span>
                <span className="font-medium">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t border-stone-200 pt-4 text-sm dark:border-stone-800">
            <div className="flex justify-between text-stone-500 dark:text-stone-400">
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-stone-500 dark:text-stone-400">
              <span>Envío</span>
              <span>Según destino</span>
            </div>
            <div className="flex justify-between border-t border-stone-200 pt-3 text-base font-bold dark:border-stone-800">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}