### Módulo 6: Introdução ao NestJS com Projeto Prático

#### 1. **Introdução**

Neste módulo, vamos criar uma aplicação prática utilizando o **NestJS**, um framework Node.js para a construção de aplicativos do lado do servidor eficientes, escaláveis e que seguem o padrão de arquitetura **Modular**. Vamos configurar o ambiente, instalar as dependências e desenvolver uma aplicação com NestJS, enfatizando as boas práticas.

---

#### 1.1. **O Que é NestJS**

**NestJS** é um framework para construção de aplicações Node.js no lado do servidor utilizando o TypeScript. Ele combina elementos de **Express** e **TypeScript**, oferecendo suporte à programação orientada a objetos, programação funcional e programação reativa.

Principais características:
- **Modularidade**: Aplicações divididas em módulos.
- **Injeção de Dependência**: Facilita o gerenciamento e reutilização de dependências.
- **Fortemente Tipado**: Usa as vantagens de tipagem estática do TypeScript.
- **Fácil Integração com Outras Bibliotecas**: Suporte nativo a bibliotecas populares como TypeORM, Mongoose, etc.

---

#### 1.2. **Por Que Utilizar NestJS**

- **Escalabilidade**: Estrutura modular facilita o crescimento da aplicação.
- **Manutenibilidade**: Código organizado e modular.
- **Comunidade Ativa**: Com grande adoção, possui diversas ferramentas e pacotes.
- **Fortemente Tipado**: O TypeScript permite uma melhor manutenibilidade e suporte ao autocompletar.

---

#### 2. **Iniciando o Projeto NestJS**

#### Passo a Passo

1. **Instalando o CLI do NestJS**

   O NestJS fornece um CLI para facilitar a criação de novos projetos e a geração de módulos, controladores e serviços.

   Execute o comando:

   ```bash
   npm install -g @nestjs/cli
   ```

2. **Criando um Novo Projeto NestJS**

   Crie um novo diretório para o projeto e inicialize com o comando:

   ```bash
   nest new pasta_do_projeto
   ```

   Ou, para criar um projeto na pasta atual:

   ```bash
    nest new .
    ```

    Selecione o gerenciador de pacotes de sua preferencia. Neste projeto, usaremos o `npm`.

    ```bash
    ? Which package manager would you ❤️ to use? npm
    ```

3. **Inicializando o Repositório e as Dependências**

   O CLI do NestJS irá instalar automaticamente as dependências e criar a estrutura básica do projeto, contendo pastas para módulos, controladores e serviços.

---

#### 3. **Estrutura do Projeto NestJS**

Após a criação do projeto, a estrutura básica será semelhante a:

```
app-gateway/
├── node_modules/
├── src/
│   ├── app.module.ts
│   ├── app.service.ts
|   ├── app.controller.ts
|   ├── app.controller.spec.ts
│   ├── main.ts
├── nest-cli.json
├── package.json
├── tsconfig.build.json
├── tsconfig.json
```

