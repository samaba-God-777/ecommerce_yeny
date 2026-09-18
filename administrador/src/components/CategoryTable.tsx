import { Trash2, FolderOpen, ExternalLink } from 'lucide-react'
import Badge from './ui/Badge'
import Button from './ui/Button'
import Modal from './ui/Modal'
import { useState } from 'react'

interface Category {
  id: string
  name: string
  slug: string
  image: string | null
}

interface CategoryTableProps {
  categories: Category[]
  onDelete: (id: string) => void
}

export default function CategoryTable({ categories, onDelete }: CategoryTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleConfirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId)
      setDeleteId(null)
    }
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-market" />
              <h3 className="font-bold text-brown font-serif">Todas las Categorías</h3>
            </div>
            <Badge variant="default" className="bg-market/10 text-market">{categories.length} total</Badge>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tienda</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <FolderOpen className="h-12 w-12 text-muted-foreground" />
                      <p className="text-muted-foreground">No hay categorías aún</p>
                    </div>
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-muted/50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <span className="text-ink-soft font-bold text-sm">{cat.name.charAt(0)}</span>
                        </div>
                        <span className="font-medium text-brown">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="px-2 py-1 bg-muted rounded text-sm text-muted-foreground">/{cat.slug}</code>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <a
                        href={`http://localhost:5175/category/${cat.slug}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-market/10 text-market rounded-lg hover:bg-market/20 transition-colors text-sm font-medium"
                      >
                        <ExternalLink size={14} />
                        Ver
                      </a>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(cat.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Eliminar Categoría">
        <p className="text-muted-foreground mb-6">
          ¿Estás seguro de que deseas eliminar esta categoría? Los productos asociados también serán eliminados.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancelar</Button>
          <Button variant="destructive" onClick={handleConfirmDelete}>Eliminar</Button>
        </div>
      </Modal>
    </>
  )
}
