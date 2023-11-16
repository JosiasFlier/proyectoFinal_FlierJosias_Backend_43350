import winston from 'winston'

const logger = winston.createLogger({
    transports:[
        new winston.transports.Console({
            level: 'info',
            format: winston.format.simple(),
        }),
        new winston.transports.File({
            filename: './logs/errors.log',
            level: 'info',
            format: winston.format.simple(),
        })
    ]
})

export default logger