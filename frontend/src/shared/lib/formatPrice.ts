export function formatPrice(price: number, currency = '₽'): string {
  return `${price.toLocaleString('ru-RU')} ${currency}`
}

export function formatPriceFrom(price: number): string {
  return `от ${formatPrice(price)}`
}
