import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { Transport } from "@nestjs/microservices";

// Definir opções de CORS
export const corsOptions: CorsOptions = {
    origin: '*', // Permitir apenas este domínio, utilize '*' para permitir todos ou 'http://localhost:3000' para permitir apenas o domínio http://localhost:3000
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Permite envio de cookies, se necessário
};

// Configuração do microserviço NATS
export const natsOptions = {
    transport: Transport.NATS,
    options: {
        name: 'app-api',
        servers: process.env.NATS_SERVERS.split(","),
    },
};
