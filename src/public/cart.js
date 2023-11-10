//-----DEBUG---- VER CON SOCKET

const deleteProduct = async (id) => {

    const cartId = window.location.pathname.match(/\/products\/carts\/(.+)/)[1];
    try {
        const res = await fetch(`/api/carts/${cartId}/products/${id}`, { method: "DELETE" })
        const result = await res.json();

        console.log(result)
        if (result.status === "error") {
            throw new Error(result.error);
        } else {

            // Mostrar una notificación de éxito utilizando "Toastify"
            Toastify({
                text: "Producto eliminado del carrito",
                duration: 3000,
                gravity: "top",
                position: "right",
                style: {
                    background: "linear-gradient(to right, #FF0000, #FF2100)",
                },
                onClick: function () {},
            }).showToast();
        }
        
        //  Reload (Actualizar Carrito)
        setTimeout(() => {
            location.reload() 
        }, 1500);
        
        
    } catch (err) {
        console.log(err.message);
    }
}

const deleteCart = async () => {

    const cartId = window.location.pathname.match(/\/products\/carts\/(.+)/)[1];
    try {
        const res = await fetch(`/api/carts/${cartId}`, { method: "DELETE" })
        const result = await res.json();

        console.log(result)
        if (result.status === "error") {
            throw new Error(result.error);
        } else {

            // Mostrar una notificación de éxito utilizando "Toastify"
            Toastify({
                text: "Todos los productos eliminados",
                duration: 3000,
                gravity: "top",
                position: "right",
                style: {
                    background: "linear-gradient(to right, #FF0000, #FF2100)",
                },
                onClick: function () {},
            }).showToast();
        }
        
        //  Reload (Actualizar Carrito)
        setTimeout(() => {
            location.reload() 
        }, 1500);
        
        
    } catch (err) {
        console.log(err.message);
    }
}