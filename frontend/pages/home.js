import {getProducts} from '../api/products.js'
import {productCard} from '../components/productCard.js'

export const renderHome = async ()=>{

 const container=document.getElementById('products')

 let products=await getProducts()

 const search=document.getElementById('search')

 search.addEventListener('input',()=>{

  const text=search.value.toLowerCase()

  const filtered=products.filter(p=>
   p.name.toLowerCase().includes(text)
  )

  render(filtered)

 })


 const sort=document.getElementById('sort')

 sort.addEventListener('change',()=>{

  if(sort.value==="price_asc"){
   products.sort((a,b)=>a.price-b.price)
  }

  if(sort.value==="price_desc"){
   products.sort((a,b)=>b.price-a.price)
  }

  render(products)

 })


 const category=document.getElementById('category')

 category.addEventListener('change',()=>{

  const filtered=products.filter(p=>
   category.value==='' || p.category===category.value
  )

  render(filtered)

 })


 const render=(items)=>{

  container.innerHTML=''

  items.forEach(p=>{
   container.appendChild(productCard(p))
  })

 }

 render(products)

}
