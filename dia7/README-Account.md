# Configuração do Projeto NestJS com Módulo de Account

Este guia irá ajudá-lo a configurar um projeto NestJS, focando na implementação do módulo de Account, que lida com registro, autenticação e autorização de usuários. Ao final, você terá um módulo de Account funcional, com service, controller, middleware e tipos definidos.

## Pré-requisitos

- **Node.js** (versão LTS recomendada)
- **NPM** ou **Yarn**
- **NestJS CLI**

## Passo 1: Configuração do Ambiente

### Instalando Node.js via NVM

Utilizaremos o Node Version Manager (nvm) para gerenciar versões do Node.js. Se ainda não tem o nvm instalado, siga as instruções no [repositório oficial do NVM](https://github.com/nvm-sh/nvm).

Após instalar o nvm, instale a versão LTS do Node.js:

```bash
nvm install --lts
nvm use --lts
```

Isso garantirá que você esteja usando uma versão estável e suportada do Node.js.

### Instalando o NestJS CLI

O NestJS CLI facilita a criação e gerenciamento de projetos NestJS. Instale-o globalmente:

```bash
npm install -g @nestjs/cli
```

## Passo 2: Criando o Projeto NestJS

Crie um novo projeto NestJS chamado `app-api`:

```bash
nest new app-api
```

Siga as instruções, escolhendo o gerenciador de pacotes de sua preferência (NPM ou Yarn).

## Passo 3: Instalando Dependências do Projeto

Navegue até o diretório do projeto:

```bash
cd app-api
```

Instale as seguintes dependências:

- **argon2**: Biblioteca para hashing de senhas.
- **prisma**: ORM para interagir com o banco de dados.
- **@nestjs/jwt**: Módulo JWT para autenticação.
- **dotenv**: Para carregar variáveis de ambiente de um arquivo `.env`.

Instale as dependências:

```bash
npm install argon2 prisma @nestjs/jwt
```

Instale a dependência de desenvolvimento `dotenv`:

```bash
npm install dotenv --save-dev
```

## Passo 4: Preparando o Projeto

### Gerando Módulos Principais

Vamos criar o primeiro módulo do projeto: `account`. Ele será responsável por lidar com contas de usuários.

Execute os comandos:

```bash
nest generate resource modules/account --no-spec
```

### Criando Middleware para o Módulo Account

O módulo de `account` terá um middleware para verificar a autenticação do usuário. Crie o middleware:

```bash
nest generate middleware modules/account
```

> **Nota:** O comando acima cria um middleware chamado `AccountMiddleware` no módulo `account`.

### Gerando Módulos Comuns

Crie módulos comuns que serão utilizados por outros módulos, como `prisma` (para acesso ao banco de dados).

```bash
nest generate module common/prisma
nest generate service common/prisma --no-spec
```

## Passo 5: Implementando o Módulo de Account

Agora, vamos nos concentrar no módulo de `account`, implementando o service, controller, middleware e tipos necessários.

### 5.1: Definindo Tipos

Crie um arquivo para definir os tipos utilizados no módulo de `account`.

Crie o arquivo `src/modules/account/account.types.ts` e adicione o seguinte conteúdo:

```typescript
export type TokenLogin = { 
    token: string;
}

export type UserCredentials = { 
    email: string; 
    password: string;
}
```

Esses tipos serão utilizados para tipar os dados de login e registro, bem como o token retornado.

### 5.2: Implementando o Service

O service será responsável pela lógica de negócio, como criar usuários, autenticar e verificar tokens.

Edite o arquivo `src/modules/account/account.service.ts`:

```typescript
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { TokenLogin, UserCredentials } from './account.types';

@Injectable()
export class AccountService {

  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async createAccount( userData: userCredentials ) : Promise<tokenLogin | BadRequestException> {
    try{
      // criamos o hash da senha para armazenamento seguro
      const hashedPassword = await argon2.hash(userData.password);
  
      // criamos o usuário no banco de dados com prisma
      await this.prismaService.user.create({
        data: { 
          email: userData.email, 
          password: hashedPassword 
        },
      });
  
    } catch(e) {
      // em caso de erros como email duplicado ou qualquer outo, retornamos um erro 400
      // Não informamos se a conta já existe por questões de segurança.
      throw new BadRequestException('Failed to create account')
    }
  
    // se não parou no catch, já adiantamos o login para retornar o token de autenticação da conta recém-criada
    return this.login({ 
      email: userData.email, 
      password: userData.password 
    });
  }

  async login(userData: userCredentials) : Promise<tokenLogin | UnauthorizedException> {
    // desencapsulamos o email e a senha do objeto userData em variáveis separadas
    const { email, password } = userData;

    // realizamos a busca do usuário no banco de dados, apenas pelo e-mail, para verificar o argon2 depois
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      // retornamos uma mensagem genérica por questões de segurança.
      throw new UnauthorizedException('Invalid email or password');
    }

    // com o registro em mãos, podemos verificar a senha salva (user.password) com a senha fornecida (password)
    const isValidPassword = await argon2.verify(user.password, password);

    if (!isValidPassword) {
      // retornamos uma mensagem genérica por questões de segurança.
      throw new UnauthorizedException('Invalid email or password');
    }

    // se tudo certo, criamos um jwt assinado com o id do usuário
    const token = this.jwtService.sign({ userId: user.id });

    return { token };
  }

  isAuthenticated(authHeader : string) : false | number {
    
    // receberemos o header de autorização, que deve ser do tipo Bearer com jwt
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }

    // separamos o token do header ("Bearer token") -> token
    const token = authHeader.split(' ')[1];

    try {
      // Verifica e decodifica o JWT
      const payload = this.jwtService.verify(token);

      // Retorna o userId do payload se o token for válido
      return payload.userId
    } catch (error) {
      return false;
    }
  }
}
```

**Explicação dos métodos:**

- **createAccount**: Recebe os dados do usuário, cria um hash da senha usando `argon2`, salva o usuário no banco de dados usando o `PrismaService`, e retorna um token de autenticação chamando o método `login`.

- **login**: Recebe os dados de login, busca o usuário pelo email, verifica a senha usando `argon2`, e retorna um token JWT usando o `JwtService`.

- **isAuthenticated**: Verifica o header de autorização, valida o token JWT e retorna o `userId` se válido, ou `false` se inválido.

### 5.3: Implementando o Controller

O controller lida com as requisições HTTP e utiliza o service para executar a lógica de negócio.

Edite o arquivo `src/modules/account/account.controller.ts`:

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { AccountService } from './account.service';
import { UserCredentials } from './account.types';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('register')
  async register(@Body() userData: UserCredentials) {
    return this.accountService.createAccount(userData);
  }

  @Post('login')
  async login(@Body() userData: UserCredentials) {
    return this.accountService.login(userData);
  }
}
```

**Explicação das rotas:**

- **POST /account/register**: Recebe os dados do usuário, chama o método `createAccount` do service, e retorna o token de autenticação.

- **POST /account/login**: Recebe os dados de login, chama o método `login` do service, e retorna o token de autenticação.

### 5.4: Implementando o Middleware de Autenticação

O middleware verifica se o usuário está autenticado em cada requisição, antes de chegar às rotas protegidas.

Edite o arquivo `src/modules/account/account.middleware.ts`:

```typescript
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { AccountService } from './account.service';

