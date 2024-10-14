const logger = {
    info: (message: string) => {
        console.log(`[INFO]: ${message}`);
    },
    error: (message: string, error: any) => {
        console.error(`[ERROR]: ${message}`, error);
    },
}

export { logger };

/* Ou, podemos utilizar uma ferramenta de log Winston, que é mais robusta e permite a configuração de logs em arquivos */
// import * as winston from 'winston';

// const logger = winston.createLogger({
//   level: 'info',
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.printf(({ timestamp, level, message }) => {
//       return `${timestamp} [${level.toUpperCase()}]: ${message}`;
//     })
//   ),
//   transports: [
//     new winston.transports.Console(),
//     new winston.transports.File({ filename: 'app.log' })
//   ],
// });