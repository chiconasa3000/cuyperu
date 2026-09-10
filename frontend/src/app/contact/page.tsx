import type { Metadata } from 'next';
import { Phone, Mail, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contacto',
  description:
    'Contáctanos por teléfono o WhatsApp para hacer pedidos o resolver tus dudas.',
};

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '51999999999';

export default function ContactPage() {
  const message = encodeURIComponent(
    'Hola, me gustaría hacer un pedido de cuy.'
  );
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Contacto</h1>
        <p className="mt-3 text-stone-500 dark:text-stone-400">
          Estamos para ayudarte. Escríbenos por WhatsApp y te atendemos al
          instante.
        </p>
      </div>

      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-2xl border border-stone-200 bg-white p-6 text-center transition-shadow hover:shadow-lg dark:border-stone-800 dark:bg-stone-900"
        >
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366]/15">
            <Phone className="h-6 w-6 text-[#25D366]" />
          </span>
          <h2 className="mt-4 font-semibold">WhatsApp</h2>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            Respuesta inmediata
          </p>
          <p className="mt-2 font-medium">+51 999 999 999</p>
        </a>

        <div className="rounded-2xl border border-stone-200 bg-white p-6 text-center dark:border-stone-800 dark:bg-stone-900">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/15">
            <Mail className="h-6 w-6 text-primary" />
          </span>
          <h2 className="mt-4 font-semibold">Email</h2>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            Para consultas generales
          </p>
          <p className="mt-2 font-medium">ventas@cuyperu.com</p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6 text-center dark:border-stone-800 dark:bg-stone-900">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/15">
            <MapPin className="h-6 w-6 text-accent" />
          </span>
          <h2 className="mt-4 font-semibold">Visítanos</h2>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            Mercado Los Andes, Puesto 42
          </p>
          <p className="mt-2 font-medium">Arequipa, Perú</p>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-2xl rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 p-8 text-center sm:p-12">
        <h2 className="text-2xl font-bold tracking-tight">
          ¿Listo para pedir tu cuy?
        </h2>
        <p className="mt-2 text-stone-600 dark:text-stone-300">
          Contáctanos por WhatsApp y recibe tu pedido fresco en la puerta de tu
          casa.
        </p>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-8 py-3 font-semibold text-white transition-transform hover:scale-105"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Contactar por WhatsApp
        </a>
      </div>
    </div>
  );
}