export const initDelivery = () => {

  const form = document.getElementById('deliveryForm')

  form.addEventListener('submit', async (e) => {

    e.preventDefault()

    const data = Object.fromEntries(
      new FormData(form).entries()
    )

    await fetch('http://localhost:3000/api/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(data)
    })

    alert('Order created')

  })

}