**Descrição de cada item**:
- **src/**: Contém todo o código-fonte.
  - **app.module.ts**: Módulo principal da aplicação.
  - **app.service.ts**: Serviço principal da aplicação.
  - **app.controller.ts**: Controlador principal da aplicação.
  - **app.controller.spec.ts**: Testes unitários para o controlador.
  - **main.ts**: Ponto de entrada da aplicação.
- **nest-cli.json**: Configurações do CLI NestJS.
- **package.json**: Gerenciamento de dependências.
- **tsconfig.build.json**: Configurações do TypeScript para build.

---

### 4. **Instalando Dependências do Projeto**

Para implementar as funcionalidades desejadas, precisaremos de algumas bibliotecas que nos auxiliarão em tarefas específicas.

#### **Lista de Dependências**

- **Produção**:
  - [nats](https://www.npmjs.com/package/nats): Cliente NATS para comunicação via mensageria.
  - [axios](https://www.npmjs.com/package/axios): Cliente HTTP baseado em promessas para fazer requisições.
  - [@nestjs/microservices](https://www.npmjs.com/package/@nestjs/microservices): Pacote para integração com microserviços.

- **Desenvolvimento**:
  - [dotenv](https://www.npmjs.com/package/dotenv): Carrega variáveis de ambiente a partir de um arquivo `.env`.

#### Comando de Instalação:

```bash
npm install nats axios @nestjs/microservices
npm install --save-dev dotenv
```

### 5. **Criando um Módulo**

Podemos agora criar um módulo para gerenciar interações com o Docker:

```bash
nest generate resource docker --no-spec
```
Selecione `Microservice (non-HTTP)` para o app-gateway usar NATS.
Se desejar um módulo com códigos de exemplo, selecione `Yes` para a opção `Would you like to generate CRUD entry points?`.

Ou, para gerar os componentes manualmente (_Requer configuração manual dos arquivos_):

```bash
nest generate module docker
nest generate controller docker
nest generate service docker
```

#### **Implementando o Módulo Docker**

Vamos configurar o módulo para gerenciar interações com Docker.

#### Estrutura:
- **docker.module.ts**: Define o módulo do NestJS e as dependências necessárias.
- **docker.controller.ts**: Contém as rotas e lógica associada às requisições HTTP/NATS/WS/etc.
- **docker.service.ts**: Gerencia a lógica de negócios, como comunicação com a API do Docker.
- **docker.repository.ts**: Responsável por encapsular a comunicação com a Docker API / AWS Fargate / etc.

Agora, a estrutura de arquivos deve estar parecida com a demonstração abaixo. Nesse treinamento, não usaremos testes (arquivos `.spec.ts`) para simplificar o desenvolvimento.

Você também pode apagar arquivos sem uso, como `app.controller.ts` e `app.service.ts`, já que a regra de negócio será implementada no módulo Docker e incluída no `app.module.ts`.

```
app-gateway/
├── node_modules/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── docker/
│   │   ├── docker.controller.ts
│   │   ├── docker.module.ts
│   │   ├── docker.repository.ts
│   │   ├── docker.service.ts
├── nest-cli.json
├── package.json
├── tsconfig.build.json
├── tsconfig.json
```

**Descrição de cada item**:
- **src/**: Contém todo o código-fonte.
  - **app.module.ts**: Módulo principal da aplicação.
  - **docker/**: Exemplo de módulo da aplicação com um controlador, serviço e repositório específicos para Docker.
  - **main.ts**: Ponto de entrada da aplicação.
- **nest-cli.json**: Configurações do CLI NestJS.
- **package.json**: Gerenciamento de dependências.
- **tsconfig.build.json**: Configurações do TypeScript para build.


#### **Habilitando NATS no app-gateway**

Na src/main.ts, substitua a linha padrão - que usa o Express
```typescript
const app = await NestFactory.create(AppModule);

...

await app.listen(3000);
```
Por
```typescript
import { Transport } from '@nestjs/microservices';

const app = await NestFactory.createMicroservice(AppModule, {
  transport: Transport.NATS,
  options: {
    name: 'app-gateway',
    servers: process.env.NATS_SERVERS.split(','),
  },
});

...

await app.listen();
```
Isso fará com que o app-gateway use o NATS para comunicação por padrão, e não Express (HTTP). A partir de agora, nossos Controllers usarão `@MessagePattern` ao invés de `@Get`/`@Post`.





Por fim, criaremos o arquivo de repository manualmente (_uma classe comum com @Injectable_) para encapsular a comunicação com a Docker API, na mesma pasta do serviço docker.

Abaixo uma implementação pronta para o `docker.repository.ts` para docker api local:

```typescript
import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

type dockerCreateResponse = {
  Id: string;
  Warnings: string[];
}

@Injectable()
export class DockerRepository {
  private docker: AxiosInstance;

  constructor() {
    this.docker = axios.create({
      baseURL: process.env.DOCKER_API_URL,
    });
  }

  async startContainer({ data } : { data: object }): Promise<void> {
    try {
      const dockerCreate = await this.createContainer({ data });
      await this.docker.post(`/containers/${dockerCreate.Id}/start`);
    } catch (error) {
      console.error(`Erro ao iniciar o container:`, error);
      throw error;
    }
  }
  
  private async createContainer({ data } : { data: object }): Promise<dockerCreateResponse> {
    try {
      // gera um id "único" para uso no nome do container
      const uniqId = Math.random().toString(36).substring(7);

      const dockerCreate : dockerCreateResponse = (
        await this.docker.post(`/containers/create?name=app-crawler-${uniqId}`, this.getDockerCreateObject({ data}))
      ).data;

      if(dockerCreate.Warnings.length > 0) {
        console.log(`Warnings ao criar o container ${uniqId}:`, dockerCreate.Warnings);
      }

      return dockerCreate;
    } catch (error) {
      console.error(`Erro ao criar o container:`, error);
      throw error;
    }
  }

  async stopContainer({ data } : { data: object }): Promise<void> {
    try {
      console.log("Função ainda não implementada para Docker local.", data);
    } catch (error) {
      console.error(`Erro ao deletar o container:`, error);
      throw error;
    }
  }
  
  private getDockerCreateObject({ data } : { data: object }): object {
    return {
      Image: 'app-crawler',
      Env: [
        'CRAWLER_CONFIG=' + JSON.stringify(data),
        'NATS_SERVERS=' + process.env.NATS_SERVERS,
      ],
      HostConfig: {
        NetworkMode: 'projeto_artemis',
      }
    };
  }
}
```

No controller, criaremos a "rota" NATS para recebimento das mensagens de criação de containers:

```typescript
import { NatsContext, Ctx, MessagePattern, Payload } from '@nestjs/microservices';

@MessagePattern('CRAWLER.REQUEST')
startCrawler(@Payload() data: number[], @Ctx() context: NatsContext) {
  // apenas para demonstração:
  console.log(`Subject: ${context.getSubject()}`, `Data: ${JSON.stringify(data)}`);

  this.dockerService.startNewContainer({
    data
  });
}
```

Agora que o controller está configurado, podemos implementar a função startNewContainer em nosso serviço docker `docker.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { DockerRepository } from './docker.repository';

@Injectable()
export class DockerService {
  constructor(private readonly dockerRepository: DockerRepository) {}

  async startNewContainer({ data } : { data: object }): Promise<void> {
    return this.dockerRepository.startContainer({ data });
  }

  async stopContainer({ data } : { data: object }): Promise<void> {
    return this.dockerRepository.stopContainer({ data });
  }
}
```

Por fim, importamos o DockerRepository como provider ao módulo docker, no arquivo `docker.module.ts`:
  
```typescript
import { Module } from '@nestjs/common';
import { DockerService } from './docker.service';
import { DockerController } from './docker.controller';
import { DockerRepository } from './docker.repository';

@Module({
  controllers: [DockerController],
  providers: [DockerService, DockerRepository],
})
export class DockerModule {}

```

---

### 6. **Criando .env**

Em nosso projeto, usamos duas variáveis de ambiente: `NATS_SERVERS` e `DOCKER_API_URL`. Para configurar essas variáveis, crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
NATS_SERVERS=nats://localhost:4222
DOCKER_API_URL=http://localhost:2375
```

Para funcionar, precisamos importar o dotenv na `main.ts`:

```typescript
import 'dotenv/config';
```


---

#### 7. **Executando o Projeto**

Para executar o projeto NestJS, use o seguinte comando:

```bash
npm run start
```

O NestJS abrirá um servidor NATS.

Para testar a comunicação com o Docker, você pode enviar uma mensagem para o NATS. Você pode usar o cliente NATS para enviar mensagens:

```bash
nats pub CRAWLER.REQUEST '{"url": "https://example.com", "id": 1}'
```
Ou, você pode usar um código Node.js para enviar mensagens, basta executar o código exemplo abaixo:

```bash
node envia-crawler.js
```

--- 

## Navegar pelo Projeto

- [Apresentação do projeto](../README.md)
- **Módulo 1**: [Arquitetura da Aplicação](../dia1/README.md)
- **Módulo 2**: [Introdução ao Docker](../dia2/README.md)
- **Módulo 3**: [MySQL Básico](../dia3/README.md)
- **Módulo 4**: [NATS e Mensageria](../dia4/README.md)
- **Módulo 5**: [Introdução ao TypeScript com Projeto Prático](../dia5/README.md)
- **Módulo 6**: Introdução ao NestJS e Criação do Gateway *(Você está aqui)*
- **Módulo 7**: [Aplicação de API com NestJS e NATS](../dia7/README.md)
- **Módulo 8**: [Front-end com Vue.js 3](../dia8/README.md)