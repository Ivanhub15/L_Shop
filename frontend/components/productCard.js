import {addToCart} from '../api/cart.js'

export const productCard=(product)=>{

 const div=document.createElement('div')

 div.innerHTML=`

 <h3>${product.name}</h3>
 <p>${product.price}$</p>

 <button class="add">
 Add to cart
 </button>

 `

 div.querySelector('.add')
 .addEventListener('click',()=>{

  addToCart(product.id)

 })

 return div
}