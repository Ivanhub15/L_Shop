export const getCart = async () => {

 const res = await fetch(
  'http://localhost:3000/api/cart',
  {
   credentials:'include'
  }
 )

 return res.json()
}


export const addToCart = async (productId) => {

 await fetch(
  'http://localhost:3000/api/cart/add',
  {
   method:'POST',
   credentials:'include',
   headers:{
    'Content-Type':'application/json'
   },
   body:JSON.stringify({productId})
  }
 )

}