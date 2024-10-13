## Módulo 4: NATS e Mensageria

### 1. **O Que é NATS.io?**

O **NATS.io** é um sistema de mensagens open-source, leve e de alto desempenho, projetado para comunicação entre sistemas distribuídos. Ele facilita a troca de mensagens em tempo real entre serviços, dispositivos e aplicações em arquiteturas de microserviços.

Com o NATS, você pode:

- Enviar e receber mensagens de forma assíncrona.
- Utilizar padrões de comunicação como Publish/Subscribe e Request/Reply.
- Persistir mensagens e realizar streaming de dados com o **JetStream**.
- Escalar suas aplicações de forma eficiente e horizontal.

---

### 2. **Conceitos Básicos de Mensageria no NATS**

#### 2.1 **Publish/Subscribe**

No modelo **Publish/Subscribe**, produtores (publishers) enviam mensagens para um "assunto" (subject) específico, e consumidores (subscribers) inscritos nesses assuntos recebem as mensagens.

- **Publisher**: Envia mensagens para um ou mais assuntos.
- **Subscriber**: Inscreve-se em assuntos para receber mensagens.

#### 2.2 **Request/Reply**

O padrão **Request/Reply** permite que um cliente envie uma solicitação e aguarde por uma resposta.

- **Requester**: Envia uma solicitação para um assunto e espera por uma resposta.
- **Replier**: Escuta solicitações em um assunto e envia respostas.

#### 2.3 **JetStream**

O **JetStream** adiciona funcionalidades de streaming e persistência ao NATS:

- Armazenamento de mensagens para processamento posterior.
- Consumidores duráveis que mantêm estado.
- Suporte a replay e processamento de eventos.

---

### 3. **Instalação do NATS**

Utilizaremos o arquivo `docker-compose.yml` abaixo para configurar o NATS com o **JetStream** habilitado. Este arquivo é uma continuação do módulo anterior, onde já configuramos outros serviços como o MySQL.

#### Arquivo `docker-compose.yml`

```yaml
services:
  mysql_server:
    image: mysql:8  # https://hub.docker.com/_/mysql
    container_name: mysql_server
    environment:
      MYSQL_ROOT_PASSWORD: artemis2024  # Senha do usuário root
      MYSQL_DATABASE: artemis  # Nome do banco de dados
    networks:
      - artemis
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql
    healthcheck:
      test: ["CMD-SHELL", "mysqladmin ping -h localhost -u root -partemis2024 || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5

  nats_server:
    image: nats:alpine  # https://hub.docker.com/_/nats
    container_name: nats_server
    networks:
      - artemis
    ports:
      - "4222:4222"
      - "0.0.0.0:8222:8222"
    volumes:
      - ./nats/jetstream:/data/jetstream  # Persistência dos dados do JetStream
      - ./nats/nats-server.conf:/data/nats-server.conf  # Arquivo de configuração do NATS
    command: --debug --config /data/nats-server.conf
    healthcheck:
      test: wget http://localhost:8222/healthz -q -S -O -
      interval: 10s
      timeout: 5s
      retries: 5

networks:
  artemis:

volumes:
  db_data:
```

#### Arquivo de Configuração `nats-server.conf`

Crie o diretório `./nats` na raiz do seu projeto e dentro dele crie o arquivo `nats-server.conf` com o seguinte conteúdo:

```conf
jetstream: {
  store_dir: "/data/jetstream"
}

http: 8222
```

Este arquivo habilita o JetStream e configura o diretório de armazenamento. Também habilita a interface de monitoramento na porta 8222.

#### Iniciando os Serviços

Para iniciar os serviços definidos no `docker-compose.yml`, execute:

```bash
docker-compose up -d
```

---

### 4. **Instalação do NVM e Node.js 20.17.0**

Para desenvolver aplicações em JavaScript que se comunicam com o NATS, precisamos instalar o Node.js. Recomenda-se o uso do **NVM (Node Version Manager)** para gerenciar diferentes versões do Node.js em seu sistema.

Para a instalação do NVM, é necessário remover qualquer instalação anterior do Node.js em seu sistema.

#### 4.1 **Instalando o NVM e Node.js no Linux**

