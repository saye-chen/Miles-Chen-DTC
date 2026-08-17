# 原始素材库

本目录只保存**下载源文件**（无法从运行资源反向恢复的原图）。页面实际加载的优化版本（PNG/WebP/AVIF 及 `-768` 变体）位于父目录 `public/images/journey/`，登记见父目录 `README.md`。

| 文件 | 用途 | 来源状态 |
| --- | --- | --- |
| `pexels-17101140-original.jpg` | Act 06 主视觉下载原图（处理后为 `pexels-six-afterglow-v1`） | `external: Pexels 17101140`, `license: verify before production` |
| `pexels-act05-black-lingerie-original.jpg` | Act 05 主视觉下载原图（处理后为 `pexels-act05-black-lingerie-v1`） | `external: Pexels 10670470`, `license: verify before production` |
| `pexels-six-afterglow-v1-master-v1.png` | Act 06 调色前母版快照（纯黑背景未暖化，留档备查） | 处理母版，非页面运行资源 |
| `skin-touch-v2-master-v1.png` | Act 02 调色前母版快照（过暗版本，留档备查） | 处理母版，非页面运行资源 |

> 说明：处理后的 PNG 母版即父目录中被页面引用的同名 PNG（同时充当 `<picture>` 回退源），不再在 `originals/` 重复存放。
> `*-master-v1.png` 为 2025-08 视觉调优前的留档快照，仅用于比对，不参与构建。
> 正式商业发布前需重新核对 Pexels 许可与模特肖像权。
