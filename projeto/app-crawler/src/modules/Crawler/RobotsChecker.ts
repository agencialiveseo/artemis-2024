import { axiosRequest } from '../../helpers/RequestAxios';
import { requestConfig } from '../../helpers/RequestConfig';
import { logger } from '../../core/Logger';
import robotsTester from 'robots-txt-guard';
import robotsParser from 'robots-txt-parse';

export async function robotsChecker(url: string): Promise<boolean> {
    try {
        // monta a url com /robots.txt desde a raiz do domínio
        const robotsUrl = new URL('/robots.txt', url).toString();

        // realiza a request para o robots.txt com os parâmetros pré-definidos (timeout, headers, etc)
        const robotsTxt = await axiosRequest(robotsUrl);
        
        if(!robotsTxt) {
            logger.info(`Não foi possível acessar robots.txt para ${url}`);
            return true; // Assume que é permitido
        }

        const robotsObject = await robotsParser(robotsTxt);

        const isAllowed = robotsTester(robotsObject).isAllowed;

        const urlPath = new URL(url).pathname;

        // verifica se nosso user-agent configurado tem permissão de acesso ao path urlPath. 
        const canCrawl = isAllowed(requestConfig.headers['User-Agent'], urlPath);

        if(!canCrawl) {
            logger.info(`A URL ${url} está bloqueada por robots.txt`);
            return false;
        }
        
        logger.info(`A URL ${url} está permitida por robots.txt`);
        return true;
    } catch (error) {
        logger.error(`Erro ao verificar robots.txt para ${url}:`, error);
        return true; // Falha no request ou processamento, assume que é permitido
    }
}
