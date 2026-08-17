# Journey 视觉素材清单

本目录中的图片为本轮使用图像生成能力制作的原创演示素材，当前仅用于本地开发验证，不代表真实商品、真实材质或正式商业摄影。

| 文件 | 用途 | 来源状态 |
| --- | --- | --- |
| `skin-touch-v2.png` | Body Touch 第二幕皮肤与手部触碰主视觉（Act 02 看见体温） | `demo: true`, `dataStatus: "fictional"` |
| `pexels-six-afterglow-v1.png` | Shop 第六幕时尚人体主视觉（Pexels 17101140，已裁切调色） | `external: Pexels`, `license: verify before production` |
| `pexels-act05-black-lingerie-v1.png` | 首页第五幕身体高潮主视觉（Pexels 10670470，已裁切调色） | `external: Pexels`, `license: verify before production` |
| `scene-touch-v2.png` | Desire Scenes 第三幕触碰近景（Act 03 发生触碰） | `demo: true`, `dataStatus: "fictional"` |
| `hero-touch-film.png` | 首页第一幕与全局氛围光影 | `demo: true`, `dataStatus: "fictional"` |
| `product-the-object.png` | 商品 The Object (alone) 独立商品图 | `demo: true`, `dataStatus: "fictional"` |
| `product-the-distance.png` | 商品 The Distance (remote) 独立商品图 | `demo: true`, `dataStatus: "fictional"` |
| `product-the-pair.png` | 商品 The Pair (together) 独立商品图 | `demo: true`, `dataStatus: "fictional"` |

## 优化产物

每个 PNG 由 `scripts/optimize-images.mjs` 生成 AVIF + WebP（含 768w 移动端变体），
页面通过 `<picture>` / srcset 按需下发；PNG 保留为可编辑母版。
重跑：`pnpm optimize:images`（`--force` 强制重建）。

正式上线前必须替换或复核：产品形态、产品图片授权、材质事实、人物肖像与商业使用范围。
