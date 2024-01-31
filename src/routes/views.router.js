import express from 'express';
import path from 'path';
import __dirname from '../utils.js';
import ProductManager from '../controllers/ProductManager.js';

const productsFilePath = path.join(__dirname, '../models/products.json');
const productManager = new ProductManager(productsFilePath);


const router = express.Router()

router.get('/realtimeproducts', async (req, res) => {
    let allProducts = await productManager.getProducts()
    res.render('realTimeProducts', { page: 'Real-Time Products', products: allProducts });
});

// router.post('/realtimeproducts', async (req, res) => {
//     // Lógica para añadir un producto usando el formulario del cliente
//     const { title, description, code, price, stock, category } = req.body;
//     const newProduct = { title, description, code, price, stock, category };

//     // Añadir el nuevo producto
//     await productManager.addProduct(newProduct);

//     // Emitir la actualización a través de WebSockets
//     io.emit('update-products', await productManager.getProducts());

//     res.redirect('/realtimeproducts');
// });

export default router
