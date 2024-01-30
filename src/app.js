import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import handlebars from 'express-handlebars';
import { createServer } from 'http';
import { Server } from 'socket.io';

//lOGIC
import ProductManager from './controllers/ProductManager.js';
import productsRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';
import viewsRouter from './routes/views.router.js';

const app = express()
const PORT = 8080
const httpServer = createServer(app);
// const io = new Server(httpServer);

// Obtén el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsFilePath = path.join(__dirname, '../models/products.json');
const productManager = new ProductManager(productsFilePath);

//MIDDLEWARES
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/', express.static(path.join(__dirname, '/public')));

//HANDLEBARS
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

//CONNECTION SOCKET.IO
const socketServer = new Server(httpServer)

//ROUTER ENDPOINTS
app.use('/', productsRouter);
app.use('/', cartRouter);
app.use('/', viewsRouter);

//ENDPOINTS
//Obtengo todos los productos atraves de home.handlebars
app.get('/', async (req, res) =>{
    let allProducts = await productManager.getProducts()
    res.render('home',{ page: 'Home', products: allProducts})
});


httpServer.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))