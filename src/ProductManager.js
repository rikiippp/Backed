const fs = require('fs').promises;

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = [];
        this.loadProducts();
    }

    async loadProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            this.products = JSON.parse(data);
        } catch (error) {
            console.error('Error al cargar productos desde el archivo:', error.message);
        }
    }

    async getProducts() {
        await this.loadProducts();
        return this.products;
    }

    async getProductById(productId) {
        await this.loadProducts();
        const product = this.products.find(p => p.id === productId);
        if (!product) {
            console.log(`\nNo se encontró un producto con ID ${productId}`);
            return null;
        }

        console.log(`\n¡Producto encontrado con ID ${productId}!`);
        console.log(product);

        return product;
    }
}

module.exports = ProductManager;
