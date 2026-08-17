import { demoProducts } from '~/data/catalog'
import type { CatalogAdapter, CatalogProduct } from '~/types/catalog'

/** 本地适配器：未来替换为 Shopify / Shopline 等平台 Adapter。 */
export const demoCatalogAdapter: CatalogAdapter = {
  listProducts: () => demoProducts,
  getProduct: (slug: string): CatalogProduct | undefined => demoProducts.find((product) => product.slug === slug),
}
