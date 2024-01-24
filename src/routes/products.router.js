import express from 'express';
import ProductManager from "../ProductManager.js";

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Construi la ruta al directorio 'src'
const srcDirectory = path.join(__dirname, '..');

// Construi la ruta al archivo 'products.json' dentro de 'src'
const filePath = path.join(srcDirectory, 'products.json');
const productManager = new ProductManager(filePath);


const router = express.Router();

// ENDPOINTS
router.get('/api/products', async (req, res) => {
    try {
        let products = await productManager.getProducts();

        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        if (limit) {
            products = products.slice(0, limit);
        }
        // console.log(`\n** Productos Iniciales (con límite ${limit || 'ninguno'}) **`);
        // console.log(products);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

router.get('/api/products/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const product = await productManager.getProductById(productId);

        if (product) {
            // console.log(`\n** Producto encontrado con ID ${productId} **`);
            // console.log(product);
            res.json(product);
        } else {
            res.status(404).json({ error: `No se encontró un producto con ID ${productId}` });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

router.post('/api/products', async (req, res) => {
    try {
        const { title, description, code, price, stock, category } = req.body;

        // Verifico los campos ingresados
        if (!title || !description || !code || !category || typeof price !== 'number' || typeof stock !== 'number' || price <= 0 || stock <= 0) {
            res.status(400).json({ message: 'Campos obligatorios incompletos o inválidos. Asegúrate de completar todo correctamente.' });
            return; // Importante
        }

        // Traigo los productos actuales
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
            status: true, // Status es true por defecto
            category,
            stock,
            quantity: 1
        };

        await productManager.addProduct(newProduct);
        res.status(201).json({ message: 'Producto agregado correctamente', product: newProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al agregar el producto' });
    }
});

router.put('/api/products/:pid', async (req, res) => {
    try {
        const productID = parseInt(req.params.pid);
        const product = await productManager.getProductById(productID);

        if (product) {
            const { title, description, code, price, stock, category } = req.body;

            // Verifico los campos ingresados
            if (!title || !description || !code || !category || typeof price !== 'number' || typeof stock !== 'number' || price <= 0 || stock <= 0) {
                res.status(400).json({ message: 'Campos obligatorios incompletos o inválidos. Asegúrate de completar todo correctamente.' });
                return; // Importante
            }

            // Actualiza los campos del producto
            product.title = title;
            product.description = description;
            product.code = code;
            product.price = price;
            product.stock = stock;
            product.category = category;

            // Guarda la actualización
            await productManager.updateProduct(productID, product);

            res.json({ message: 'Producto actualizado correctamente', product });
        } else {
            res.status(404).json({ error: `No se encontró un producto con ID ${productID}` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

router.delete('/api/products/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);

        // Llama a la función deleteProduct para eliminar el producto
        await productManager.deleteProduct(productId);

        // Devuelve una respuesta exitosa al cliente
        res.json({ success: true, message: `Producto con ID ${productId} eliminado correctamente` });
    } catch (error) {
        // Devuelve un error al cliente en caso de problema
        console.error(error);
        res.status(500).json({ success: false, error: 'Error al eliminar el producto' });
    }
});

export default router;
