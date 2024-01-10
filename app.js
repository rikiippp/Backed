const ProductManager = require('./productManager');

// Ruta del archivo a utilizar
const filePath = 'productos.json';

// Instancia de ProductManager
const manager = new ProductManager(filePath);

// Verifica que inicialmente no haya productos
console.log("Productos iniciales:", manager.getProducts());

// Agrego un producto nuevo
const productAdded = manager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);

if (productAdded !== null) {
    console.log("Productos después de agregar:", manager.getProducts());

    // Intento agregar un producto con el mismo código (debería arrojar un error)
    const duplicateProduct = manager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
    if (duplicateProduct === null) {
        console.error("Error al agregar producto duplicado");
    } else {
        console.log("Producto duplicado:", duplicateProduct);
    }

    // Obtengo un producto por ID
    const foundProduct = manager.getProductById(productAdded.id);
    if (foundProduct !== null) {
        console.log("Producto encontrado por ID:", foundProduct);
    } else {
        console.error("Producto no encontrado por ID");
    }

    // Intento obtener un producto por un ID inexistente (debería arrojar un error)
    const nonExistingProduct = manager.getProductById(999);
    if (!nonExistingProduct) {
        console.error("Not Found");
    }
} else {
    console.error("Error al agregar producto");
}
