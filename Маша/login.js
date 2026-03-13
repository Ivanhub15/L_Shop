import { loginUser } from '../api/auth.js'

export const initLogin = () => {

  const form = document.getElementById('loginForm')

  form.addEventListener('submit', async (e) => {

    e.preventDefault()

    const data = Object.fromEntries(
      new FormData(form).entries()
    )

    await loginUser(data)

    alert('Logged in')

  })

}