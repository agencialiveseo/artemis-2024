# Configurando o Módulo de Crawler com Socket

Agora, vamos continuar a configuração do projeto NestJS, focando agora na implementação do módulo de **Crawler**. Este módulo será responsável por lidar com requisições de crawling de URLs, interagir com o sistema de mensagens **NATS** e utilizar **WebSockets** para comunicação em tempo real com os clientes. Ao final, você terá um módulo de Crawler funcional, integrado com o módulo de Account e com suporte a WebSockets.

## Passo 7: Implementando o Módulo de Crawler

O módulo de Crawler permitirá que os usuários autenticados solicitem a extração de dados de URLs específicas. O serviço enviará essas requisições através do NATS e receberá atualizações de status. Além disso, utilizará o Socket.IO para notificar os clientes sobre o progresso das tarefas.

### Instalando Dependências do Projeto

Navegue até o diretório do projeto:

```bash
cd app-api
```

Instale as seguintes dependências:

- **nats**: Biblioteca para trabalhar com o NATS (sistema de mensagens).

Instale as dependências:

```bash
npm install nats
```

### 7.1: Gerando o Módulo e Componentes

Vamos começar gerando o módulo, controlador e serviço para o Crawler:

```bash
nest generate resource modules/crawler --no-spec
```

### 7.2: Definindo Tipos para o Crawler

Crie o arquivo `src/modules/crawler/crawler.types.ts` para definir os tipos utilizados no módulo:

```typescript
export type CrawlerStart = { 
    url: string; 
    userId: number;
};

export type CrawlerList = {
    id: number;
    url: string;
    status: string;
    createdAt: Date;
};

export type CrawlerStatusUpdate = { 
    topic: string; 
    data: any;
};
```

### 7.3: Implementando o Serviço do Crawler

Edite o arquivo `src/modules/crawler/crawler.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { NatsService } from '../../common/nats/nats.service';
import { SocketGateway } from '../../common/socket/socket.gateway';
import { Crawler, User } from '@prisma/client';
import { CrawlerStart, CrawlerList, CrawlerStatusUpdate } from './crawler.types';

@Injectable()
export class CrawlerService {
  constructor(
    private readonly prisma: PrismaService, 
    private readonly natsService: NatsService,
    private readonly socketGateway: SocketGateway,
  ) {}

  async requestData({ url, userId }: CrawlerStart): Promise<Crawler> {
    const crawler = await this.prisma.crawler.create({
      data: { 
        url, 
        status: "PENDING", 
        userId,
      },
    });

    // Envia evento para o NATS
    this.natsService.publish('CRAWLER.REQUEST', { url, id: crawler.id });
    return crawler;
  }

  async getAllCrawlers({ userId } : { userId: number }) : Promise<CrawlerList[]> {
    return this.prisma.crawler.findMany({ 
      where: { userId },
      select: {
        id: true,
        url: true,
        status: true,
        createdAt: true,
      },
    });
  }

  async getCrawlerDetails({ id } : { id: number } ) : Promise<Crawler> {
    return this.prisma.crawler.findFirst({
      where: { 
        id
      },
    });
  }

  async deleteCrawler({ id } : { id: number}) : Promise<Crawler> {
    return this.prisma.crawler.delete({ 
      where: { 
        id
      } 
    });
  }

  async parseCrawlerStatus({ topic, data } : CrawlerStatusUpdate) : Promise<void> {
    console.log('Mensagem NATS recebida no tópico:', topic);
    console.log('Dados recebidos:', data);

    const { id, extractedData } = data;
    // pega o último item do tópico para saber o status
    const status = topic.split('.').pop() as CrawlerStatus;

    // Atualiza o status do Crawler
    await this.prisma.crawler.update({
      where: { id },
      data: { 
        status,
        data: extractedData.data.title
      },
    });

    await this.socketGateway.sendMessage(crawler.user_id, "CRAWLER.UPDATE", {id, status});
  }
}
```

**Explicação dos métodos:**

