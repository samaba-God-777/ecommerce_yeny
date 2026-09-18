import { useState, useRef } from 'react'
import { Trash2, Package, Zap, Star, TrendingUp, Edit2, X, Upload, Save } from 'lucide-react'
import Badge from './ui/Badge'
import Button from './ui/Button'
import Modal from './ui/Modal'
import Input from './ui/Input'
import { getImageUrl } from '../lib/image'

interface Category {
  id: string
  name: string
}

interface Product {
  id: string
  name: string
  categoryId: string
  brand: string
  price: number
  image: string
  description: string
  stock: number
  rating: number
  isFlashSale?: boolean
  flashSalePrice?: number | null
  flashSaleEnd?: string | null
  isBestSeller?: boolean
  isTrending?: boolean
}

interface ProductTableProps {
  products: Product[]
  categories: Category[]
  onDelete: (id: string) => void
  onToggleFlashSale: (id: string, value: boolean) => void
  onToggleBestSeller: (id: string, value: boolean) => void
  onToggleTrending: (id: string, value: boolean) => void
  onUpdate: (id: string, data: { name: string; categoryId: string; brand: string; price: number; stock: number; image?: File; isFlashSale: boolean; flashSalePrice: number | null; flashSaleEnd: string; isBestSeller: boolean; isTrending: boolean }) => void
}

