import { renderHome } from './pages/home.js'

document.addEventListener('DOMContentLoaded', () => {

  renderHome()

  const search = document.getElementById('search')
  const category = document.getElementById('category')
  const sort = document.getElementById('sort')

  search.addEventListener('input', renderHome)
  category.addEventListener('change', renderHome)
  sort.addEventListener('change', renderHome)

})