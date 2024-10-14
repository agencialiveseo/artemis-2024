import puppeteer from 'puppeteer';
import { logger } from '../core/Logger';
import { requestResult } from '../@types/requestResult.type';

export async function puppeteerRequest(url: string) : Promise<requestResult> {
    try {
        // inicia o browser
        const browser = await puppeteer.launch({
            headless: process.env.ENVIRONMENT == "development" ? false : true,
            args: [
                '--no-sandbox', // como rodamos como root, precisamos desabilitar o sandbox
                '--disable-setuid-sandbox'
            ],
        });

        // abre uma nova página e retorna a instância
        const page = await browser.newPage();

        // acessa a url
        await page.goto(url, { 
            waitUntil: 'domcontentloaded',
            timeout: 5000, // Se a página demorar mais de 5s para carregar, dará throw e perderemos o conteúdo
        });

        // pega o conteúdo da página
        const content = await page.content();

        // fecha o browser
        await browser.close();

        return content;
    } catch (error) {
        logger.error(`Puppeteer request falhou para ${url}:`, error);
        return false;
    }
}
