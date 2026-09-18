export const formatPrice = (value: number) =>
  new Intl.NumberFormat('es-PA', { style: 'currency', currency: 'USD' }).format(value)
