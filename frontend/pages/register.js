import { registerUser } from '../api/auth.js'

export const initRegister = () => {

  const form = document.getElementById('registerForm')

  form.addEventListener('submit', async (e) => {

    e.preventDefault()

    const formData = new FormData(form)

    const data = Object.fromEntries(formData.entries())

    await registerUser(data)

    alert('User registered')

  })

}