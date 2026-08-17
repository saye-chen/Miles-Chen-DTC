/**
 * 旅程图片优化脚本（开发工具，不参与构建）
 * ------------------------------------------------------------
 * 把 public/images/journey/ 下的 PNG 演示素材转换为 AVIF + WebP，
 * 并为每个图片生成 768w 移动端变体，供 <picture>/srcset 按需加载。
 *
 * - 原 PNG 保留为可编辑母版（正式商业摄影替换前的素材来源）。
 * - 重复运行会跳过已生成的目标文件；加 --force 可强制重建。
 *
 * 用法：corepack pnpm optimize:images  （见 package.json scripts）
 */
import { readdirSync, existsSync, statSync } from 'node:fs'
import { join, basename } from 'node:path'
import sharp from 'sharp'

const dir = 'public/images/journey'
const FORCE = process.argv.includes('--force')

/** 目标宽度集合：768w（移动端/面板）+ 原图上限 1536w（全屏） */
const TARGET_WIDTHS = [768, 1536]

const pngFiles = readdirSync(dir)
  .filter((file) => file.endsWith('.png') && !file.startsWith('.'))
  .sort()

let totalAvif = 0
let totalWebp = 0

for (const file of pngFiles) {
  const name = basename(file, '.png')
  const input = join(dir, file)
  const meta = await sharp(input).metadata()
  const maxWidth = Math.min(meta.width ?? 1536, 1536)
  const sizes = [...new Set([...TARGET_WIDTHS.filter((w) => w < maxWidth), maxWidth])]

  for (const width of sizes) {
    const suffix = width === maxWidth ? '' : `-${width}`
    const avifOut = join(dir, `${name}${suffix}.avif`)
    const webpOut = join(dir, `${name}${suffix}.webp`)

    if (!FORCE && existsSync(avifOut) && existsSync(webpOut)) continue

    await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .avif({ quality: 55, effort: 4 })
      .toFile(avifOut)

    await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 80, effort: 4 })
      .toFile(webpOut)

    const avifSize = statSync(avifOut).size
    const webpSize = statSync(webpOut).size
    totalAvif += avifSize
    totalWebp += webpSize
    console.log(`✓ ${basename(avifOut)} ${(avifSize / 1024).toFixed(0)}KB · ${basename(webpOut)} ${(webpSize / 1024).toFixed(0)}KB`)
  }
}

console.log(`\nAVIF 合计 ${(totalAvif / 1024 / 1024).toFixed(2)}MB · WebP 合计 ${(totalWebp / 1024 / 1024).toFixed(2)}MB`)
