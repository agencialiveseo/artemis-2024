import { crawlerConfig } from '../@types/crawlerConfig.type';

export function Config() : crawlerConfig {
    
    if(!process.env.CRAWLER_CONFIG) {
        throw new Error('Variável de ambiente CRAWLER_CONFIG não definida.');
    }

    const crawlerConfig = JSON.parse(process.env.CRAWLER_CONFIG);

    if(!crawlerConfig.url) {
        throw new Error('Configuração inválida: URL não definida.');
    }

    if(!crawlerConfig.id) {
        throw new Error('Configuração inválida: ID não definido.');
    }

    return crawlerConfig;
}