export default function ProductTable({ products, categories, onDelete, onToggleFlashSale, onToggleBestSeller, onToggleTrending, onUpdate }: ProductTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [editName, setEditName] = useState('')
  const [editCategoryId, setEditCategoryId] = useState('')
  const [editBrand, setEditBrand] = useState('')
  const [editPrice, setEditPrice] = useState('')
  const [editStock, setEditStock] = useState('')
  const [editImageFile, setEditImageFile] = useState<File | null>(null)
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null)
  const [editIsFlashSale, setEditIsFlashSale] = useState(false)
  const [editFlashSalePrice, setEditFlashSalePrice] = useState('')
  const [editFlashSaleEnd, setEditFlashSaleEnd] = useState('')
  const [editIsBestSeller, setEditIsBestSeller] = useState(false)
  const [editIsTrending, setEditIsTrending] = useState(false)
  const editFileInputRef = useRef<HTMLInputElement>(null)

  const handleConfirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId)
      setDeleteId(null)
    }
  }

  const openEditModal = (product: Product) => {
    setEditProduct(product)
    setEditName(product.name)
    setEditCategoryId(product.categoryId)
    setEditBrand(product.brand)
    setEditPrice(String(product.price))
    setEditStock(String(product.stock))
    setEditImageFile(null)
    setEditImagePreview(null)
    setEditIsFlashSale(product.isFlashSale || false)
    setEditFlashSalePrice(product.flashSalePrice ? String(product.flashSalePrice) : '')
    setEditFlashSaleEnd(product.flashSaleEnd || '')
    setEditIsBestSeller(product.isBestSeller || false)
    setEditIsTrending(product.isTrending || false)
  }

  const closeEditModal = () => {
    setEditProduct(null)
    setEditImageFile(null)
    setEditImagePreview(null)
  }

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setEditImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveEdit = () => {
    if (editProduct) {
      onUpdate(editProduct.id, {
        name: editName,
        categoryId: editCategoryId,
        brand: editBrand,
        price: Number(editPrice),
        stock: Number(editStock),
        image: editImageFile || undefined,
        isFlashSale: editIsFlashSale,
        flashSalePrice: editFlashSalePrice ? Number(editFlashSalePrice) : null,
        flashSaleEnd: editFlashSaleEnd,
        isBestSeller: editIsBestSeller,
        isTrending: editIsTrending
      })
      closeEditModal()
    }
  }

  const getStockBadge = (stock: number) => {
    if (stock > 10) return <Badge variant="success">{stock} unidades</Badge>
    if (stock > 0) return <Badge variant="warning">{stock} unidades</Badge>
    return <Badge variant="danger">Sin stock</Badge>
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-market" />
              <h3 className="font-bold text-brown font-serif">Todos los Productos</h3>
            </div>
            <Badge variant="default" className="bg-market/10 text-market">{products.length} total</Badge>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Producto</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Categoría</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Marca</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Precio</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">Stock</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">⚡</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">⭐</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">📈</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="h-12 w-12 text-muted-foreground" />
                      <p className="text-muted-foreground">No hay productos aún</p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((prod) => {
                  const cat = categories.find((c) => c.id === prod.categoryId)
                  return (
                    <tr key={prod.id} className="hover:bg-muted/50 transition-colors duration-150">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                            {getImageUrl(prod.image) ? (
                              <img src={getImageUrl(prod.image) ?? undefined} alt={prod.name} className="w-full h-full object-cover" />
                            ) : (
                              <Package className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-brown text-sm">{prod.name}</p>
                            <p className="text-xs text-muted-foreground">ID: {prod.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-muted-foreground">{cat?.name || 'Sin categoría'}</span>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant="default" className="bg-muted text-ink-soft border-border text-xs">{prod.brand}</Badge>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <span className="font-semibold text-brown text-sm">{formatPrice(prod.price)}</span>
                          {prod.isFlashSale && prod.flashSalePrice && (
                            <p className="text-xs text-market font-medium">Flash: {formatPrice(prod.flashSalePrice)}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {getStockBadge(prod.stock)}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => onToggleFlashSale(prod.id, !prod.isFlashSale)}
                          className={`p-1.5 rounded-lg transition-all duration-200 ${
                            prod.isFlashSale 
                              ? 'bg-market/15 text-market hover:bg-market/25' 
                              : 'bg-muted text-muted-foreground hover:bg-muted-foreground/10'
                          }`}
                          title={prod.isFlashSale ? 'Quitar de Venta Flash' : 'Agregar a Venta Flash'}
                        >
                          <Zap size={16} className={prod.isFlashSale ? 'fill-market' : ''} />
                        </button>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => onToggleBestSeller(prod.id, !prod.isBestSeller)}
                          className={`p-1.5 rounded-lg transition-all duration-200 ${
                            prod.isBestSeller 
                              ? 'bg-market/15 text-market hover:bg-market/25' 
                              : 'bg-muted text-muted-foreground hover:bg-muted-foreground/10'
                          }`}
                          title={prod.isBestSeller ? 'Quitar de Más Vendidos' : 'Agregar a Más Vendidos'}
                        >
                          <Star size={16} className={prod.isBestSeller ? 'fill-market' : ''} />
                        </button>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => onToggleTrending(prod.id, !prod.isTrending)}
                          className={`p-1.5 rounded-lg transition-all duration-200 ${
                            prod.isTrending 
                              ? 'bg-market/15 text-market hover:bg-market/25' 
                              : 'bg-muted text-muted-foreground hover:bg-muted-foreground/10'
                          }`}
                          title={prod.isTrending ? 'Quitar de Tendencia' : 'Agregar a Tendencia'}
                        >
                          <TrendingUp size={16} className={prod.isTrending ? 'text-market' : ''} />
                        </button>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openEditModal(prod)}
                            className="p-1.5 rounded-lg bg-market/10 text-market hover:bg-market/20 transition-all duration-200"
                            title="Editar producto"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteId(prod.id)}
                            className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200"
                            title="Eliminar producto"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Eliminar Producto">
        <p className="text-muted-foreground mb-6">
          ¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancelar</Button>
          <Button variant="destructive" onClick={handleConfirmDelete}>Eliminar</Button>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editProduct} onClose={closeEditModal} title="Editar Producto">
        <div className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
          {/* Image Upload */}
          <div className="w-full">
            <label className="block text-sm font-medium text-brown mb-1.5 font-serif">Imagen del Producto</label>
            {editImagePreview ? (
              <div className="relative">
                <img src={editImagePreview} alt="Preview" className="w-full h-40 object-cover rounded-lg border border-border" />
                <button
                  type="button"
                  onClick={() => { setEditImageFile(null); setEditImagePreview(null) }}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors"
                >
                  <X size={16} className="text-red-500" />
                </button>
              </div>
            ) : editProduct?.image ? (
              <div className="relative">
                <img 
                  src={getImageUrl(editProduct.image) ?? undefined} 
                  alt={editProduct.name} 
                  className="w-full h-40 object-cover rounded-lg border border-border" 
                />
                <button
                  type="button"
                  onClick={() => editFileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors"
                >
                  <Upload size={16} className="text-market" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => editFileInputRef.current?.click()}
                className="w-full h-40 border-2 border-dashed border-border rounded-lg hover:border-market/40 hover:bg-market/5 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-2"
              >
                <Upload size={24} className="text-market" />
                <p className="text-sm text-muted-foreground">Subir imagen</p>
              </div>
            )}
            <input
              ref={editFileInputRef}
              type="file"
              accept="image/*"
              onChange={handleEditImageChange}
              className="hidden"
            />
          </div>

          <Input label="Nombre" value={editName} onChange={(e) => setEditName(e.target.value)} required />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brown mb-1.5 font-serif">Categoría</label>
              <select
                value={editCategoryId}
                onChange={(e) => setEditCategoryId(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-brown focus:outline-none focus:ring-2 focus:ring-market text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <Input label="Marca" value={editBrand} onChange={(e) => setEditBrand(e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Precio" type="number" step="0.01" min="0" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} required />
            <Input label="Stock" type="number" min="0" value={editStock} onChange={(e) => setEditStock(e.target.value)} required />
          </div>

          {/* Flags */}
          <div className="grid grid-cols-3 gap-3">
            <label className="flex items-center gap-2 p-2 rounded-lg bg-muted cursor-pointer">
              <input type="checkbox" checked={editIsFlashSale} onChange={(e) => setEditIsFlashSale(e.target.checked)} className="w-4 h-4 text-market rounded" />
              <Zap size={14} className="text-market" />
              <span className="text-xs font-medium">Flash</span>
            </label>
            <label className="flex items-center gap-2 p-2 rounded-lg bg-muted cursor-pointer">
              <input type="checkbox" checked={editIsBestSeller} onChange={(e) => setEditIsBestSeller(e.target.checked)} className="w-4 h-4 text-market rounded" />
              <Star size={14} className="text-market fill-market" />
              <span className="text-xs font-medium">Best Seller</span>
            </label>
            <label className="flex items-center gap-2 p-2 rounded-lg bg-muted cursor-pointer">
              <input type="checkbox" checked={editIsTrending} onChange={(e) => setEditIsTrending(e.target.checked)} className="w-4 h-4 text-market rounded" />
              <TrendingUp size={14} className="text-market" />
              <span className="text-xs font-medium">Tendencia</span>
            </label>
          </div>

          {editIsFlashSale && (
            <div className="grid grid-cols-2 gap-4 p-3 bg-market/5 rounded-lg border border-market/20">
              <Input label="Precio Flash" type="number" step="0.01" min="0" value={editFlashSalePrice} onChange={(e) => setEditFlashSalePrice(e.target.value)} />
              <Input label="Fecha límite" type="datetime-local" value={editFlashSaleEnd} onChange={(e) => setEditFlashSaleEnd(e.target.value)} />
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <Button variant="ghost" onClick={closeEditModal}>Cancelar</Button>
            <Button variant="primary" onClick={handleSaveEdit}>
              <Save size={16} />
              Guardar Cambios
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