- **requestData**: Cria um novo registro de crawler no banco de dados com status "PENDING", publica uma mensagem no NATS para iniciar o processo de crawling e retorna o registro criado.

- **getAllCrawlers**: Retorna uma lista de todos os crawlers pertencentes ao usuário autenticado.

- **getCrawlerDetails**: Retorna os detalhes de um crawler específico, validando se pertence ao usuário.

- **deleteCrawler**: Remove um crawler específico pertencente ao usuário.

- **parseCrawlerStatus**: Processa mensagens recebidas do NATS, atualiza o status do crawler no banco de dados e envia uma notificação via WebSocket para o cliente.

### 7.4: Implementando o Controlador do Crawler

Edite o arquivo `src/modules/crawler/crawler.controller.ts`:

```typescript
import { Controller, Post, Get, Delete, Param, Body, Req } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { Ctx, MessagePattern, NatsContext, Payload } from '@nestjs/microservices';

@Controller('crawler')
export class CrawlerController {
  constructor(
    private readonly crawlerService: CrawlerService,
  ) {}

  @Post()
  async requestData(@Body() data: { url: string }, @Req() req) {
    return await this.crawlerService.requestData({
      url: data.url,
      userId: req.userId
    });
  }

  @Get()
  async getAll(@Req() req) {
    return await this.crawlerService.getAllCrawlers({ 
      userId: req?.userId
    });
  }

  @Get(':id')
  async getDetails(@Param('id') id: string, @Req() req) {
    return await this.crawlerService.getCrawlerDetails({ 
      id: +id 
    });
  }

  @Delete(':id')
  async deleteCrawler(@Param('id') id: string, @Req() req) {
    return await this.crawlerService.deleteCrawler({
      id: +id
    });
  }

  // Escuta mensagens NATS no padrão CRAWLER.REQUEST.*
  @MessagePattern('CRAWLER.REQUEST.*')
  async CrawlerRequestResponse(@Payload() data: any, @Ctx() context: NatsContext) {
    // Obtém o tópico NATS que disparou a mensagem Ex.: CRAWLER.REQUEST.DONE
    const topic = context.getSubject(); 

    await this.crawlerService.parseCrawlerStatus({ topic, data });
  }
}
```

**Explicação das rotas:**

- **POST /crawler**: Inicia uma nova requisição de crawling para a URL fornecida pelo usuário autenticado.

- **GET /crawler**: Retorna todas as requisições de crawling do usuário.

- **GET /crawler/:id**: Retorna os detalhes de uma requisição específica.

- **DELETE /crawler/:id**: Remove uma requisição de crawling específica.

**Explicação do MessagePattern:**

- O método **crawlerResponseHandler** escuta mensagens do NATS com o padrão `CRAWLER.RESPONSE.*`, permitindo que o serviço receba atualizações de status das tarefas de crawling.

### 7.5: Configurando o Módulo de Crawler

Edite o arquivo `src/modules/crawler/crawler.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { CrawlerController } from './crawler.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { NatsModule } from '../../common/nats/nats.module';
import { SocketModule } from '../../common/socket/socket.module';

@Module({
  imports: [
    PrismaModule,
    NatsModule,
    SocketModule,
  ],
  providers: [CrawlerService],
  controllers: [CrawlerController],
})
export class CrawlerModule {}
```

**Explicação:**

- Importamos os módulos `PrismaModule`, `NatsModule` e `SocketModule` para que o serviço de crawler possa interagir com o banco de dados, o NATS e o Socket.IO.

### 7.6: Implementando o Modelo do Crawler no Prisma

Edite o arquivo `prisma/schema.prisma` para adicionar o modelo `Crawler`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  password  String
  crawlers  Crawler[]
}

model Crawler {
  id        Int           @id @default(autoincrement())
  user_id   Int
  url       String
  status    CrawlerStatus @default(PENDING)
  data      String?       @db.Text
  createdAt DateTime      @default(now())
  user      User          @relation(fields: [user_id], references: [id])
  @@index([user_id])
}

