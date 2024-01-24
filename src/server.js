import express from 'express'
import productsRoute from './routes/products.router.js'
import cartRouter from './routes/cart.router.js'

const server = express()
const PORT = 8080

//MIDDLEWARES
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

//ENDPOINTS
server.use('/', productsRoute);
server.use('/', cartRouter)




server.listen(PORT, () => console.log(`Servidor conectado correctamente con el puerto ${PORT}`))