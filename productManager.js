class ProductManager {
    constructor() {
        this.products = [];
        this.nextProductId = 1;
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        // Validación de campos obligatorios
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error("Error: Todos los campos son obligatorios");
            return null;
        }

        // Valida que el código no se repita
        if (this.products.some(product => product.code === code)) {
            console.error("Error: Código de producto repetido");
            return null;
        }

        const newProduct = {
            id: this.nextProductId++,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };

        this.products.push(newProduct);
        return newProduct;
    }

    getProducts() {
        return this.products;
    }

    getProductById(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) {
            return null;
        }
        return product;
    }
}

// Testing
const manager = new ProductManager();

// Verifica que inicialmente no haya productos
console.log("Productos iniciales:", manager.getProducts());

// Agrego un producto nuevo
const productAdded = manager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
const productAdded2 = manager.addProduct("product 2", "oadoasda", 100, "sin imagen", "1231313", 25);

// Verifico que el producto se haya agregado correctamente
console.log("Productos después de agregar:", manager.getProducts());

// Intento agregar un producto con el mismo código (debería arrojar un error)
const duplicateProduct = manager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
if (!duplicateProduct) {
    console.error("Error al agregar producto duplicado");
}

// Obtengo un producto por ID 
console.log("Producto encontrado por ID:", manager.getProductById(productAdded.id));

// Intento obtener un producto por un ID inexistente (debería arrojar un error)
const nonExistingProduct = manager.getProductById(999);
if (!nonExistingProduct) {
    console.error("Not Found");
}