enum CrawlerStatus {
  PENDING
  DONE
  ERROR
}
```

**Explicação:**

- Definimos um relacionamento entre `User` e `Crawler`, onde um usuário pode ter múltiplos crawlers.
- O campo `status` representa o estado atual da requisição de crawling (e.g., PENDING, ERROR, DONE).

### 7.7: Atualizando o Cliente Prisma

Após modificar o esquema, precisamos atualizar o cliente Prisma:

```bash
npx prisma generate
```

Além disso, precisamos aplicar as migrações ao banco de dados:

```bash
npx prisma migrate dev --name add_crawler_model
```

### 7.8: Implementando o NatsModule e NatsService

Crie o módulo e serviço para interagir com o NATS.

**Crie o arquivo `src/common/nats/nats.module.ts`:**

```typescript
import { Module } from '@nestjs/common';
import { NatsService } from './nats.service';

@Module({
  providers: [NatsService],
  exports: [NatsService],
})
export class NatsModule {}
```

**Crie o arquivo `src/common/nats/nats.service.ts`:**

```typescript
import { Injectable } from '@nestjs/common';
import { connect, JSONCodec, NatsConnection } from 'nats';
import { natsOptions } from '../../config/general';

@Injectable()
export class NatsService {
  private natsClient: NatsConnection;
  private codec = JSONCodec();

  constructor() {
    this.initialize();
  }

  async initialize(): Promise<void> {
    if (!natsOptions.options?.servers || natsOptions.options?.servers.length === 0) {
      throw new Error('NATS servers not configured');
    }

    this.natsClient = await connect(natsOptions.options);
  }

  publish(subject: string, data: any): void {
    try {
      this.natsClient.publish(subject, this.codec.encode(data));
    } catch (e) {
      console.error('Failed to publish message to NATS', e);
    }
  }
}
```

**Explicação:**

- O `NatsService` estabelece uma conexão com o servidor NATS e fornece um método `publish` para enviar mensagens.

- Utiliza `JSONCodec` para codificar e decodificar mensagens em JSON.

### 7.9: Configurando o NATS

Edite o arquivo `src/config/general.ts` para adicionar as configurações do NATS:

```typescript
import { Transport } from '@nestjs/microservices';

export const natsOptions = {
  transport: Transport.NATS,
  options: {
    servers: process.env.NATS_SERVERS?.split(',') || ['nats://localhost:4222'],
  },
};
```

**Explicação:**

- A configuração `natsOptions` define como o NestJS deve se conectar ao servidor NATS.

- As URLs dos servidores NATS são obtidas da variável de ambiente `NATS_SERVERS`.

### 7.10: Configurando o Socket.IO

#### 7.10.1: Criando o SocketGateway

Crie o arquivo `src/common/socket/socket.gateway.ts`:

```typescript
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/crawler',
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(socket: Socket) {
    const token = socket.handshake.headers.authorization?.split(' ')[1];

    if (token) {
      try {
        // Verifica o JWT e extrai o userId
        const payload = this.jwtService.verify(token);
        const userId = payload.userId;

        // Adiciona o socket à sala correspondente ao userId
        socket.join(`user_${userId}`);

        console.log(`Usuário ${userId} conectado, socket ID: ${socket.id}`);
      } catch (error) {
        console.log('Conexão não autorizada:', error);
        socket.disconnect();
      }
    } else {
      socket.disconnect(); // Desconecta se não houver token
    }
  }

  async handleDisconnect(socket: Socket) {
    console.log(`Socket desconectado, ID: ${socket.id}`);
  }

  async sendMessage(userId: number, message: string, data: any): Promise<void> {
    this.server.to(`user_${userId}`).emit(message, data);
  }
}
```

**Explicação:**

- O `SocketGateway` gerencia as conexões WebSocket.

- No método `handleConnection`, verifica o token JWT enviado no handshake, autentica o usuário e o adiciona a uma sala específica (`user_{userId}`).

- O método `sendMessage` permite enviar mensagens para um usuário específico através da sala.

#### 7.10.2: Criando o SocketModule

Crie o arquivo `src/common/socket/socket.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';

