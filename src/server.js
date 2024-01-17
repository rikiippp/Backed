const express = require("express")
const ProductManager = require("./ProductManager.js")

const server = express()
const PORT = 8080

const filePath = 'C:\\Users\\usuario\\Desktop\\a\\Backend\\products.json';
const productManager = new ProductManager(filePath);

//ENDPOINTS
// Endpoint para obtener todos los productos con un límite opcional
server.get('/products', async (req, res) => {
    try {
        let products = await productManager.getProducts();

        // Aplicar el límite si se proporciona
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        if (limit) {
            products = products.slice(0, limit);
        }

        // Salida por consola 
        console.log(`\n** Productos Iniciales (con límite ${limit || 'ninguno'}) **`);
        console.log(products);

        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

// Endpoint para obtener un producto por ID
server.get('/products/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const product = await productManager.getProductById(productId);

        if (product) {
            // Salida por consola 
            console.log(`\n** Producto encontrado con ID ${productId} **`);
            console.log(product);

            res.json(product);
        } else {
            res.status(404).json({ error: `No se encontró un producto con ID ${productId}` });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

server.listen(PORT, () => console.log(`Servidor conectado correctamente con el puerto ${PORT}`))