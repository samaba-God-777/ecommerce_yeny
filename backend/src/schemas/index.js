import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(1, 'Usuario requerido'),
  password: z.string().min(1, 'Contraseña requerida')
})

export const registerSchema = z.object({
  username: z.string().min(3, 'Usuario debe tener al menos 3 caracteres').max(30),
  email: z.string().email('Correo inválido'),
  password: z.string().min(6, 'Contraseña debe tener al menos 6 caracteres')
})

export const productSchema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  categoryId: z.string().min(1, 'Categoría requerida'),
  brand: z.string().optional().default(''),
  price: z.coerce.number().positive('Precio debe ser positivo'),
  description: z.string().optional().default(''),
  stock: z.coerce.number().int().min(0).optional().default(0),
  isFlashSale: z.coerce.boolean().optional().default(false),
  flashSalePrice: z.coerce.number().positive().nullable().optional().default(null),
  flashSaleEnd: z.string().nullable().optional().default(null),
  isBestSeller: z.coerce.boolean().optional().default(false),
  isTrending: z.coerce.boolean().optional().default(false)
})

export const categorySchema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  slug: z.string().optional(),
  image: z.string().nullable().optional().default(null)
})

export const orderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.number().int().min(1),
    size: z.string().optional().default(''),
    color: z.string().optional().default('')
  })).min(1, 'Debe incluir al menos un producto'),
  shippingAddress: z.string().min(5, 'Dirección requerida'),
  paymentMethod: z.enum(['card', 'yappy', 'paypal', 'cod']),
  customerName: z.string().min(1, 'Nombre requerido'),
  customerEmail: z.string().email('Correo inválido'),
  customerPhone: z.string().optional().default(''),
  couponCode: z.string().optional().default('')
})

export const reviewSchema = z.object({
  author: z.string().min(1, 'Nombre requerido'),
  rating: z.number().int().min(1).max(5, 'Rating debe ser 1-5'),
  comment: z.string().min(1, 'Comentario requerido')
})

export const couponSchema = z.object({
  code: z.string().min(3, 'Código debe tener al menos 3 caracteres').toUpperCase(),
  discount: z.coerce.number().positive('Descuento debe ser positivo'),
  type: z.enum(['percent', 'fixed', 'free_shipping']),
  maxUses: z.coerce.number().int().positive().optional().default(100),
  minAmount: z.coerce.number().min(0).optional().default(0),
  expires: z.string().optional()
})
