export const createCartItem = (item) => {

  const div = document.createElement('div')

  div.innerHTML = `
    <h3 data-title="basket">${item.name}</h3>
    <p data-price="basket">$${item.price}</p>
    <p>Quantity: ${item.quantity}</p>
    <button data-id="${item.id}">
      Remove
    </button>
  `

  return div

}