@Module({
  providers: [SocketGateway],
  exports: [SocketGateway],
})
export class SocketModule {}
```

**Explicação:**

- O `SocketModule` importa o `JwtModule` para que o `SocketGateway` possa verificar os tokens JWT.

- Exporta o `SocketGateway` para ser usado em outros módulos.

### 7.11: Configurando o AppModule

Edite o arquivo `src/app.module.ts` para incluir os módulos `CrawlerModule`, `NatsModule` e `SocketModule`:

```typescript
import { Module } from '@nestjs/common';
import { AccountModule } from './modules/account/account.module';
import { CrawlerModule } from './modules/crawler/crawler.module';
import { PrismaModule } from './common/prisma/prisma.module';

@Module({
  imports: [
    AccountModule,
    CrawlerModule,
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    })
  ],
})
export class AppModule {}
```

### 7.12: Configurando o Microserviço NATS no Main

Edite o arquivo `src/main.ts` para conectar o microserviço NATS:

```typescript
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { natsOptions } from './config/general';
import { MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS globalmente
  app.enableCors({
    origin: '*',
  });

  // Conectar o microserviço NATS
  app.connectMicroservice(natsOptions as MicroserviceOptions);

  // Iniciar o microserviço NATS
  await app.startAllMicroservices();

  // Iniciar a aplicação HTTP
  await app.listen(3000);
}
bootstrap();
```

**Explicação:**

- Conectamos o microserviço NATS utilizando as configurações definidas anteriormente.

- Iniciamos todos os microserviços antes de iniciar o servidor HTTP.

### 7.13: Testando o Módulo de Crawler

#### 7.13.1: Iniciando o Servidor NATS

Certifique-se de seu docker-compose esteja rodando com o serviço do nats e mysql. Caso não esteja, navegue até a pasta do docker-compose e execute o comando:

```bash
docker-compose up -d
```

#### 7.13.2: Solicitando uma Nova Requisição de Crawling

Faça uma requisição `POST` para `http://localhost:3000/crawler` com o corpo:

```json
{
  "url": "https://example.com"
}
```

Certifique-se de incluir o header `Authorization: Bearer <token>` com o token obtido ao fazer login.

Resposta esperada:

```json
{
  "id": 1,
  "url": "https://example.com",
  "status": "PENDING",
  "userId": 1,
  "createdAt": "2023-10-05T12:00:00.000Z"
}
```

#### 7.13.3: Recebendo Atualizações via WebSocket

Conecte-se ao namespace `/crawler` do servidor WebSocket em `http://localhost:3000` usando uma ferramenta como o [Socket.IO Client](https://socket.io/docs/v4/client-api/).

No handshake, inclua o header `Authorization: Bearer <token>`.

Você deverá receber mensagens com o evento `CRAWLER.UPDATE` no WebSocket conforme o status da sua requisição muda.

---

## Navegar pelo Projeto

- [Apresentação do projeto](../README.md)
- **Módulo 1**: [Arquitetura da Aplicação](../dia1/README.md)
- **Módulo 2**: [Introdução ao Docker](../dia2/README.md)
- **Módulo 3**: [MySQL Básico](../dia3/README.md)
- **Módulo 4**: [NATS e Mensageria](../dia4/README.md)
- **Módulo 5**: [Introdução ao TypeScript com Projeto Prático](../dia5/README.md)
- **Módulo 6**: [Introdução ao NestJS e Criação do Gateway](../dia6/README.md)
- **Módulo 7**: [Aplicação de API com NestJS e NATS](./README.md)
- - [Módulo de Account](./README-Account.md)
- - Módulo de Crawler *(Você está aqui)*
- **Módulo 8**: [Frontend com VueJS e](../dia8/README.md)
