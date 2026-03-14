import {getCart} from '../api/cart.js'

const container=document.getElementById('cart')

export const renderCart = async ()=>{

 const items=await getCart()

 container.innerHTML=''

 if(items.length===0){
  container.innerHTML='Cart empty'
  return
 }

 items.forEach(item=>{

  const div=document.createElement('div')

  div.innerHTML=`
   <h3>${item.name}</h3>
   <p>${item.price}$</p>
  `

  container.appendChild(div)

 })

}

renderCart()