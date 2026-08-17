export type CartLine = { productId: string; slug: string; name: string; price: number; quantity: number; image: string }

/** 本地购物袋状态，模拟正常购买链路，不连接支付或真实订单。 */
export function useDemoCart() {
  const lines = useState<CartLine[]>('demo-cart-lines', () => [])
  const total = computed(() => lines.value.reduce((sum, line) => sum + line.price * line.quantity, 0))
  const count = computed(() => lines.value.reduce((sum, line) => sum + line.quantity, 0))
  function add(product: CartLine) { const line = lines.value.find((item) => item.productId === product.productId); line ? line.quantity += 1 : lines.value.push({ ...product, quantity: 1 }) }
  function remove(productId: string) { lines.value = lines.value.filter((line) => line.productId !== productId) }
  return { lines, total, count, add, remove }
}
