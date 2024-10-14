import { Crawler } from "../modules/Crawler/Crawler";
import { Scrapper } from "../modules/Scrapper/Scrapper";
import { natsService } from "./Nats";
import { Config } from "./Config";
import { logger } from "./Logger";

export async function AppCrawler(): Promise<void> {
    
    let crawlerConfig;
    try{
        // carrega configuração via ENV
        crawlerConfig = Config();
    } catch(e){
        logger.error('Erro ao carregar configuração:', e);
        return;
    }

    try {
        // Inicializa o NATS Service
        await natsService.connect();

        // Inicia o serviço de crawler e realiza request
        const html = await Crawler(crawlerConfig.url);

        if(!html.success){
            throw new Error(html.message);
        }

        // envia o html retornado para o serviço de scrapper
        const extractedData = await Scrapper(html.data);

        // monta o retorno num padrão
        const result = Object.assign({ 
            url: crawlerConfig.url,
            id: crawlerConfig.id,
            extractedData
        });

        logger.info('Resultado:' + JSON.stringify(result));

        // Envia o resultado via NATS
        await natsService.sendMessage(
            'CRAWLER.REQUEST.DONE', 
            result
        );

        logger.info('Aplicação finalizada com sucesso.');
    } catch (error) {
        logger.error('Erro na aplicação:', error);
        
        const result = Object.assign({ 
            url: crawlerConfig.url,
            id: crawlerConfig.id,
            error
        });

        natsService.sendMessage('CRAWLER.REQUEST.ERROR', result);
    } finally {
        natsService.disconnect();
        process.exit(0);
    }
}