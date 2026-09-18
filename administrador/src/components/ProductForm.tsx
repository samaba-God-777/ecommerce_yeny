import { useState, useRef } from 'react'
import { Plus, Package, Upload, X, Zap, Star, TrendingUp } from 'lucide-react'
import Button from './ui/Button'
import Input from './ui/Input'

interface Category {
  id: string
  name: string
}

interface ProductFormProps {
  categories: Category[]
  onSubmit: (data: { name: string; categoryId: string; brand: string; price: number; stock: number; image?: File; isFlashSale: boolean; flashSalePrice: number | null; flashSaleEnd: string; isBestSeller: boolean; isTrending: boolean }) => void
}

export default function ProductForm({ categories, onSubmit }: ProductFormProps) {
  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [brand, setBrand] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isFlashSale, setIsFlashSale] = useState(false)
  const [flashSalePrice, setFlashSalePrice] = useState('')
  const [flashSaleEnd, setFlashSaleEnd] = useState('')
  const [isBestSeller, setIsBestSeller] = useState(false)
  const [isTrending, setIsTrending] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      name,
      categoryId,
      brand,
      price: Number(price),
      stock: Number(stock),
      image: imageFile || undefined,
      isFlashSale,
      flashSalePrice: flashSalePrice ? Number(flashSalePrice) : null,
      flashSaleEnd,
      isBestSeller,
      isTrending
    })
    setName('')
    setCategoryId('')
    setBrand('')
    setPrice('')
    setStock('')
    setIsFlashSale(false)
    setFlashSalePrice('')
    setFlashSaleEnd('')
    setIsBestSeller(false)
    setIsTrending(false)
    removeImage()
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-market/10">
          <Plus className="h-5 w-5 text-market" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-brown font-serif">Nuevo Producto</h3>
          <p className="text-xs text-muted-foreground">Agrega un nuevo producto a tu catálogo</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Upload */}
        <div className="w-full">
          <label className="block text-sm font-medium text-brown mb-1.5 font-serif">
            Imagen del Producto
          </label>
          
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg border border-border"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors"
              >
                <X size={16} className="text-red-500" />
              </button>
              <div className="absolute bottom-2 left-2">
                <span className="px-2 py-1 bg-white/90 rounded text-xs font-medium text-brown">
                  {imageFile?.name}
                </span>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-48 border-2 border-dashed border-border rounded-lg hover:border-market/40 hover:bg-market/5 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-3"
            >
              <div className="p-3 bg-market/10 rounded-full">
                <Upload size={24} className="text-market" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-brown">Click para subir imagen</p>
                <p className="text-xs text-muted-foreground mt-1">o arrastra y suelta</p>
              </div>
              <p className="text-[10px] text-muted-foreground">PNG, JPG, WEBP hasta 5MB</p>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <Input
          label="Nombre del producto"
          placeholder="Ej: Zapatillas Urbanas"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-brown mb-1.5 font-serif">Categoría</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-brown focus:outline-none focus:ring-2 focus:ring-market focus:border-transparent transition-all duration-200"
            >
              <option value="">Seleccionar...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <Input
            label="Marca"
            placeholder="Ej: Yenyleths"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Precio"
            type="number"
            placeholder="0.00"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <Input
            label="Stock"
            type="number"
            placeholder="0"
            min="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>

        {/* Flash Sale Section */}
        <div className="border border-border rounded-lg p-4 bg-muted/40">
          <div className="flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              id="isFlashSale"
              checked={isFlashSale}
              onChange={(e) => setIsFlashSale(e.target.checked)}
              className="w-4 h-4 text-market rounded focus:ring-market"
            />
            <label htmlFor="isFlashSale" className="flex items-center gap-2 text-sm font-medium text-brown cursor-pointer">
              <Zap size={16} className="text-yellow-500" />
              Venta Flash
            </label>
          </div>
          {isFlashSale && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <Input
                label="Precio Flash"
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0"
                value={flashSalePrice}
                onChange={(e) => setFlashSalePrice(e.target.value)}
              />
              <Input
                label="Fecha límite"
                type="datetime-local"
                value={flashSaleEnd}
                onChange={(e) => setFlashSaleEnd(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Best Seller & Trending Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-border rounded-lg p-4 bg-muted/40">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isBestSeller"
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
                className="w-4 h-4 text-market rounded focus:ring-market"
              />
              <label htmlFor="isBestSeller" className="flex items-center gap-2 text-sm font-medium text-brown cursor-pointer">
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                Más Vendido
              </label>
            </div>
          </div>

          <div className="border border-border rounded-lg p-4 bg-muted/40">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isTrending"
                checked={isTrending}
                onChange={(e) => setIsTrending(e.target.checked)}
                className="w-4 h-4 text-market rounded focus:ring-market"
              />
              <label htmlFor="isTrending" className="flex items-center gap-2 text-sm font-medium text-brown cursor-pointer">
                <TrendingUp size={16} className="text-market" />
                Tendencia
              </label>
            </div>
          </div>
        </div>

        <Button type="submit" variant="primary" className="w-full bg-market hover:bg-market-deep text-white border-0">
          <Package size={18} />
          Crear Producto
        </Button>
      </form>
    </div>
  )
}
