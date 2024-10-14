import axios from 'axios';
import { logger } from '../core/Logger';
import { requestResult } from '../@types/requestResult.type';
import { requestConfig } from './RequestConfig';

export async function axiosRequest(url: string) : Promise<requestResult> {
    try {
        const response = await axios.get(url, {
            timeout: requestConfig.timeoutAxios,
            headers: requestConfig.headers,
        });

        return response.data;
    } catch (error) {
        logger.error(`Axios request falhou para ${url}:`, error);
        return false;
    }
}