@Injectable()
export class AccountMiddleware implements NestMiddleware {

  constructor(
    private readonly accountService: AccountService,
  ) {}

  async use(req: any, res: any, next: () => void) {
    const authHeader = req.headers['authorization'];

    const userId = this.accountService.isAuthenticated(authHeader);

    if (!userId) {
      // O NestJS já trata exceções lançadas dentro de middlewares e retorna uma resposta HTTP adequada
      throw new UnauthorizedException('Invalid token or session');
    }

    // se o usuário estiver autenticado, anexa os dados da sessão ao req para ser usados depois 
    req.userId = userId;

    // chama o próximo middleware / rota
    next();
  }
}
```

**Explicação:**

- O middleware extrai o header de autorização, verifica a autenticidade do token usando o método `isAuthenticated` do service, e anexa o `userId` à requisição (`req.user`), para que possa ser utilizado nas rotas.

### 5.5: Configurando o Módulo de Account

Edite o arquivo `src/modules/account/account.module.ts` para registrar o middleware e importar os módulos necessários.

```typescript
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { AccountMiddleware } from './account.middleware';

@Module({
  imports: [
    PrismaModule,
  ],
  providers: [AccountService],
  controllers: [AccountController],
})
export class AccountModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AccountMiddleware)
      .exclude(
        'account/login',
        'account/register',
      )
      .forRoutes('*');
  }
}
```

**Explicação:**

- Importamos o `PrismaModule` para ter acesso ao banco de dados.
- Importamos e configuramos o `JwtModule`, definindo o segredo e opções de assinatura.
- Registramos o `AccountMiddleware`, excluindo as rotas de `login` e `register`, já que nelas o usuário ainda não está autenticado.
- Aplicamos o middleware em todas as outras rotas (`forRoutes('*')`).

### 5.6: Configurando o Prisma

Para utilizar o Prisma, precisamos configurar o esquema e gerar o cliente.

Crie o arquivo `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id       Int      @id @default(autoincrement())
  email    String   @unique
  password String
}
```

**Explicação:**

- Definimos um modelo `User` com campos `id`, `email` e `password`.
- O campo `email` é único.
- O banco de dados utilizado é MySQL, mas você pode alterar para o banco de sua preferência.

### 5.7: Gerando o Cliente Prisma

Instale o Prisma Client e gere o cliente:

```bash
npx prisma generate
```

Além disso, precisamos aplicar as migrações ao banco de dados:

```bash
npx prisma migrate dev --name first_setup
```

Esse comando vai atualizar o database local com as configurações definidas no arquivo `schema.prisma` e criar um arquivo de migração chamado `first_setup`. Esse arquivo de migração será utilizado para aplicar as alterações no banco de dados automaticamente quando a aplicação for iniciada.

Certifique-se de que a variável de ambiente `DATABASE_URL` esteja definida no arquivo `.env`, apontando para o seu banco de dados.

Exemplo de `.env`:

```env
DATABASE_URL=mysql://root:artemis2024@localhost:3306/artemis2024
JWT_SECRET=minha_chave_secreta
```

### 5.8: Implementando o Prisma Service

Edite o arquivo `src/common/prisma/prisma.service.ts`:

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
```

