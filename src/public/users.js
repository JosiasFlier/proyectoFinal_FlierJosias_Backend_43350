//FUNCION PARA ELIMINAR USUARIOS CON MAS DE 48 HS DE INACTIVIDAD
const removeInactiveUsers = async () => {
    try {
        const res = await fetch(`/api/users/inactiveUsers`, {
            method: "DELETE",
        });
        const result = await res.json();
        if (result.status === "error") {
            throw new Error(result.error);
        } else {

            displayUsersDeletedAlert()
            
            //  Reload (Actualizar usuarios activos)
            setTimeout(() => {
                location.reload() 
            }, 2500);
        }
    } catch (err) {
        console.log(err.message);
    }
};


//Alerta de usuarios inactivos eliminados
function displayUsersDeletedAlert() {
    Swal.fire({
        title: "Usuarios Inactivos Eliminados",
        icon: 'success'
    });
}

//ELIMINAR USUARIO DESDE EL PANEL DE USUARIOS
const deleteUser = async (uid) => {
    try {
        const res = await fetch(`/api/users/${uid}`, {
            method: "DELETE",
        });
        const result = await res.json();
        if (result.status === "error") {
            throw new Error(result.error);
        } else {

            // Mostrar una notificación de éxito utilizando "Toastify"
            Toastify({
                text: "Usuario eliminado",
                duration: 3000,
                gravity: "top",
                position: "right",
                style: {
                    background: "linear-gradient(to right, #FF0000, #FF2100)",
                },
                onClick: function () {},
            }).showToast();
            
            //  Reload (Actualizar usuarios activos)
            setTimeout(() => {
                location.reload() 
            }, 1000);
        }
    } catch (err) {
        console.log(err.message);
    }
};



//FUNCION PARA CONVERTIR A LOS USUARIOS EN PREMIUM
const makePremium = async (uid, email) => {
    try {
        const res = await fetch(`/api/users/premium/${uid}`, {
            method: "POST",
        });
        const result = await res.json();
        if (result.status === "error") {
            throw new Error(result.error);
        } else if (result.code === 1) {

            //Si el usuario ya es Admin o Premium
            notResetPassAlert(email)

        } else {

            //Alerta si se convirtió en premium
            displayMakePremiumAlert(email)
            
            //  Reload (Actualizar usuarios activos)
            setTimeout(() => {
                location.reload() 
            }, 2500);
        }
    } catch (err) {
        console.log(err.message);
    }
};


//Alerta de nuevo rol asignado
function displayMakePremiumAlert(email) {
    Swal.fire({
        title: email,
        html: "Ahora es Premium",
        icon: 'success'
    });
}

//Alerta de que el usuario ya es premium o admin
function notResetPassAlert(email) {
    Swal.fire({
        title: email,
        html: '<div><p>Ya es Admin o Premium</p></div>',
        icon: 'warning'
    });
}