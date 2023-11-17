

const form = document.getElementById("forgetPasswordForm");


form.addEventListener("submit", async (evt) => {
    evt.preventDefault();

    // Capturo el Email del formulario
    const email = document.querySelector("#email").value

    console.log({"Email desde JS": email})

    try {
        const response = await fetch("/api/sessions/forget-pass/recover-pass", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json()
        console.log(data)

        if (response.ok) {
            //Alerta de registro exitoso, 
            displayRecoverPassAlert(email)

        } else if (response.status === 404) {
            //Alerta de "usuario ya registrado"
            notRegisterAlert(email)
            // Redireccion a "Registro"
            setTimeout(() => {
                window.location.href = "/api/sessions/register" 
            }, 4000);
        } else {

        }


    } catch (error) {
        console.error("Error al enviar la solicitud:", error);
    }
})


//Alerta de email con restablecimiento de contraseña exitoso
function displayRecoverPassAlert(email) {
    Swal.fire({
        title: email,
        html: '<div><p>Revisa tu casilla de correo</p><p>Para restablecer contraseña</p></div>',
        icon: 'success'
    });
}

//Alerta de email no registrado
function notRegisterAlert(email) {
    Swal.fire({
        title: email,
        html: '<div><p>No estás registrado</p><p>Por favor completa el</p><p>FORMULARIO DE REGISTRO</p></div>',
        icon: 'warning'
    });
}

function errorAlert() {
    Swal.fire({
        title: 'ERROR',
        html: '<div><p>Error al querer restablecer</p><p>La contraseña</p></div>',
        icon: 'error'
    });
}