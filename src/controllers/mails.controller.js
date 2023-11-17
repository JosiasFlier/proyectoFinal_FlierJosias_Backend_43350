import nodemailer from 'nodemailer'
import { NODEMAILER_PASS, NODEMAILER_USER } from '../utils.js'
import logger from '../logger.js'

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
        logger.error(err)
    }
}