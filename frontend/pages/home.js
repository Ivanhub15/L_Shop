import { getProducts } from '../api/products.js'

export const renderHome = async () => {

  const container = document.getElementById('products')

  container.innerHTML = ''

  const products = await getProducts()

  products.forEach(product => {

    const div = document.createElement('div')

    div.innerHTML = `
      <h3 data-title="${product.name}">
        ${product.name}
      </h3>

      <p data-price="${product.price}">
        $${product.price}
      </p>

      <button>Add to cart</button>
    `

    container.append(div)

  })

}