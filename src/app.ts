import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import userRoutes from './routes/userRoutes'
import productRoutes from './routes/productRoutes'
import cartRoutes from './routes/cartRoutes'
import orderRoutes from './routes/orderRoutes'

export const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(cors({
 origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:5501', 'http://localhost:3000'],
 credentials: true
}))

app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/order', orderRoutes)

app.get('/', (req,res)=>{
 res.json({message:'API running'})
})

app.get('/favicon.ico', (req,res)=>{
 res.status(204).end()
})