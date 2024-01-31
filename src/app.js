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

// Obtén el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsFilePath = path.join(__dirname, 'models/products.json');
//MIDDLEWARES
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/', express.static(path.join(__dirname, '/public')));

//HANDLEBARS
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

//CONNECTION SOCKET.IO
const httpServer = createServer(app);
const io = new Server(httpServer);
const productManager = new ProductManager(productsFilePath, io)

httpServer.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))

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

io.on('connection', async (socket) => {
    console.log('Un usuario se ha conectado');

    socket.on('new-product', async ({ title, description, code, price, stock, category }) => {
        console.log('Recibido evento new-product');

        const currentProducts = await productManager.getProducts();

        // Saco el máximo id 
        const maxId = Math.max(...currentProducts.map(product => parseInt(product.id))) || 0;

        // Incremento el máximo id 
        const newProductId = maxId + 1;

        const newProduct = {
            id: newProductId,
            title,
            description,
            code,
            price,
            stock,
            category,
        };

        console.log('Nuevo producto:', newProduct);

        // Añado el producto
        await productManager.addProduct(newProduct);

        // Emitir la actualización a todos los clientes
        io.emit('update-products', await productManager.getProducts());
        console.log('Producto agregado y actualización enviada');
    });

    socket.on('delete-product', async (productId) => {
        console.log('Recibido evento delete-product:', productId);

        await productManager.deleteProduct(productId);
        io.emit('update-products', await productManager.getProducts());
        console.log('Producto eliminado y actualización enviada');
    });
});

app.post('/realtimeproducts', async (req, res) => {
    try {
        const { title, description, code, price, stock, category } = req.body;
        const newProduct = { title, description, code, price, stock, category };

        await productManager.addProduct(newProduct);

        // Emitir la actualización a través de websockets
        io.emit('update-products', await productManager.getProducts());

        res.redirect('/realtimeproducts');
    } catch (error) {
        console.error('Error al manejar la solicitud POST:', error.message);
        res.status(500).send('Server Error');
    }
});

