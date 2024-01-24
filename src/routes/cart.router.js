import express from 'express';
import fs from 'fs/promises';
import ProductManager from '../ProductManager.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Construi la ruta al directorio 'src'
const srcDirectory = path.join(__dirname, '..');

// Construi la ruta al archivo 'carts.json y products.json' dentro de 'src'
const cartsFilePath = path.join(srcDirectory, 'carts.json');
const productsFilePath = path.join(srcDirectory, 'products.json')

const router = express.Router();


router.post('/api/carts', async (req, res) => {
    try {
        // Leo la base de datos del carrito
        const cartsData = await fs.readFile(cartsFilePath, 'utf-8');
        const carts = JSON.parse(cartsData);

        // Genero un id único para cada carrito (se me ocurrio una manera facil para algo sencillo)
        const generateCartID = Date.now().toString(30);

        // Crea el carrito
        const newCart = {
            id: generateCartID,
            products: []
        };

        // Agrega el carrito a la base de datos
        carts.push(newCart);

        // Guarda la base de datos actualizada
        await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));

        // Devuelvo una respuesta 
        res.status(201).json({ message: 'Carrito creado exitosamente.', newCart });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al crear tu carrito.' });
    }
});

router.get('/api/carts/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        // Leo la base de datos del carrito
        const cartsData = await fs.readFile(cartsFilePath, 'utf-8');
        const carts = JSON.parse(cartsData);
        //Busco el id solicitado
        const cart = carts.find(c => c.id === cartId)

        //Devuelvo las respuestas
        if (!cart) {
            return res.status(404).json({ error: `No se encontro un carrito con ID ${cartId}.` })
        }
        res.json(cart.products)


    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error al encontrar el carrito' })
    }

});

router.post('/api/carts/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        // Lee la base de datos de carritos desde el archivo JSON
        const cartsData = await fs.readFile(cartsFilePath, 'utf-8');
        const carts = JSON.parse(cartsData);

        // Busca el carrito por su id en la base de datos
        const cart = carts.find(c => c.id === cartId);

        // Si no se encuentra el carrito, devuelve un error
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        // Traigo los productos
        const productManager = new ProductManager(productsFilePath);

        // Verifico si el producto con la ID especificada existe en la base de datos
        const existingProduct = await productManager.getProductById(productId);

        if (!existingProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Verifica si ya existe el producto en el carrito
        const existingCartProduct = cart.products.find(p => p.productId === productId);

        // Si ya existe, le incrementa la cantidad
        if (existingCartProduct) {
            existingCartProduct.quantity += 1;
        } else {
            // Si no existe, lo agrega
            cart.products.push({
                productId: productId,
                quantity: 1
            });
        }

        // Guarda en la base de datos
        await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));

        // Devuelve la respuesta del carrito
        res.json(cart);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});




export default router 