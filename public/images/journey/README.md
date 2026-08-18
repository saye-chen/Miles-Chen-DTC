# Journey 视觉素材清单

本目录保存首页叙事使用的**运行资源**（页面实际加载的优化版本）。其中早期演示素材由图像生成能力制作（fictional），近期已替换为 Pexels 外部素材并裁切调色；原始下载文件与处理母版统一登记在 `originals/`（见 `originals/README.md`）。正式上线前必须核对授权与肖像权。

| 文件 | 用途 | 来源状态 |
| --- | --- | --- |
| `hero-touch-film.png` | 首页第一幕主视觉与全局氛围光影（兼作默认 OG 分享图） | `demo: true`, `dataStatus: "fictional"` |
| `skin-touch-v2.png` | 结账页与手记氛围辅助视觉（早期第二幕开发素材） | `demo: true`, `dataStatus: "fictional"` |
| `unsplash-hand-waist-v1.png` | Body Touch 第二幕手放在腰部的开发阶段主视觉（Act 02 看见体温，黑白素材经页面铜光融合） | `external: Unsplash`, `license: verify before production`, `demo: true` |
| `scene-touch-v2.png` | Desire Scenes 第三幕触碰近景（Act 03 发生触碰） | `demo: true`, `dataStatus: "fictional"` |
| `skin-rhythm-v1.png` | Peak 第四幕律动氛围影像（Act 04）、购物袋空态与手记氛围层 | `demo: true`, `dataStatus: "fictional"` |
| `pexels-act05-black-lingerie-v1.png` | 首页第五幕身体高潮主视觉（Pexels 10670470，已裁切调色） | `external: Pexels`, `license: verify before production` |
| `pexels-six-afterglow-v1.png` | Shop 第六幕时尚人体主视觉（Pexels 17101140，纯黑背景已暖化为酒红暗部、主体提亮） | `external: Pexels`, `license: verify before production` |
| `product-the-object.png` | 商品 The Object (alone) 独立商品图 | `demo: true`, `dataStatus: "fictional"` |
| `product-the-distance.png` | 商品 The Distance (remote) 独立商品图 | `demo: true`, `dataStatus: "fictional"` |
| `product-the-pair.png` | 商品 The Pair (together) 独立商品图 | `demo: true`, `dataStatus: "fictional"` |

## 优化产物

每个 PNG 由 `scripts/optimize-images.mjs` 生成 AVIF + WebP（含 768w 移动端变体），
页面通过 `<picture>` / srcset 按需下发；PNG 保留为可编辑母版。
重跑：`pnpm optimize:images`（`--force` 强制重建）。

正式上线前必须替换或复核：产品形态、产品图片授权、材质事实、人物肖像与商业使用范围。
