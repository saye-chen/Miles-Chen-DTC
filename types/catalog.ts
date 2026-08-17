/** 页面消费的稳定商品模型；平台字段必须在 Adapter 内转换。 */
export type CatalogCategory = 'alone' | 'together' | 'remote'
export type CatalogProduct = { id:string; slug:string; name:string; category:CatalogCategory; price:number; currency:string; status:'demo'|'active'|'sold-out'; description:string; features:string[]; image:string }

export type CatalogAdapter = { listProducts(): CatalogProduct[]; getProduct(slug:string): CatalogProduct | undefined }
