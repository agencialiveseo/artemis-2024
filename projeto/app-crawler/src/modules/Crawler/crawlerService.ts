import { axiosRequest } from '../../helpers/RequestAxios';
import { puppeteerRequest } from '../../helpers/RequestPuppeteer';
import { logger } from '../../core/Logger';
import { requestResult } from '../../@types/requestResult.type';

export async function CrawlerRequest(url: string) : Promise<Error | requestResult> {
    try {
        // Tenta usar Axios primeiro
        const axiosResponse = await axiosRequest(url);
        if (axiosResponse) {
            return axiosResponse;
        }
        
        // Se Axios falhar, tenta com Puppeteer
        const puppeteerResponse = await puppeteerRequest(url);
        return puppeteerResponse;
    } catch (error) {
        logger.error(`Erro ao fazer request para ${url}:`, error);
        throw error;
    }
}