**Explicação:**

- O `PrismaService` estende o `PrismaClient` e implementa os hooks `OnModuleInit` e `OnModuleDestroy` para gerenciar a conexão com o banco de dados.

### 5.9: Implementando o Prisma Module

Edite o arquivo `src/common/prisma/prisma.module.ts`:

```typescript
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// @Global() // Torna o módulo global
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

**Explicação:**

- Podemos decorar o módulo com `@Global()` para que o `PrismaService` esteja disponível em toda a aplicação sem precisar importar o módulo em cada lugar.

### 5.10: Configurando o App Module

Edite o arquivo `src/app.module.ts` para importar o `AccountModule` e o `PrismaModule`:

```typescript
import { Module } from '@nestjs/common';
import { AccountModule } from './modules/account/account.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    AccountModule,
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

## Passo 6: Testando o Módulo de Account

Inicie a aplicação:

```bash
npm run start:dev
```

### 6.1: Registrando um Usuário

Faça uma requisição `POST` para `http://localhost:3000/account/register` com o seguinte corpo JSON:

```json
{
  "email": "usuario@example.com",
  "password": "senha123"
}
```

Resposta esperada:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
```

### 6.2: Fazendo Login

Faça uma requisição `POST` para `http://localhost:3000/account/login` com o mesmo corpo.

Resposta esperada:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
```

### 6.3: Testando Rotas Protegidas

Crie uma rota protegida para testar o middleware.

Edite `src/app.controller.ts`:

```typescript
import { Controller, Get, Req } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('protected')
  getProtected(@Req() req): string {
    return `Olá, usuário ${req.userId}`;
  }
}
```

Ao fazer uma requisição `GET` para `http://localhost:3000/protected` sem o header de autorização, você deve receber um erro `401 Unauthorized`.

Ao adicionar o header `Authorization: Bearer <token>` com o token recebido no login, você deve receber a mensagem:

```
Olá, usuário 1
```

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
- - Módulo de Account *(Você está aqui)*
- - [Módulo de Crawler](./README-Crawler.md)
- **Módulo 8**: [Frontend com VueJS e](../dia8/README.md)