1. **Instalar o NVM**

   Abra um terminal e execute:

   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
   ```

   Após a instalação, recarregue o perfil do shell:

   ```bash
   source ~/.bashrc
   ```

2. **Instalar o Node.js 20.17.0**

   ```bash
   nvm install 20.17.0
   nvm use 20.17.0
   ```

3. **Verificar a Instalação**

   ```bash
   node -v
   npm -v
   ```

#### 4.2 **Instalando o NVM e Node.js no Windows**

No Windows, podemos usar o **nvm-windows**:

1. **Baixar o NVM para Windows**

   Faça o download do instalador do NVM para Windows:

   - [Download NVM for Windows](https://github.com/coreybutler/nvm-windows/releases)

2. **Instalar o NVM**

   Execute o instalador e siga as instruções.

3. **Instalar o Node.js 20.17.0**

   Abra o Prompt de Comando ou PowerShell como administrador e execute:

   ```cmd
   nvm install 20.17.0
   nvm use 20.17.0
   ```

4. **Verificar a Instalação**

   ```cmd
   node -v
   npm -v
   ```

---

### 5. **Desenvolvendo Aplicações com NATS em JavaScript**

Com o Node.js instalado, podemos desenvolver aplicações que se comunicam com o NATS.

#### 5.1 **Configurando o Ambiente**

1. **Criar um Diretório para o Projeto**

   ```bash
   mkdir nats-test
   cd nats-test
   ```

2. **Inicializar o Projeto Node.js**

   ```bash
   npm init -y
   ```

3. **Instalar o Cliente NATS**

   ```bash
   npm install nats
   ```

#### 5.2 **Exemplo de Publish/Subscribe**

Vamos criar duas aplicações simples para demonstrar o modelo Publish/Subscribe.

##### **publisher.js**

```javascript
const { connect, StringCodec } = require('nats');

(async () => {
  const nc = await connect({ servers: 'nats://localhost:4222' });
  const sc = StringCodec();

  setInterval(() => {
    const msg = `Olá! Mensagem enviada em ${new Date().toLocaleTimeString()}`;
    nc.publish('saudacao', sc.encode(msg));
    console.log(`Publicado: ${msg}`);
  }, 1000);
})();
```

Este script publica uma mensagem no assunto `saudacao` a cada segundo.

##### **subscriber.js**

```javascript
const { connect, StringCodec } = require('nats');

(async () => {
  const nc = await connect({ servers: 'nats://localhost:4222' });
  const sc = StringCodec();

  const sub = nc.subscribe('saudacao');
  console.log('Inscrito no assunto "saudacao"');

  for await (const m of sub) {
    console.log(`Recebido: ${sc.decode(m.data)}`);
  }
})();
```

Este script se inscreve no assunto `saudacao` e exibe as mensagens recebidas.

---

### 6. **Dois Arquivos de Aplicação JS Simples**

#### 6.1 **publisher.js**

```javascript
const { connect, StringCodec } = require('nats');

(async () => {
  // Conecta ao NATS
  const nc = await connect({ servers: 'nats://localhost:4222' });
  const sc = StringCodec();

  // Publica mensagens periodicamente
  setInterval(() => {
    const msg = `Olá! Mensagem enviada em ${new Date().toLocaleTimeString()}`;
    nc.publish('saudacao', sc.encode(msg));
    console.log(`Publicado: ${msg}`);
  }, 1000);
})();
```

#### 6.2 **subscriber.js**

```javascript
const { connect, StringCodec } = require('nats');

(async () => {
  // Conecta ao NATS
  const nc = await connect({ servers: 'nats://localhost:4222' });
  const sc = StringCodec();

  // Inscreve-se no assunto 'saudacao'
  const sub = nc.subscribe('saudacao');
  console.log('Inscrito no assunto "saudacao"');

  // Lê mensagens
  for await (const m of sub) {
    console.log(`Recebido: ${sc.decode(m.data)}`);
  }
})();
```

#### **Executando as Aplicações**

1. **Inicie o servidor NATS** (caso ainda não tenha iniciado):

   ```bash
   docker-compose up -d
   ```

2. **Execute o `subscriber.js`**:

   ```bash
   node subscriber.js
   ```

3. **Execute o `publisher.js`** em outro terminal:

   ```bash
   node publisher.js
   ```

Você verá o `subscriber.js` exibindo as mensagens publicadas pelo `publisher.js`.

---

O NATS.io é uma ferramenta poderosa para construção de sistemas distribuídos eficientes e escaláveis. Com sua simplicidade e performance, ele é uma excelente escolha para implementar comunicação entre serviços em arquiteturas modernas.

---

### **Links Úteis**
- [Conceito de subjects e wildcards](https://docs.nats.io/nats-concepts/subjects)
- [Inscrições com Wildcard](https://docs.nats.io/using-nats/developer/receiving/wildcards)

---

## Navegar pelo projeto

- [Apresentação do projeto](../README.md)
- **Módulo 1**: [Arquitetura da Aplicação](../dia1/README.md)
- **Módulo 2**: [Introdução ao Docker](./README.md)
  - [Instalando docker em Linux / WSL](./1-instalar-wsl-e-docker.md)
  - [Instalando Docker Desktop em Windows / Mac](./1-instalando-docker-desktop.md)
  - [Como o Docker Funciona](./2-como-docker-funciona.md)
  - [Docker Volume](./2-docker-volume.md)
  - [Docker Compose e MySQL 8](./docker-compose-mysql.md)
- **Módulo 3**: [MySQL Básico](./dia3/README.md)
- **Módulo 4**: NATS e Mensageria **(Você está aqui)**
- **Módulo 5**: [Introdução ao TypeScript com Projeto Prático](./dia5/README.md)
