export const getCart = async () => {

  const res = await fetch(
    'http://localhost:3000/api/cart',
    {
      credentials: 'include'
    }
  )

  return res.json()

}

export const removeFromCart = async (productId) => {

  await fetch(
    'http://localhost:3000/api/cart/remove',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        productId
      })
    }
  )

}