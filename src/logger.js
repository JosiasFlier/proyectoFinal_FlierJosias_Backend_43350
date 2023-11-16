import winston from 'winston'
import { ENVIRONMENT } from "./utils.js";

//Personalizo los niveles del logger
const logLevels = {
    debug: 0,
    http: 1,
    info: 2,
    warning: 3,
    error: 4,
    fatal: 5
}

//Creo colores personalizados para el logger
const colors ={
    debug: 'white',
    http: 'green',
    info: 'blue',
    warning: 'yellow',
    error: 'magenta',
    fatal: 'red'
}
winston.addColors(colors)

const createLogger = env => {
    if (env == 'PROD'){ //Logger que se utiliza si esta en modo PRODUCCION
        return winston.createLogger({
            levels: logLevels,
            transports: [
                new winston.transports.File({
                    filename: './logs/errors.log',
                    level: 'fatal',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        // winston.format.colorize(),
                        winston.format.simple()
                    ),
                })
            ]
        })
    } else {
        return winston.createLogger({
            levels: logLevels,
            transports:[ //Logger que se utiliza si esta en modo DESARROLLO
                new winston.transports.Console({
                    level: 'fatal',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.colorize(),
                        winston.format.simple()
                    ),
                }),
                
            ]
        })
    }
}

const logger = createLogger(process.env.ENVIRONMENT)

export default logger