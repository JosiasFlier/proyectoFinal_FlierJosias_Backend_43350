import nodemailer from 'nodemailer'
import { NODEMAILER_PASS, NODEMAILER_USER } from '../utils.js'
import { logger } from "../logger.js"

export const getbillController = async (req, res) => {
    
    try {
        let config = {
            service: 'gmail',
            auth: {
                user: NODEMAILER_USER,
                pass: NODEMAILER_PASS
            }
        }
    
        logger.debug({config})
        let transporter = nodemailer.createTransport(config)
    
        logger.debug({transporter})
    
        let message = {
            from: NODEMAILER_USER,
            to: 'jaf973@hotmail.com',
            subject: 'Probando mail',
            html: 'Vas a terminar el proyecto'
        }
    
        logger.debug({message})
    
        transporter.sendMail(message)
            .then(() => res.status(201).json({ status: 'success' }))
            .catch(err => res.status(500).json({ err }));
    } catch (err) {
        logger.error(err.message)
    }
}

//Controller para el envio de email a las usuarios eliminadas por inactividad
export const accountDeletedDueToInactivity = async (emailsFromDeletedAccounts) => {
    try {
        let config = {
            service: 'gmail',
            auth: {
                user: NODEMAILER_USER,
                pass: NODEMAILER_PASS
            }
        }
        
        let transporter = nodemailer.createTransport(config);
    
        // Bucle para notificar a las cuentas eliminadas
        for (const email of emailsFromDeletedAccounts) {

            let message = {
                from: NODEMAILER_USER,
                to: email,
                subject: 'TODO LIBROS - Cuenta Eliminada',
                html: `<h1>${email}, su cuenta a sido eliminada por inactividad</h1>
                <hr>Podrá registrarse nuevamente en el siguiente link 
                <a href="http://localhost:8080/api/sessions/register" target="_blank">http://localhost:8080/api/sessions/register</a>
                <hr>
                Saludos cordiales<br>
                <b>TODO LIBROS</b>`
            };
            await transporter.sendMail(message);
        }

        return { status: 'success' };
    } catch (err) {
        logger.error(err.message)
        return { status: 'error', error: err.message };
    }
};

//Controller para el envio de email a los usuarios eliminados
export const accountDeleted = async (email) => {
    try {
        let config = {
            service: 'gmail',
            auth: {
                user: NODEMAILER_USER,
                pass: NODEMAILER_PASS
            }
        }
        
        let transporter = nodemailer.createTransport(config);
    
        let message = {
            from: NODEMAILER_USER,
            to: email,
            subject: 'TODO LIBROS - Cuenta Eliminada',
            html: `<h1>${email}, su cuenta a sido eliminada por cuestiones de seguridad</h1>
            <hr>Podrá registrarse nuevamente en el siguiente link 
            <a href="http://localhost:8080/api/sessions/register" target="_blank">http://localhost:8080/api/sessions/register</a>
            <hr>
            Saludos cordiales<br>
            <b>TODO LIBROS</b>`
        };
        await transporter.sendMail(message);


        return { status: 'success' };
    } catch (err) {
        logger.error(err.message)
        return { status: 'error', error: err.message };
    }
};


// Controller para el envio de mail a los usuarios que se les eliminio un producto del que eran dueños
export const deleteProductEmail = async (product, owner) => {
    try {
        let config = {
            service: 'gmail',
            auth: {
                user: NODEMAILER_USER,
                pass: NODEMAILER_PASS
            }
        }
        
        let transporter = nodemailer.createTransport(config);
    
        let message = {
            from: NODEMAILER_USER,
            to: owner,
            subject: 'TODO LIBROS - Producto eliminado',
            html: `<h1>${owner}, su Libro "${product.title}" a sido eliminado</h1>
            <img src="${product.thumbnails[0]}" alt="Imagen del libro ${product.title}" style="max-width: 300px;">
            <hr>Disculpe las molestias
            <hr>
            Saludos cordiales<br>
            <b>TODO LIBROS</b>`
        };
        await transporter.sendMail(message);


        return { status: 'success' };
    } catch (err) {
        logger.error(err.message)
        return { status: 'error', error: err.message };
    }
};