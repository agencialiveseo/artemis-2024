import { Crawler } from "@prisma/client"

export type CrawlerStart = { 
    url: string, 
    userId: number
}

// exportamos um tipo de dados que não contém o campo 'data' e 'user_id'
export type CrawlerList = Omit<Crawler, 'data' | 'user_id'>

// para melhor nomenclatura, ao invés de DTO, 

export type CrawlerStatusUpdate = { 
    topic: string, 
    data: any 
}