import { useState } from 'react'
import { Plus, FolderOpen } from 'lucide-react'
import Button from './ui/Button'
import Input from './ui/Input'

interface CategoryFormProps {
  onSubmit: (data: { name: string; slug: string }) => void
}

export default function CategoryForm({ onSubmit }: CategoryFormProps) {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-')
    })
    setName('')
    setSlug('')
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-market/10">
          <Plus className="h-5 w-5 text-market" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-brown font-serif">Nueva Categoría</h3>
          <p className="text-xs text-muted-foreground">Agrega una nueva categoría a tu tienda</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre"
          placeholder="Ej: Zapatos Deportivos"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Slug (opcional)"
          placeholder="Ej: zapatos-deportivos"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
        <Button type="submit" variant="primary" className="w-full bg-market hover:bg-market-deep text-white border-0">
          <FolderOpen size={18} />
          Crear Categoría
        </Button>
      </form>
    </div>
  )
}
