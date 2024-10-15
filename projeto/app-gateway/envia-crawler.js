const { connect, JSONCodec } = require('nats');
require("dotenv").config();

const natsOptions = {
  options: {
    servers: process.env.NATS_SERVERS.split(","), // Ajuste o servidor NATS conforme necessário
  },
};

async function main() {
  try {
    const natsClient = await connect(natsOptions.options);
    const codec = JSONCodec();

    // Dados de exemplo para publicação
    const url = 'https://google.com';
    const crawler = { id: 1 };

    // Publica a mensagem no tópico CRAWLER.REQUEST
    natsClient.publish('CRAWLER.REQUEST', codec.encode({ 
        url, 
        id: crawler.id 
    }));
    
    console.log('Mensagem publicada com sucesso');
    
    // Fecha a conexão após a publicação
    await natsClient.flush();
    natsClient.close();
  } catch (error) {
    console.error('Erro ao publicar mensagem no NATS:', error);
  }
}

main();
