import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import CartManager from '../controllers/CartManager.js';

// Ruta para acceder a mi cart.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cartsFilePath = path.join(__dirname, '..', 'models', 'carts.json');
const cartManager = new CartManager(cartsFilePath);

const router = express.Router();

router.post('/api/carts', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json({ message: 'Carrito creado exitosamente.', newCart });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al crear tu carrito.' });
    }
});

router.get('/api/carts/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cartProducts = await cartManager.getCart(cartId);
        res.json(cartProducts);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al encontrar el carrito' });
    }
});

router.post('/api/carts/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        const updatedCart = await cartManager.addProductToCart(cartId, productId);

        res.json(updatedCart);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

export default router;
