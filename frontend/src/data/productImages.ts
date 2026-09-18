import womenActivewearNavy from '../assets/images/products/women-activewear-navy-set.webp'
import womenActivewearTeal from '../assets/images/products/women-activewear-teal-set.webp'
import womenFormalwear from '../assets/images/products/women-formalwear-set.webp'
import womenTulleTop from '../assets/images/products/women-tulle-top-set.webp'
import womenCropArgentina from '../assets/images/products/women-crop-jersey-argentina.webp'
import womenCropPortugal from '../assets/images/products/women-crop-jersey-portugal.webp'
import womenCropBrazil from '../assets/images/products/women-crop-jersey-brazil.webp'
import womenCropPortugalBlack from '../assets/images/products/women-crop-jersey-portugal-black.webp'

import menJerseys1 from '../assets/images/products/men-jerseys-collection-1.webp'
import menJerseys2 from '../assets/images/products/men-jerseys-collection-2.webp'
import menJerseys3 from '../assets/images/products/men-jerseys-collection-3.webp'
import menJerseys4 from '../assets/images/products/men-jerseys-collection-4.webp'
import menJerseyUsa from '../assets/images/products/men-jersey-usa.webp'
import menJerseyJamaica from '../assets/images/products/men-jersey-jamaica.webp'
import menJerseyUsa2 from '../assets/images/products/men-jersey-usa-2.webp'
import menJerseySpain from '../assets/images/products/men-jersey-spain.webp'
import menJerseyNorway from '../assets/images/products/men-jersey-norway.webp'
import menJerseyEngland from '../assets/images/products/men-jersey-england.webp'
import menJerseyBrazil from '../assets/images/products/men-jersey-brazil.webp'
import menJerseyGermany from '../assets/images/products/men-jersey-germany.webp'
import menPantsChino from '../assets/images/products/men-pants-chino.webp'

import kidsCrocsWinniePooh from '../assets/images/products/kids-crocs-winnie-pooh.webp'
import kidsCrocsMinecraft from '../assets/images/products/kids-crocs-minecraft.webp'
import kidsCrocsMoana from '../assets/images/products/kids-crocs-moana.webp'
import kidsCrocsStitch from '../assets/images/products/kids-crocs-stitch.webp'
import kidsCrocsAkatsuki from '../assets/images/products/kids-crocs-akatsuki.webp'
import kidsCrocsPokemon from '../assets/images/products/kids-crocs-pokemon.webp'
import kidsCrocsBatman from '../assets/images/products/kids-crocs-batman.webp'

import shoesBootsCollection from '../assets/images/products/shoes-boots-collection.webp'
import sneakersCrocsBlack from '../assets/images/products/sneakers-crocs-black.webp'

import logo from '../assets/images/logo.webp'

export { logo }

export const categoryImages: Record<string, string[]> = {
  women: [
    womenActivewearNavy,
    womenActivewearTeal,
    womenFormalwear,
    womenTulleTop,
    womenCropArgentina,
    womenCropPortugal,
    womenCropBrazil,
    womenCropPortugalBlack,
  ],
  men: [
    menJerseys1,
    menJerseys2,
    menJerseys3,
    menJerseys4,
    menJerseyUsa,
    menJerseyJamaica,
    menJerseyUsa2,
    menJerseySpain,
    menJerseyNorway,
    menJerseyEngland,
    menJerseyBrazil,
    menJerseyGermany,
    menPantsChino,
  ],
  kids: [
    kidsCrocsWinniePooh,
    kidsCrocsMinecraft,
    kidsCrocsMoana,
    kidsCrocsStitch,
    kidsCrocsAkatsuki,
    kidsCrocsPokemon,
    kidsCrocsBatman,
  ],
  shoes: [shoesBootsCollection],
  sneakers: [sneakersCrocsBlack],
}

export const categoryCoverImage: Record<string, string> = {
  women: womenFormalwear,
  men: menJerseyGermany,
  kids: kidsCrocsPokemon,
  shoes: shoesBootsCollection,
  sneakers: sneakersCrocsBlack,
}

const allImages: Record<string, string> = {
  'women-activewear-navy-set.webp': womenActivewearNavy,
  'women-activewear-teal-set.webp': womenActivewearTeal,
  'women-formalwear-set.webp': womenFormalwear,
  'women-tulle-top-set.webp': womenTulleTop,
  'women-crop-jersey-argentina.webp': womenCropArgentina,
  'women-crop-jersey-portugal.webp': womenCropPortugal,
  'women-crop-jersey-brazil.webp': womenCropBrazil,
  'women-crop-jersey-portugal-black.webp': womenCropPortugalBlack,
  'men-jerseys-collection-1.webp': menJerseys1,
  'men-jerseys-collection-2.webp': menJerseys2,
  'men-jerseys-collection-3.webp': menJerseys3,
  'men-jerseys-collection-4.webp': menJerseys4,
  'men-jersey-usa.webp': menJerseyUsa,
  'men-jersey-jamaica.webp': menJerseyJamaica,
  'men-jersey-usa-2.webp': menJerseyUsa2,
  'men-jersey-spain.webp': menJerseySpain,
  'men-jersey-norway.webp': menJerseyNorway,
  'men-jersey-england.webp': menJerseyEngland,
  'men-jersey-brazil.webp': menJerseyBrazil,
  'men-jersey-germany.webp': menJerseyGermany,
  'men-pants-chino.webp': menPantsChino,
  'kids-crocs-winnie-pooh.webp': kidsCrocsWinniePooh,
  'kids-crocs-minecraft.webp': kidsCrocsMinecraft,
  'kids-crocs-moana.webp': kidsCrocsMoana,
  'kids-crocs-stitch.webp': kidsCrocsStitch,
  'kids-crocs-akatsuki.webp': kidsCrocsAkatsuki,
  'kids-crocs-pokemon.webp': kidsCrocsPokemon,
  'kids-crocs-batman.webp': kidsCrocsBatman,
  'shoes-boots-collection.webp': shoesBootsCollection,
  'sneakers-crocs-black.webp': sneakersCrocsBlack,
}

export function resolveProductImage(filename: string): string {
  return allImages[filename] || ''
}
