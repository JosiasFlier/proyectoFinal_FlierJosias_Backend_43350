
//Formulario para crear nueeva contraseña y manejo de alertas
const form = document.getElementById("resetPasswordForm");


form.addEventListener("submit", async (evt) => {
    evt.preventDefault();

    // Capturo el Email del formulario
    const newPassword = document.querySelector("#newPassword").value
    const user = document.querySelector("#userName").value

    try {
        const response = await fetch(`/api/sessions/reset-password/${user}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ newPassword }),
        });

        const data = await response.json()
        console.log(data)

        if (response.ok) {
            //Alerta de registro exitoso, 
            displayResetPassAlert(user)
            setTimeout(() => {
                window.location.href = "/api/sessions/login" 
            }, 4000);

        } else if (response.status === 404) {
            //Alerta de "usuario ya registrado"
            notResetPassAlert(user)
            // Redireccion a "Registro"
            
        } else {
            errorAlert(email)
        }


    } catch (error) {
        console.error("Error al enviar la solicitud:", error);
    }
})


//Alerta de email con restablecimiento de contraseña exitoso
function displayResetPassAlert(email) {
    Swal.fire({
        title: email,
        html: '<div><p>Contraseña restablecida</p><p>Por favor</p><p>Inicie sesión nuevamente</p></div>',
        icon: 'success'
    });
}

//Alerta de email no registrado
function notResetPassAlert(email) {
    Swal.fire({
        title: email,
        html: '<div><p>Contraseña igual a la anterior</p><p>Por favor</p><p>Elija otra</p></div>',
        icon: 'warning'
    });
}

// Alerta Error
function errorAlert() {
    Swal.fire({
        title: 'ERROR',
        html: '<div><p>Error al querer cambiar</p><p>La contraseña</p></div>',
        icon: 'error'
    });
}




