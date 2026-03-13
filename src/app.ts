import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import userRoutes from './routes/userRoutes'
import productRoutes from './routes/productRoutes'
import cartRoutes from './routes/cartRoutes'
import orderRoutes from './routes/orderRoutes'

export const app = express()

app.use(cors())

app.use(express.json())
app.use(cookieParser())

app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/order', orderRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'API is running' })
})