import type { Metadata } from 'next';
import { Leaf, HeartHandshake, Award, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Nosotros',
  description:
    'Conoce la historia de CuyPeru, nuestra misión y nuestro compromiso con la calidad.',
};

const VALUES = [
  {
    icon: Leaf,
    title: 'Sostenibilidad',
    description:
      'Criamos en granjas familiares que respetan el bienestar animal y el medio ambiente.',
  },
  {
    icon: HeartHandshake,
    title: 'Salud',
    description:
      'Promovemos una alimentación saludable con la carne de cuy, rica en proteínas y baja en grasa.',
  },
  {
    icon: Award,
    title: 'Calidad',
    description:
      'Seleccionamos cada ejemplar a mano para garantizar la frescura y el sabor excepcional.',
  },
  {
    icon: Users,
    title: 'Comunidad',
    description:
      'Apoyamos a pequeños criadores locales, fomentando la economía de las comunidades andinas.',
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-primary/10 via-transparent to-accent/10 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <span className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            Nuestra historia
          </span>
          <h1 className="mx-auto max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            De la sierra peruana a tu mesa
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-stone-600 dark:text-stone-300">
            CuyPeru nació del amor por la tradición culinaria andina. Desde hace
            más de 15 años, llevamos el mejor cuy peruano a hogares de todo el
            país, combinando técnicas ancestrales de crianza con los más altos
            estándares de calidad e higiene.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
          Nuestros valores
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value) => (
            <div
              key={value.title}
              className="rounded-2xl border border-stone-200 bg-white p-6 text-center dark:border-stone-800 dark:bg-stone-900"
            >
              <value.icon className="mx-auto h-8 w-8 text-primary" />
              <h3 className="mt-3 font-semibold">{value.title}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-500 dark:text-stone-400">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="rounded-3xl bg-stone-900 p-10 text-center text-white sm:p-16 dark:bg-stone-950">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Nuestra misión
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-stone-300">
            Posicionar al cuy como una de las carnes más saludables del Perú,
            ofreciendo un producto fresco, confiable y accesible, mientras
            impulsamos la economía de los pequeños productores andinos.
          </p>
        </div>
      </section>
    </div>
  );
}