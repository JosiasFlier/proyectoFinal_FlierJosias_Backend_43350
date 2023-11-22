
const cartLink = document?.getElementById("cart");
const hrefValue = cartLink?.getAttribute("href");
const cartId = hrefValue?.match(/\/products\/carts\/(.+)/)[1];


//FUNCIONES PARA AGREGAR PRODUCTOS AL CARRITO
const addProductToCart = async (id, cartId) => {
    try {
        const res = await fetch(`/api/carts/${cartId}/products/${id}`, {
            method: "POST",
        });
        const result = await res.json();
        console.log(result.code)
        if (result.status === "error") {
            throw new Error(result.error);
        } else if (result.code === 1) {

            Toastify({
                text: "Es tu producto, no puedes agregarlo al carrito",
                duration: 4000,
                gravity: "top",
                position: "right",
                style: {
                    backgroundImage:
                        "linear-gradient(to right, #F2CB04, #F3A006)",
                    backgroundColor: "#F3A006",
                },
                onClick: function () {},
            }).showToast();
            
        } else {
            // Mostrar una notificación de éxito utilizando "Toastify"
            Toastify({
                text: "producto agregado con exito",
                duration: 3000,
                gravity: "top",
                position: "right",
                style: {
                    backgroundImage:
                        "linear-gradient(to right, #0AD100, #37B300)",
                    backgroundColor: "#37B300",
                },
                onClick: function () {},
            }).showToast();
        }
    } catch (err) {
        console.log(err.message);
    }
};


const addProductToCart2 = async (pid) => {
    try {
        const res = await fetch(`/api/carts/${cartId}/products/${pid}`, {
            method: "POST",
        });
        const result = await res.json();
        if (result.status === "error") {
            throw new Error(result.error);
        } else if (result.code === 1) {

            Toastify({
                text: "Es tu producto, no puedes agregarlo al carrito",
                duration: 4000,
                gravity: "top",
                position: "right",
                style: {
                    backgroundImage:
                        "linear-gradient(to right, #F2CB04, #F3A006)",
                    backgroundColor: "#F3A006",
                },
                onClick: function () {},
            }).showToast();
            
        } else {
            // Mostrar una notificación de éxito utilizando "Toastify"
            Toastify({
                text: "producto agregado con exito",
                duration: 3000,
                gravity: "top",
                position: "right",
                style: {
                    backgroundImage:
                        "linear-gradient(to right, #0AD100, #37B300)",
                    backgroundColor: "#37B300",
                },
                onClick: function () {},
            }).showToast();
        }
    } catch (err) {
        console.log(err.message);
    }
};