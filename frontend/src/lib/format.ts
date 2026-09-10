export function formatPrice(value: number | string): string {
  const number = typeof value === 'string' ? Number(value) : value;
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(number);
}