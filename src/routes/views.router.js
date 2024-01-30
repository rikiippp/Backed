import express from 'express';
import path from 'path';
import __dirname from '../utils.js';
import ProductManager from '../controllers/ProductManager.js';

const productsFilePath = path.join(__dirname, '../models/products.json');
const productManager = new ProductManager(productsFilePath);


const router = express.Router()

// router.get('/realtimeproducts', async (req, res) => {
//     let allProducts = await productManager.getProducts();
//     res.render('realTimeProducts', {
//         page: 'Real-Time Products',
//         products: allProducts
//     });
// });

export default router