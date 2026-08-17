# Commerce Adapter 边界

当前项目使用本地 Mock Catalog 与 Demo Commerce Adapter，页面不直接依赖平台字段。

## 接入平台时替换

1. 将 `lib/catalog/demoAdapter.ts` 替换为平台 Adapter，映射商品、变体、价格、库存和图片。
2. 将 `lib/commerce/demoAdapter.ts` 替换为平台 Cart / Checkout Adapter。
3. 保持 `CatalogProduct`、`CatalogAdapter`、`CommerceAdapter` 接口稳定，页面组件不改。
4. 平台 Checkout 返回地址后，前端跳转平台完成支付；订单、库存、退款和物流由平台负责。

当前所有商品和结账信息均为演示数据，不产生真实订单或支付。
