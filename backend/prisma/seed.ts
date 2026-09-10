import { PrismaClient, Category } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const products = [
  {
    name: 'Cuy Comercial',
    slug: 'cuy-comercial',
    category: Category.COMMERCIAL,
    weightGrams: 300,
    price: 45.0,
    comparePrice: 55.0,
    description:
      'Cuy comercial de alta calidad, perfecto para preparaciones familiares. Rendimiento promedio de 300 gramos por unidad.',
    nutrition: {
      calories: 143,
      protein: 20.6,
      fat: 6.4,
      carbs: 0,
      fiber: 0,
      vitamins: ['B1', 'B3', 'A', 'C', 'D'],
      minerals: ['hierro', 'calcio', 'fósforo'],
    },
    stockQuantity: 120,
    totalSales: 480,
  },
  {
    name: 'Cuy Mediano',
    slug: 'cuy-mediano',
    category: Category.MEDIUM,
    weightGrams: 400,
    price: 55.0,
    comparePrice: 68.0,
    description:
      'Cuy mediano de excelente calidad, ideal para asados y guisos. Peso promedio de 400 gramos.',
    nutrition: {
      calories: 143,
      protein: 20.6,
      fat: 6.4,
      carbs: 0,
      fiber: 0,
      vitamins: ['B1', 'B3', 'A', 'C', 'D'],
      minerals: ['hierro', 'calcio', 'fósforo'],
    },
    stockQuantity: 95,
    totalSales: 320,
  },
  {
    name: 'Cuy Grande',
    slug: 'cuy-grande',
    category: Category.LARGE,
    weightGrams: 500,
    price: 65.0,
    comparePrice: 78.0,
    description:
      'Cuy grande de primera calidad, perfecto para celebraciones y reuniones familiares. Peso promedio de 500 gramos.',
    nutrition: {
      calories: 143,
      protein: 20.6,
      fat: 6.4,
      carbs: 0,
      fiber: 0,
      vitamins: ['B1', 'B3', 'A', 'C', 'D'],
      minerals: ['hierro', 'calcio', 'fósforo'],
    },
    stockQuantity: 60,
    totalSales: 210,
  },
  {
    name: 'Cuy Deshuesado',
    slug: 'cuy-deshuesado',
    category: Category.BONELESS,
    weightGrams: 300,
    price: 75.0,
    comparePrice: 90.0,
    description:
      'Cuy deshuesado y seleccionado a mano, libre de espinas. La opción más cómoda y versátil para la cocina.',
    nutrition: {
      calories: 143,
      protein: 20.6,
      fat: 6.4,
      carbs: 0,
      fiber: 0,
      vitamins: ['B1', 'B3', 'A', 'C', 'D'],
      minerals: ['hierro', 'calcio', 'fósforo'],
    },
    stockQuantity: 40,
    totalSales: 150,
  },
  {
    name: 'Cuy Gourmet Premium',
    slug: 'cuy-gourmet-premium',
    category: Category.GOURMET,
    weightGrams: 300,
    price: 98.0,
    comparePrice: 115.0,
    description:
      'Nuestra selección gourmet premium: cuy criado en condiciones especiales con alimentación natural. Textura suave y sabor excepcional.',
    nutrition: {
      calories: 143,
      protein: 20.6,
      fat: 6.4,
      carbs: 0,
      fiber: 0,
      vitamins: ['B1', 'B3', 'A', 'C', 'D'],
      minerals: ['hierro', 'calcio', 'fósforo'],
    },
    stockQuantity: 25,
    totalSales: 85,
  },
];

const seedUser = {
  email: 'admin@cuyperu.com',
  password: 'Admin123!',
  name: 'Admin',
  phone: '+51 999 999 999',
};

async function main() {
  console.log('Seeding database...');

  const passwordHash = await bcrypt.hash(seedUser.password, 10);
  const user = await prisma.user.upsert({
    where: { email: seedUser.email },
    update: {},
    create: {
      email: seedUser.email,
      passwordHash,
      name: seedUser.name,
      phone: seedUser.phone,
    },
  });
  console.log(`Created user: ${user.email}`);

  for (const product of products) {
    const existing = await prisma.product.upsert({
      where: { slug: product.slug },
      update: { ...product },
      create: product,
    });
    await prisma.priceHistory.create({
      data: {
        productId: existing.id,
        price: product.price,
      },
    });
    console.log(`Created product: ${existing.name}`);
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });