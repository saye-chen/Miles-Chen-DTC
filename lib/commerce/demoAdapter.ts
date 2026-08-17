import type { CommerceAdapter } from '~/types/commerce'

/** 演示结账适配器：正式接平台后只替换此文件，不改结账页面。 */
export const demoCommerceAdapter: CommerceAdapter = {
  async createCheckout() { return { checkoutUrl: '/checkout' } },
}
