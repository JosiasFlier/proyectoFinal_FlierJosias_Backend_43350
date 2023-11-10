import { CartService } from "../services/carts.service.js";
import { ProductService } from "../services/products.service.js";

// Función para obtener un carrito por su ID
const getCartById = async (id) => {
    return await CartService.getById(id)
};


//Traer todos los carritos
export const getCartsController = async (req, res) => {
    try {
        const carts = await CartService.getAll()
        res.status(200).json(carts);
    } catch (error) {
        console.log("Error al obtener los carritos:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
}

//Traer un carrito por su ID
export const getCartByIdController = async (req, res) => {
    try {
        
        const cartId = req.params.cid; // Obtener ID del carrito
        const cart = await getCartById(cartId)

        if (!cart) {
            res.status(404).json({ error: "Carrito no encontrado" });
            return;
        }

        res.status(200).json({ status: "Success", payload: cart });
    } catch (err) {
        console.log("Error en el carrito:", err);
        res.status(500).json({ error: "Error en el servidor" });
    }
}

// Crear un nuevo carrito
export const createNewCartController = async (req, res) => {
    try {
        const newCart = await CartService.create({ products: [] });
        res.status(201).json({ status: "Success", payload: newCart });
    } catch (err) {
        console.log("Error al crear el carrito", err);
        return res.status(500).json({ status: "Error", error: err.message });
    }
}

// Cargar productos al carrito
export const newProductForCartController = async (req, res) => {
    try {

        // Se obtiene los CID y PID
        const cartId = req.params.cid;
        const productId = req.params.pid;

        // Busca el carrito
        const cart = await getCartById(cartId);
        if (!cart)
            return res
                .status(404)
                .json({ error: `Carrito con ID: ${cartId} no encontrado` });

        // Busca el producto
        const product = await ProductService.getById(productId)
        if (!product)
            return res
                .status(404)
                .json({ error: `producto con ID: ${productId} no encontrado` });

        // Verifica si el producto ya existe en el carrito
        const productExistsInCart = await cart.products.findIndex((item) =>
            item.product.equals(productId)
        );

        // Si existe, le suma cantidad + 1, sino carga uno nuevo
        if (productExistsInCart !== -1) {
            cart.products[productExistsInCart].quantity += 1;
        } else {
            const newProduct = { product: productId, quantity: 1 };
            cart.products.push(newProduct);
        }

        // Guarda el carrito
        const result = await cart.save();
        res.status(201).json({ status: "success", payload: result });
    } catch (err) {
        console.log("Error al cargar productos al carrito", err);
        return res.status(500).json({ status: "Error", error: err.message });
    }
}

// Actualizar un carrito entero
export const updateCartController = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productsToUpdate = req.body; // Obtiene los productos a actualizar desde el cuerpo de la solicitud

        // Busca el carrito
        const cart = await getCartById(cartId)
        if (!cart) {
            return res
                .status(404)
                .json({ status: "error", message: "carrito no encontrado" });
        }

        // Actualiza los productos del carrito - y devuelve el producto actualizado (new: true)
        const cartUpdated = await CartService.update(cartId, { products: productsToUpdate } )


        res.status(200).json({
            status: "success",
            message: "Carrito actualizado correctamente",
            payload: cartUpdated,
        });
    } catch (err) {
        console.log("Error al actualizar el carrito", err);
        return res.status(500).json({ status: "Error", error: err.message });
    }

}

// Actualiza la cantidad dentro de un carrito
export const updateProductInCartController = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const { quantity } = req.body;

        console.log(quantity)

        // Se comprueba si "quantity" es un numero entero positivo
        if (!Number.isInteger(quantity) || quantity < 1) {
            res.status(400).json({ error: "Cantidad no valida" });
        }

        // Se busca y obtiene el carrito con el ID proporcionado
        const cart = await CartService.getByIdJSON(cartId)

        console.log(cart)

        // Si no se encuentra el carrito, se responde con un código de estado 404 y un mensaje de error.
        if (!cart) {
            res.status(404).json({ error: "Carrito no encontrado" });
            return;
        }

        console.log(productId)
        

        // Se busca el índice del producto en el array de productos dentro del carrito
        const existingProductIndex = cart.products.findIndex(
            (item) => item.product._id.toString() === productId
        );


        console.log(existingProductIndex)

        // Si no se encuentra el producto en el carrito, se responde con un código de estado 404 y un mensaje de error.
        if (existingProductIndex === -1) {
            res.status(404).json({
                error: "Producto no encontrado en el carrito",
            });
            return;
        }

        

        // Se actualiza la cantidad del producto en la posición correspondiente del array
        const updatedProducts = [...cart.products];

        console.log(updatedProducts)
        updatedProducts[existingProductIndex].quantity = quantity;


        // Se actualiza el carrito en la base de datos
        const result = await CartService.update(cartId, cart)

        // Se responde con un código de estado 200 y un mensaje de éxito
        res.status(200).json({
            status: "success",
            message: "Cantidad de producto actualizada correctamante",
            payload: result,
        });
    } catch (err) {
        console.log("Error al actualizar el carrito", err);
        return res.status(500).json({ status: "Error", error: err.message });
    }
}

