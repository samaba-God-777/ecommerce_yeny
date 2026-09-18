const API_BASE = 'http://localhost:5000'

export function getImageUrl(image: string | null | undefined): string | null {
  if (!image) return null
  
  // Si ya es una URL completa
  if (image.startsWith('http')) {
    return image
  }
  
  // Si es un placeholder sin extensión
  if (!image.includes('.')) {
    return null
  }
  
  // Si ya tiene la ruta /images/ o /uploads/, solo agregar el base
  if (image.startsWith('/images/') || image.startsWith('/uploads/')) {
    return `${API_BASE}${image}`
  }
  
  // Si es solo un nombre de archivo
  return `${API_BASE}/images/${image}`
}
