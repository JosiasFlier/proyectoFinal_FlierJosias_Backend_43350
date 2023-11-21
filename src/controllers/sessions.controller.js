import UserDTO from "../dto/users.dto.js"
import userModel from "../models/user.model.js";
import userPasswordModel from "../models/user-password.model.js";
import logger from "../logger.js"
import { generateRandomString } from "../public/functions.js";
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer'
import { NODEMAILER_PASS, NODEMAILER_USER } from '../utils.js'

// Controlador para la vista de registro
export const userRegisterViewController = async (req, res) => {
    if (req.session.user) return res.redirect('/api/sessions/profile')
    res.render('register')
}

// Controlador para la vista de inicio de sesión
export const userLoginViewController = async (req, res) => {
    if (req.session.user) return res.redirect('/api/sessions/profile')
    res.render('login')
}

// Controlador para la vista del perfil de usuario
export const userProfileViewController = async (req, res) => {
    const userData = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
    }
    const userInfo = {
        cartId: req.session.user.cart,
        first_name: req.session.user.first_name,
        last_name: req.session.user.last_name,
        fullName: `${req.session.user.first_name} ${req.session.user.last_name}`,
        role: req.session.user.role
    }
    logger.info({userInfo})
    res.render('profile', {userData, userInfo})
}

// Controlador para cerrar sesión
export const userLogoutController = async (req, res) => {
    req.session.destroy((err) => {
        if (err) return logger.error(err.message) // Manejo de error más robusto requerido aquí
        res.redirect('/api/sessions/login')
    })
}

// Controlador para la autenticación de GitHub
export const githubcallbackController = async (req, res) => {
    // Guarda la información del usuario autenticado en la sesión
    req.session.user = req.user
    // Redirige al usuario a la página de productos
    res.redirect('/products')
}

// Controlador para el registro fallido
export const userFailRegisterController = async (req, res) => {
    res.send({ error: 'Failed to register' })
}

// Controlador para la ruta 'current'
export const currentController = async (req, res) => {
    if (!req.session.user) return res.status(401).json({ status: 'error', error: 'No session detected!' })
    const userData = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role
    }

    const userDTO = new UserDTO(userData)
    res.status(200).json({ status: 'success', payload: userDTO })
}

// Controlador para la solicitud POST de inicio de sesión
export const postLoginController = async (req, res) => {
    try {
        req.session.user = req.user;
        return res.status(200).json({ status: 'success', message: 'Sesión iniciada correctamente' })

    } catch (err) {
        logger.error("Error en el inicio de sesión", err);
        return res.status(500).json({ error: 'Error en el servidor.' });
    }
}

// Controlador para la solicitud POST de registro
export const postRegisterController = async (req, res) => {
    try {
        // El registro fue exitoso, y el usuario se encuentra en req.user
        const user = req.user;

        // Puedes acceder a la información del usuario desde 'user' y la información adicional que quieras agregar
        const first_name = user.first_name;
        const last_name = user.last_name;

        return res.status(201).json({ status: 'success', message: `${first_name} ${last_name}, se a registrado correctamente`, user: user })
    } catch (err) {
        logger.error(err.message);
        return res.status(500).json({ message: 'Error en el servidor.' });
    }
}

//Ruta de recuperacion de contraseña con envio de mail
export const recoverPassController = async (req, res) => {
    try {
        const email = req.body.email;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: 'error', error: 'User not found' });
        }

        const userName = user.first_name

        const token = generateRandomString(16); // Genero el token
        logger.debug(token);

        await userPasswordModel.create({ email, token }); // Creo el user-password

        // Configuración y envío de correo
        const mailerConfig = {
            service: 'gmail',
            auth: { user: NODEMAILER_USER, pass: NODEMAILER_PASS } // Asegúrate de que NODEMAILER_USER y NODEMAILER_PASS estén definidas
        };

        let transporter = nodemailer.createTransport(mailerConfig);
        let message = {
            from: NODEMAILER_USER,
            to: email,
            subject: 'TODO LIBROS - Restablecimiento de contraseña',
            html: `<h1>${userName}, restablezca su contraseña en TODO LIBROS</h1>
            <hr>Podrá crear una nueva contraseña en el siguiente link 
            <a href="http://localhost:8080/api/sessions/verify-token/${token}" target="_blank">http://localhost:8080/api/sessions/verify-token/${token}</a>
            <hr>
            <p>El enlace solo estará activo por 60 minutos</p>
            <hr>
            Saludos cordiales<br>
            <b>TODO LIBROS</b>`
        };

        await transporter.sendMail(message); //Envio de email
        return res.status(201).json({ status: 'success', message: `${email} se envió el correo de recuperación correctamente` });
    } catch (err) {
        logger.error(err.message);
        return res.status(500).json({ message: 'Error al intentar restablecer la contraseña.' });
    }
};

// Ruta para verificar si el token de recuperacion es valido
export const verifyTokenController = async (req, res) => {
    const userPassword = await userPasswordModel.findOne({ token : req.params.token})
    if (!userPassword) {
        return res.status(404).json({ status: 'error', error: 'Token no valido - El token expiró', message: 'Por favor, realize el proceso nuevamente'})
    }

    const user = userPassword.email
    res.render('resetPassword', { user })
}

//Ruta para restablecer la contraseña
export const resetPasswordController = async (req, res) => {
    try {
        const email = req.params.user
        console.log(email)
        const user = await userModel.findOne({ email: req.params.user })
        const newPassword = req.body.newPassword; //Obtengo la nueva contraseña desde el body

        //Comparo si la contraseña nueva, es igual a la anterior.
        const passwordsMatch = bcrypt.compareSync(newPassword, user.password);
        if (passwordsMatch) { return res.status(404).json({ status: 'error', message: 'Contraseña igual a la anterior' });}

        //Restablezco la contraseña
        await userModel.findByIdAndUpdate(user._id, { password: await bcrypt.hash(newPassword, 10) })

        //Elimino la userPassword ya utilizada
        await userPasswordModel.deleteOne({ email: email })

        return res.status(201).json({ status: 'success', message: 'Se ha restablecido la contraseña' })


    } catch (err) {
        logger.error(err.message);
        return res.status(500).json({ status: 'error', message: 'No se ha podido restablecer la contraseña' })
    }
}


// Controlador para obtener una lista de todos los usuarios
export const usersController = async (req, res) => {
    try {

        const allUsers = await userModel.find().lean().exec()
        const userInfo = {
            first_name: req.session.user.first_name,
            last_name: req.session.user.last_name,
            fullName: `${req.session.user.first_name} ${req.session.user.last_name}`,
            email: req.session.user.email,
            age: req.session.user.age,
            cartId: req.session.user.cart,
            role: req.session.user.role
        };
        res.render("users", { users: allUsers, userInfo });
    } catch (err) {
        logger.error("Error al obtener la lista de usuarios", err)
        res.status(500).json({ error: err });
    }
}