import { Router } from 'express'
import { getAllCategories, getCategoryById, createCategory, deleteCategory } from '../models/categoryModel.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'
import asyncHandler from '../middleware/asyncHandler.js'
import { v4 as uuidv4 } from 'uuid'

const categoryImages = {
  women: ['women-activewear-navy-set.webp', 'women-activewear-teal-set.webp', 'women-formalwear-set.webp', 'women-tulle-top-set.webp', 'women-crop-jersey-argentina.webp', 'women-crop-jersey-portugal.webp', 'women-crop-jersey-brazil.webp', 'women-crop-jersey-portugal-black.webp'],
  men: ['men-jerseys-collection-1.webp', 'men-jerseys-collection-2.webp', 'men-jerseys-collection-3.webp', 'men-jerseys-collection-4.webp', 'men-jersey-usa.webp', 'men-jersey-jamaica.webp', 'men-jersey-usa-2.webp', 'men-jersey-spain.webp', 'men-jersey-norway.webp', 'men-jersey-england.webp', 'men-jersey-brazil.webp', 'men-jersey-germany.webp', 'men-pants-chino.webp'],
  kids: ['kids-crocs-winnie-pooh.webp', 'kids-crocs-minecraft.webp', 'kids-crocs-moana.webp', 'kids-crocs-stitch.webp', 'kids-crocs-akatsuki.webp', 'kids-crocs-pokemon.webp', 'kids-crocs-batman.webp'],
  shoes: ['shoes-boots-collection.webp'],
  sneakers: ['sneakers-crocs-black.webp']
}

const router = Router()

router.get('/', asyncHandler(async (req, res) => {
  const categories = await getAllCategories()
  res.json(categories)
}))

router.get('/:slug/images', asyncHandler(async (req, res) => {
  const { slug } = req.params
  const images = categoryImages[slug] || []
  res.json({ slug, images: images.map(img => `/images/${img}`) })
}))

router.post('/', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const { name, slug, image } = req.body
  const cat = await createCategory({
    id: uuidv4(),
    name,
    slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
    image: image || null
  })
  res.status(201).json(cat)
}))

router.delete('/:id', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const cat = await getCategoryById(req.params.id)
  if (!cat) return res.status(404).json({ error: 'Categoría no encontrada' })
  await deleteCategory(req.params.id)
  res.json(cat)
}))

export default router
