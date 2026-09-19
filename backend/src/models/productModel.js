import { getDb, FieldValue } from '../database/firestore.js'
import { v4 as uuidv4 } from 'uuid'

/**
 * Productos en Firestore.
 *
 * Dos decisiones que conviene conocer:
 *
 * 1. Los filtros se aplican con where(), pero el ORDEN se hace en memoria.
 *    Firestore exige un indice compuesto por cada combinacion de where +
 *    orderBy, y cada combinacion nueva rompe la tienda con un error hasta que
 *    alguien crea el indice a mano en la consola. Con un catalogo de boutique
 *    (decenas de productos) ordenar aqui es imperceptible y no hay nada que
 *    configurar. Si el catalogo crece a miles, toca declarar los indices.
 *
 * 2. La busqueda por texto tambien se filtra en memoria: Firestore no tiene
 *    busqueda por substring ni "contiene". Lo unico nativo es por prefijo
 *    exacto, que dejaria fuera "camisa" al buscar "mis". Para catalogos
 *    grandes la solucion es un buscador aparte (Algolia, Typesense).
 */

const coleccion = () => getDb().collection('products')

const formatProduct = (doc) => (doc?.exists ? { id: doc.id, ...doc.data() } : null)

// Evita traerse una coleccion enorme si el catalogo crece sin que nadie revise
// esta decision: mejor un tope visible que una factura sorpresa.
const TOPE_LECTURA = 1000

function ordenar(productos, sortBy) {
  const porFecha = (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  switch (sortBy) {
    case 'price_asc': return productos.sort((a, b) => a.price - b.price)
    case 'price_desc': return productos.sort((a, b) => b.price - a.price)
    case 'name': return productos.sort((a, b) => String(a.name).localeCompare(String(b.name)))
    case 'rating': return productos.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    default: return productos.sort(porFecha)
  }
}

export async function getAllProducts(filters = {}) {
  let query = coleccion()

  if (filters.categoryId) query = query.where('categoryId', '==', filters.categoryId)
  if (filters.flashSale === 'true') query = query.where('isFlashSale', '==', true)
  if (filters.bestSeller === 'true') query = query.where('isBestSeller', '==', true)
  if (filters.trending === 'true') query = query.where('isTrending', '==', true)

  const snap = await query.limit(TOPE_LECTURA).get()
  return ordenar(snap.docs.map(formatProduct), null)
}

export async function getProductById(id) {
  return formatProduct(await coleccion().doc(String(id)).get())
}

export async function searchProducts({ q, categoryId, minPrice, maxPrice, sortBy }) {
  let query = coleccion()
  if (categoryId) query = query.where('categoryId', '==', categoryId)

  const snap = await query.limit(TOPE_LECTURA).get()
  let resultados = snap.docs.map(formatProduct)

  if (q) {
    const texto = String(q).toLowerCase()
    resultados = resultados.filter(p =>
      [p.name, p.brand, p.description].some(campo => String(campo || '').toLowerCase().includes(texto))
    )
  }
  if (minPrice) resultados = resultados.filter(p => p.price >= Number(minPrice))
  if (maxPrice) resultados = resultados.filter(p => p.price <= Number(maxPrice))

  return ordenar(resultados, sortBy)
}

export async function createProduct(data) {
  const id = String(data.id || uuidv4())
  const product = {
    name: data.name,
    categoryId: data.categoryId,
    brand: data.brand || '',
    price: Number(data.price),
    oldPrice: data.oldPrice || null,
    image: data.image || 'product-placeholder.webp',
    description: data.description || '',
    stock: Number(data.stock) || 0,
    rating: Number(data.rating) || 4.5,
    isFlashSale: !!data.isFlashSale,
    flashSalePrice: data.flashSalePrice || null,
    flashSaleEnd: data.flashSaleEnd || null,
    isBestSeller: !!data.isBestSeller,
    isTrending: !!data.isTrending,
    createdAt: new Date()
  }
  await coleccion().doc(id).set(product)
  return { id, ...product }
}

export async function updateProduct(id, data) {
  const existing = await getProductById(id)
  if (!existing) return null

  const updates = {
    name: data.name || existing.name,
    categoryId: data.categoryId || existing.categoryId,
    brand: data.brand !== undefined ? data.brand : existing.brand,
    price: data.price !== undefined ? Number(data.price) : existing.price,
    description: data.description !== undefined ? data.description : existing.description,
    stock: data.stock !== undefined ? Number(data.stock) : existing.stock,
    image: data.image || existing.image,
    isFlashSale: data.isFlashSale !== undefined ? !!data.isFlashSale : existing.isFlashSale,
    flashSalePrice: data.flashSalePrice !== undefined ? data.flashSalePrice : existing.flashSalePrice,
    flashSaleEnd: data.flashSaleEnd !== undefined ? data.flashSaleEnd : existing.flashSaleEnd,
    isBestSeller: data.isBestSeller !== undefined ? !!data.isBestSeller : existing.isBestSeller,
    isTrending: data.isTrending !== undefined ? !!data.isTrending : existing.isTrending
  }

  await coleccion().doc(String(id)).update(updates)
  return getProductById(id)
}

export async function updateProductFlags(id, flags) {
  await coleccion().doc(String(id)).update(flags)
  return getProductById(id)
}

export async function deleteProduct(id) {
  await coleccion().doc(String(id)).delete()
}

export async function getLowStock(threshold = 5) {
  const snap = await coleccion()
    .where('stock', '>', 0)
    .where('stock', '<', threshold)
    .get()
  return snap.docs.map(formatProduct).sort((a, b) => a.stock - b.stock)
}

/**
 * Descuenta stock solo si alcanza. En Mongo esto era una condicion dentro del
 * update; en Firestore hace falta una transaccion para que dos compras
 * simultaneas del ultimo articulo no dejen el stock en negativo.
 *
 * @returns {boolean} si se pudo descontar
 */
export async function decrementStock(id, qty) {
  const ref = coleccion().doc(String(id))
  return getDb().runTransaction(async (tx) => {
    const doc = await tx.get(ref)
    if (!doc.exists || (doc.data().stock || 0) < qty) return false
    tx.update(ref, { stock: FieldValue.increment(-qty) })
    return true
  })
}

export async function restoreStock(id, qty) {
  await coleccion().doc(String(id)).update({
    stock: FieldValue.increment(qty)
  })
}
