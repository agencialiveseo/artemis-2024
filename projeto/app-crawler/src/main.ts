import { AppCrawler } from './core/App';
import { logger } from './core/Logger';
import 'dotenv/config';

async function startApp() {
    
    // limita o tempo de execução da aplicação
    setTimeout(() => {
        logger.error('Tempo de execução excedido.', new Error("APPLICATION_TIMEOUT"));
        process.exit(1);
    }, 60000);

    await AppCrawler();
}

startApp();
