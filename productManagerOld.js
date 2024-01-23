const fs = require('fs').promises;

class ProductManager {
    constructor(filePath) {
        this.path = filePath; // La ruta del archivo donde voy a trabajar
        this.products = []; // Tengo mi listado de productos
        this.nextProductId = 1; // Tengo mi ID autoincrementable para los nuevos productos

        // Cuando creo la instancia, cargo los productos desde el archivo
        this.loadProducts();
    }

    // Método privado para cargar productos desde el archivo
    async loadProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            this.products = JSON.parse(data);

            // Actualizo el nextProductId en función de los productos que cargué
            if (this.products.length > 0) {
                const lastProduct = this.products[this.products.length - 1];
                this.nextProductId = lastProduct.id + 1;
            }
        } catch (error) {
            // Si hay un error al leer el archivo, no hago nada por ahora (se podría manejar de otra forma según los requerimientos)
            console.error('Error al cargar productos desde el archivo:', error.message);
        }
    }

    // Método privado para guardar productos en el archivo
    async saveProducts() {
        try {
            const data = JSON.stringify(this.products, null, 2);
            await fs.writeFile(this.path, data);
        } catch (error) {
            console.error('Error al guardar productos en el archivo:', error.message);
        }
    }

    // Método público asincrónico para agregar un producto
    async addProduct(title, description, price, thumbnail, code, stock) {
        try {
            // Valido que los campos obligatorios estén completos
            if (!title || !description || !price || !thumbnail || !code || !stock) {
                console.error("Error: Todos los campos son obligatorios");
                return null;
            }

            // Valido que el código no se repita
            if (this.products.some(product => product.code === code)) {
                console.error("Error: Código de producto repetido");
                return null;
            }

            const newProduct = {
                id: this.nextProductId++, // Asigno el nuevo ID y luego lo incremento
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            };

            this.products.push(newProduct);

            // Guardo los productos en el archivo después de agregar uno nuevo
            await this.saveProducts();

            console.log('\n¡Producto agregado con éxito!');
            console.log(newProduct);

            return newProduct;
        } catch (error) {
            console.error('Error al agregar producto:', error.message);
            return null;
        }
    }

    // Método público asincrónico para obtener productos
    async getProducts() {
        // Leo los productos desde el archivo antes de devolverlos
        await this.loadProducts();
        return this.products;
    }

    // Método público asincrónico para obtener un producto por ID
    async getProductById(productId) {
        // Leo los productos desde el archivo antes de buscar por ID
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

    // Método público asincrónico para actualizar un producto
    async updateProduct(productId, updatedProduct) {
        // Leo los productos desde el archivo antes de actualizar
        await this.loadProducts();
        const index = this.products.findIndex(p => p.id === productId);
        if (index !== -1) {
            // Actualizo el producto
            this.products[index] = { ...this.products[index], ...updatedProduct };
            // Guardo los productos en el archivo después de la actualización
            await this.saveProducts();

            console.log(`\n¡Producto actualizado con ID ${productId}!`);
            console.log(this.products[index]);

            return this.products[index];
        }
    }

    // Método público asincrónico para eliminar un producto
    async deleteProduct(productId) {
        // Leo los productos desde el archivo antes de eliminar
        await this.loadProducts();
        const index = this.products.findIndex(p => p.id === productId);
        if (index !== -1) {
            // Elimino el producto
            const deletedProduct = this.products.splice(index, 1)[0];
            // Guardo los productos en el archivo después de la eliminación
            await this.saveProducts();

            console.log(`\n¡Producto eliminado con ID ${productId}!`);
            console.log(deletedProduct);

            return deletedProduct;
        }

        console.log(`\nNo se encontró un producto con ID ${productId} para eliminar`);
        return null;
    }
}

// Exporto la clase para poder usarla en otros archivos
module.exports = ProductManager;

// Ejemplo de uso y prueba
const filePath = 'productos.json';  // La ruta del archivo que voy a utilizar
const manager = new ProductManager(filePath);

// Verifico que inicialmente no haya productos
(async () => {
    console.log('\n** Productos Iniciales **');
    console.log(await manager.getProducts());

    // Agrego un producto nuevo
    const productAdded = await manager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);

    if (productAdded !== null) {
        console.log('\n** Productos Después de Agregar **');
        console.log(await manager.getProducts());

        // Intento agregar un producto con el mismo código (debería arrojar un error)
        const duplicateProduct = await manager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
        if (duplicateProduct === null) {
            console.error("\nError al agregar producto duplicado");
        } else {
            console.log('\n** Producto Duplicado **');
            console.log(duplicateProduct);
        }

        // Obtengo un producto por ID
        await manager.getProductById(productAdded.id);

        // Intento obtener un producto por un ID inexistente (debería arrojar un error)
        await manager.getProductById(999);
    } else {
        console.error("\nError al agregar producto");
    }
})();