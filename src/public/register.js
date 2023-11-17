document.addEventListener('DOMContentLoaded', () => {
    //Manejo del boton de registro
    const registerButton = document.getElementById('registerButton')

    registerButton.addEventListener('click', async () => {

        const first_name = document.getElementById('first_name').value
        const last_name = document.getElementById('last_name').value
        const email = document.getElementById('email').value
        const age = document.getElementById('age').value
        const password = document.getElementById('password').value
    
        try {
            const response = await fetch ('/api/sessions/register', {
                method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ first_name, last_name, email, age, password })
            })

            const data = await response.json()
            console.log(data)
        
            if(response.ok) {
                //Alerta de registro exitoso, 
                displayRegisterAlert(`${first_name} ${last_name}`)
                
            }

            // redireccionar a login
            setTimeout(() => {
                window.location.href = "/api/sessions/login" 
            }, 2500);


        } catch (err) {
            console.log(err.message);
            res.status(500).json({ status: 'error', message: err.message })
        }
    })

    //Boton para redirigir a login
    const loginButton = document.querySelector('#loginButton');
    loginButton.addEventListener('click', () => {
            window.location.href = '/api/sessions/login';
        })

})


//Alerta de registro exitoso
function displayRegisterAlert(name) {
    Swal.fire({
        title: name,
        html: '<p>Te has registrado con éxito</p>',
        icon: 'success'
    });
}

