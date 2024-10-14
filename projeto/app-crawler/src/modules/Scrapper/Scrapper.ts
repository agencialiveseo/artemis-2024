import { logger } from "../../core/Logger";

export function Scrapper(html: string) : { success: boolean, data?: any, message?: string } {
    try {
        const title = html.match(/<title>(.*?)<\/title>/)?.[1];
        const description = html.match(/<meta name="description" content="(.*?)">/)?.[1];

        const data = {
            title,
            description,
        };

        return { success: true, data };
    } catch (error: any) {
        logger.error('Erro no serviço de scrapper:', error);
        return { success: false, message: error.message };
    }
}