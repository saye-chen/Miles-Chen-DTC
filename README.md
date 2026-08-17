# Miles-Chen-DTC

Miles Chen 独立站前端项目，当前处于基础环境与品牌官网原型筹备阶段。

技术选型与开发约束见：[技术选型](docs/1-Technical-Stack.md) · [开发规范](docs/2-Development-Standards.md)

## 当前状态

- 已完成 v1.3 首页本地演示实现：暗夜欲望旅程、原创演示素材、Canvas 触碰脉冲和移动端布局。
- v1.4 优化：图片 AVIF/WebP 瘦身（8.1MB → 0.5MB 可下发体积）、全站 SEO（title/description/OG/canonical/lang）、真实 404（信息页白名单 + 品牌错误页）、首屏亮度与双 CTA、第六幕商品入口、页脚品牌收束、第三/二/四/五幕叙事动效、移动端与无障碍复核。
- 商品字段、价格、库存、材质、支付、物流和后台信息仍是待确认项，演示数据均标记为 fictional / illustrative。
- 正式上线前需替换真实商品资料、素材授权、品牌识别、商业履约和支付配置；`SITE_URL` 等 SEO 常量待替换为正式域名。

## 环境要求

- Node.js 24.18.0 LTS
- pnpm 11.x（当前本机为 11.19.0；沙箱环境可用 `corepack pnpm`）
- VS Code + Vue - Official 扩展

## 常用命令

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
pnpm optimize:images   # 重新生成 journey 图片的 AVIF/WebP（scripts/optimize-images.mjs）
pnpm exec playwright test   # 冒烟测试（需先启动 preview 于 3100 端口）
```

开发服务器默认地址：[http://localhost:3000](http://localhost:3000)

## 启动与查看

在项目目录执行：

```bash
pnpm install
pnpm dev
```

然后打开 [http://localhost:3000](http://localhost:3000)。终端按 `Ctrl + C` 可停止开发服务器。

生产构建检查：

```bash
pnpm build
pnpm preview
```

预览服务器启动后同样访问 [http://localhost:3000](http://localhost:3000)。
