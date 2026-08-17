/**
 * 为首页第 2、6 幕生成横版网页构图素材。
 * 原始竖版 PNG 保留不动；这里仅做确定性的中心裁切，不重新生成内容。
 */
import sharp from 'sharp'

const variants = [
  { source: 'touch-v2.png', target: 'touch-v2-wide.png', width: 1536, height: 1152, position: { left: 0, top: 410 } },
  { source: 'silk-object-detail.png', target: 'silk-object-detail-wide.png', width: 1536, height: 1024, position: { left: 0, top: 540 } },
]

for (const variant of variants) {
  await sharp(`public/images/journey/${variant.source}`)
    .extract({ left: variant.position.left, top: variant.position.top, width: variant.width, height: variant.height })
    .png()
    .toFile(`public/images/journey/${variant.target}`)
  console.log(`✓ ${variant.target} (${variant.width}×${variant.height})`)
}
