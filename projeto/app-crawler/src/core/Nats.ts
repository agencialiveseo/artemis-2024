import { connect, NatsConnection } from 'nats';
import { logger } from './Logger';

class NatsService {
    private connection: NatsConnection | null = null;

    async connect() {
        this.connection = await connect({ 
            servers: process.env.NATS_SERVERS?.split(",") || 'nats://localhost:4222' 
        });
        logger.info('Conexão NATS estabelecida.');
    }

    async sendMessage(subject: string, message: any) {
        if(!this.connection) {
            throw new Error('Conexão NATS não estabelecida.');
        }
        
        this.connection.publish(subject, JSON.stringify(message));
        logger.info(`Mensagem enviada para ${subject}.`);
    }

    disconnect() {
        if (this.connection) {
            this.connection.close();
            logger.info('Conexão NATS encerrada.');
        }
    }
}

// Retornamos uma instância única da classe
export const natsService = new NatsService();
