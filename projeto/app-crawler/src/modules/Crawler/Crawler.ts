import { robotsChecker } from './RobotsChecker';
import { CrawlerRequest } from './CrawlerRequest';
import { logger } from '../../core/Logger';

/**
 * Crawls the given URL and returns the result.
 *
 * @param url - The URL to crawl.
 * @returns A promise that resolves to an object containing the success status, 
 *          the crawled data if successful, and an optional message.
 *
 * @remarks
 * This function first checks if crawling the URL is allowed by the site's robots.txt file.
 * If crawling is not allowed, it logs an informational message and returns an object indicating failure.
 * If crawling is allowed, it attempts to fetch the data from the URL.
 * In case of an error during the crawling process, it logs the error and returns an object indicating failure.
 *
 * @example
 * ```typescript
 * const result = await Crawler('https://example.com');
 * if (result.success) {
 *     console.log('Crawled data:', result.data);
 * } else {
 *     console.log('Crawling failed:', result.message);
 * }
 * ```
 */
export async function Crawler(url: string) : Promise<{ success: boolean, data?: any, message?: string }> {
    try {
        const isAllowed = await robotsChecker(url);
        if (!isAllowed) {
            logger.info(`Robots.txt bloqueia a extração de ${url}`);
            return { 
                success: false, 
                message: 'Robots.txt bloqueia o acesso' 
            };
        }

        const data = await CrawlerRequest(url);
        return { success: true, data };
    } catch (error: any) {
        logger.error(`Erro no serviço de crawler para ${url}:`, error);
        return { 
            success: false, 
            message: error.message 
        };
    }
}
