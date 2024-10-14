import { puppeteerRequest } from '../../helpers/RequestPuppeteer';
import { requestResult } from '../../@types/requestResult.type';
import { logger } from '../../core/Logger';

/**
 * Makes a request to the given URL using Axios first, and if it fails, falls back to Puppeteer.
 * 
 * @param url - The URL to make the request to.
 * @returns A promise that resolves to either an Error or a requestResult.
 * @throws Will throw an error if both Axios and Puppeteer requests fail.
 */
export async function CrawlerRequest(url: string) : Promise<Error | requestResult> {
    try {
        // Podemos tentar usar Axios primeiro. Nesse exemplo, vamos executar apenas puppeteer
        // const axiosResponse = await axiosRequest(url);
        // if (axiosResponse) {
        //     return axiosResponse;
        // }
        
        // Se Axios falhar, tenta com Puppeteer
        const puppeteerResponse = await puppeteerRequest(url);
        return puppeteerResponse;
    } catch (error) {
        logger.error(`Erro ao fazer request para ${url}:`, error);
        throw error;
    }
}