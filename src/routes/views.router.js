import express from 'express';
import path from 'path';
import __dirname from '../utils.js';
import { createServer } from 'http';
import { Server } from 'socket.io';

import ProductManager from '../controllers/ProductManager.js';

const productsFilePath = path.join(__dirname, '../models/products.json');
const productManager = new ProductManager(productsFilePath);


const router = express.Router()

const httpServer = createServer(router);
const io = new Server(httpServer);

router.get('/realtimeproducts', async (req, res) => {
    let allProducts = await productManager.getProducts()
    res.render('realTimeProducts', { page: 'Real-Time Products', products: allProducts });
});

io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado');

    socket.on('new-product', async ({ title, description, code, price, stock, category }) => {
        const newProduct = {
            id: Math.floor(Math.random() * 1000),
            title,
            description,
            code,
            price,
            stock,
            category,
        };

        // Añadir el nuevo producto
        await productManager.addProduct(newProduct);

        // Emitir la actualización a todos los clientes
        io.emit('update-products', await productManager.getProducts());
    });
});

router.post('/add-product', async (req, res) => {
    // Lógica para añadir un producto usando el formulario del cliente
    const { title, description, code, price, stock, category } = req.body;
    const newProduct = { title, description, code, price, stock, category };

    // Añadir el nuevo producto
    await productManager.addProduct(newProduct);

    // Emitir la actualización a través de WebSockets
    io.emit('update-products', await productManager.getProducts());

    res.redirect('/realtimeproducts');
});

export default router
