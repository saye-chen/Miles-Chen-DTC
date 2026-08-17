export type CheckoutResult = { orderId:string; status:'demo'|'pending'|'paid' }
export type CommerceAdapter = { createCheckout(lines: Array<{ productId:string; quantity:number }>): Promise<{ checkoutUrl:string }> }
