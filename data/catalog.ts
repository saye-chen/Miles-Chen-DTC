import type { CatalogProduct } from '~/types/catalog'

export type DemoProduct = CatalogProduct & {
  id: string; slug: string; name: string; category: 'alone' | 'together' | 'remote'; price: number; currency: string; status: 'demo'; description: string; features: string[]; image: string
}

/** 本地演示目录。正式上线前由 Catalog Adapter 替换，禁止将字段当成真实商品事实。 */
export const demoProducts: DemoProduct[] = [
  { id:'object-01', slug:'the-object', name:'The Object', category:'alone', price:168, currency:'USD', status:'demo', description:'A quiet object for private time, touch and return.', features:['Soft-touch surface','Illustrative product fact','Private storage concept'], image:'/images/journey/product-the-object.png' },
  { id:'object-02', slug:'the-distance', name:'The Distance', category:'remote', price:228, currency:'USD', status:'demo', description:'A fictional study in distance, response and anticipation.', features:['Remote scenario concept','Illustrative product fact','Demo availability'], image:'/images/journey/product-the-distance.png' },
  { id:'object-03', slug:'the-pair', name:'The Pair', category:'together', price:288, currency:'USD', status:'demo', description:'A fictional object for two people and one shared rhythm.', features:['Together scenario concept','Illustrative product fact','Demo availability'], image:'/images/journey/product-the-pair.png' },
]

export const findDemoProduct = (slug: string) => demoProducts.find((product) => product.slug === slug)
