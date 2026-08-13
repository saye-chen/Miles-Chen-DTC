# Miles-Chen-DTC 项目协作规则

开发前先阅读 `README.md`、`docs/1-Technical-Stack.md` 和 `docs/2-Development-Standards.md`。

- 保持 Nuxt 3 + Vue 3 + TypeScript 技术栈，未经确认不更换框架。
- 使用 pnpm 管理依赖，修改依赖时同步更新 `pnpm-lock.yaml`。
- 先检查现有代码，再进行局部修改，不覆盖用户已有成果。
- 未确认的业务信息必须标记为示例或待确认，不得自行定案。
- 完成代码修改后至少运行 `pnpm build`；涉及交互时补充 Playwright 验证。
- 保持移动端可用、语义 HTML、键盘可操作和 `prefers-reduced-motion` 支持。
