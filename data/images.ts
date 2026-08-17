/**
 * 旅程视觉素材索引（演示素材，正式上线前替换为商业摄影）。
 * AVIF/WebP 由 scripts/optimize-images.mjs 从同名 PNG 生成：
 * `name.avif`(1536w) / `name-768.avif`(768w) / `name.webp`(1536w) / `name-768.webp`(768w)。
 * PNG 保留为可编辑母版，并作为 <picture> 的最末回退。
 */

/** 由 PNG 路径推导 AVIF/WebP 的 srcset 字符串；非 PNG 返回 null */
export function srcsetFromPng(pngPath: string): { avif: string; webp: string } | null {
  if (!pngPath.endsWith('.png')) return null
  const base = pngPath.slice(0, -4)
  return {
    avif: `${base}.avif 1536w, ${base}-768.avif 768w`,
    webp: `${base}.webp 1536w, ${base}-768.webp 768w`,
  }
}
