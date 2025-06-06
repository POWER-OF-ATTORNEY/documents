// [start-readme]
//
// This script lists all local image files, sorted by their dimensions.
//
// [end-readme]

import { fileURLToPath } from 'url'
import path from 'path'
import walk from 'walk-sync'
import sharp from 'sharp'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const imagesPath = path.join(__dirname, '../assets/images')
const imagesExtensions = ['.jpg', '.jpeg', '.png', '.gif']

const files = walk(imagesPath, { directories: false }).filter((relativePath) => {
  return imagesExtensions.includes(path.extname(relativePath.toLowerCase()))
})
const images = await Promise.all(
  files.map(async (relativePath) => {
    const fullPath = path.join(imagesPath, relativePath)
    const image = sharp(fullPath)
    const { width, height } = await image.metadata()
    const size = (width || 0) * (height || 0)
    return { relativePath, width, height, size }
  }),
)
images
  .sort((a, b) => b.size - a.size)
  .forEach((image) => {
    const { relativePath, width, height } = image
    console.log(`${width} x ${height} - ${relativePath}`)
  })
