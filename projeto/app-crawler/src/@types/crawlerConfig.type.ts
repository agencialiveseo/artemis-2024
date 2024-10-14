
export type crawlerConfig = {
    url: string,
    id: number,
    headers?: { [key: string]: string },
    axiosTimeout?: number,
    puppeteerTimeout?: number,
}