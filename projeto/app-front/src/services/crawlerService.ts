import { axiosInstance } from '@/services/apiService'

interface CreateResponse {
  id: number;
  url: string;
}

interface CrawlerList {
  crawlers: CreateResponse[];
}

interface CrawlerData {
  id: number;
  url: string;
  status: string;
  data: string;
}

interface CrawlerError {
  error: string;
}

export async function request(url: string): Promise<CreateResponse | CrawlerError> {
  try {
    const response = await axiosInstance.post<CreateResponse>('/crawler', { url })
    return response.data
  } catch (error) {
    throw new Error('Erro ao solicitar rastreio')
  }
}

export async function list(): Promise<CrawlerList | CrawlerError> {
  try {
    const response = await axiosInstance.get('/crawler')
    return response.data
  } catch (error) {
    throw new Error('Erro ao solicitar dados')
  }
}

export async function getData(id: number): Promise<CrawlerData | CrawlerError> {
  try {
    const response = await axiosInstance.get<CrawlerData>('/crawler/' + id)
    return response.data
  } catch (error) {
    //throw new Error('Erro ao solicitar dados do rastreio ' + id)
    console.error(error);
    return {
      error: 'Erro ao solicitar dados do rastreio ' + id
    };    
  }
}
    