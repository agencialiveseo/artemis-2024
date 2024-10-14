// Configuração base dos requests

export const requestConfig = {
    timeoutAxios: 5000,
    timeoutPuppeteer: 25000,
    headers: { 
        'User-Agent': 'CrawlerBotDemo',
        'Accept': 'text/html',
        'Accept-Encoding': 'gzip, deflate',
    },
}