import { getCart } from '../api/cart.js'
import { createCartItem } from '../components/cartItem.js'

export const renderCart = async () => {

  const container = document.getElementById('cart')

  container.innerHTML = ''

  const cart = await getCart()

  cart.forEach(item => {

    const el = createCartItem(item)

    container.append(el)

  })

}