// Vacia todo el carrito de compras
export const deleteCartController = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await getCartById(cartId)

        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        // Vaciar el array de productos del carrito
        const updatedCart = await CartService.delete(cartId)

        // Si no se puede actualizar el carrito, responder con error 500
        if (!updatedCart) {
            return res.status(500).json({ error: "Error al vaciar el carrito" });
        }

        res.status(200).json({
            status: "success",
            message: "Carrito vaciado satisfactoriamente",
            cart: updatedCart,
        });
    } catch (err) {
        console.log("Error al eliminar el carrito", err);
        return res.status(500).json({ status: "Error", error: err.message });
    }
}

// Elimina unn producto especifico (ID) del carrito
export const deleteProductInCartController = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid

        // Se busca y obtiene el carrito con el ID proporcionado
        const cart = await getCartById(cartId)

        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        // Se busca el índice del producto en el array de productos dentro del carrito
        // const existingProductIndex = cart.products.findIndex(
        //     (item) => item.product.toString() === productId
        // );
        const existingProductIndex = cart.products.findIndex(
            (item) => item.product._id.toString() === productId
        );


        // Si no se encuentra el producto en el carrito, se responde con un código de estado 404 y un mensaje de error.
        if (existingProductIndex === -1) {
            res.status(404).json({
                error: "Producto no encontrado en el carrito",
            });
            return;
        }

        // Filtrar los productos y mantener solo aquellos que no correspondan al ID del producto a eliminar
        // cart.products = cart.products.filter(
        //     (item) => !item.product.equals(productId)
        // );
        cart.products = cart.products.filter(
            (item) => item.product._id.toString() !== productId
        );

        // Actualizar directamente los productos del carrito en la base de datos
        const updatedCart = await CartService.deleteProduct(cartId, cart.products)

        return res.status(200).json({
            status: 'success',
            message: 'Producto eliminado del carrito satisfactoriamente',
            payload: updatedCart
        });
    } catch (err) {
        console.log("Error al eliminar el producto del carrito", err);
        return res.status(500).json({ status: "Error", error: err.message });
    }
}

export const purchaseController = async (req, res) => {
    try {
        const cartId = req.params.cid
        const cart = await CartService.getAllByIdPopulate(cartId)
        // console.log(cart)

        let totalAmount = 0 // Monto total
        const purchasedProducts = []; // Productos que se han comprado


        // Filtrar los productos que se pueden comprar y actualizar el monto total
        const unprocessedProducts = cart.products.filter(item => {
            const product = item.product;
            if (product.stock >= item.quantity) {
                product.stock -= item.quantity; // Actualizar stock del producto
                totalAmount += product.price * item.quantity; // Actualizar monto total
                purchasedProducts.push(item); // Agregar a los productos comprados
                return false; // Producto comprado y procesado
            }

            return true; // Producto no procesado
        });

        if (purchasedProducts.length === 0) return res.status(400).json({ error: 'No se pudo realizar ninguna compra' })

        // Actualizar los stocks de los productos comprados
        await Promise.all(purchasedProducts.map(async item => {
            const product = await ProductService.getById(item.product._id);
            product.stock -= item.quantity;
            await product.save();
        }));

        console.log(unprocessedProducts)
        console.log(totalAmount)
        console.log(purchasedProducts)


        return res.status(200).json({
            status: 'success',
            message: 'Carrito comprado prueba',
            payload: cart
        });
    } catch (err) {
        console.log('Error al finalizar la compra:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

