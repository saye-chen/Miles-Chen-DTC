# Miles-Chen-DTC 项目协作规则

开发前先阅读 `README.md`、`docs/1-Technical-Stack.md` 和 `docs/2-Development-Standards.md`。

- 保持 Nuxt 3 + Vue 3 + TypeScript 技术栈，未经确认不更换框架。
- 使用 pnpm 管理依赖，修改依赖时同步更新 `pnpm-lock.yaml`。
- 先检查现有代码，再进行局部修改，不覆盖用户已有成果。
- 未确认的业务信息必须标记为示例或待确认，不得自行定案。
- 完成代码修改后至少运行 `pnpm build`；涉及交互时补充 Playwright 验证。
- 保持移动端可用、语义 HTML、键盘可操作和 `prefers-reduced-motion` 支持。
- 维护 `public/` 资源时必须先全量检索代码引用；只保留实际使用的运行资源、必要的优化版本和明确登记的原始素材。
- 图片目录保持“运行资源”和“原始素材”分离：页面加载优化后的 PNG/WebP/AVIF，原始文件统一放入对应资源目录的 `originals/`，不得把下载源文件散落在运行目录。
- 每个资源组必须在同目录 README 登记用途、来源状态和授权待确认项；未引用的旧版本、备用图、重复格式和系统文件应及时移除或移入系统废纸篓。
- 新增或替换图片后，必须检查 `rg` 引用、清理无用文件，并运行 `pnpm build`；不要把仅用于临时处理的源文件提交到远端。
- **无死代码**：删除或替换功能时，必须在同一变更中移除对应 DOM、样式、动画脚本、composable 与引用；不得用 `display: none` 或注释保留废弃实现。提交前自查未引用的组件、CSS 类、keyframes、变量和资源。
- **代码书写规范**：遵循 `docs/2-Development-Standards.md`（命名、语义 HTML、样式分层、动效与 `prefers-reduced-motion`）；改动应小而聚焦，提交信息用清晰的中文动作表达。
