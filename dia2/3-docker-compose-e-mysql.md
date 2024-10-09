## **Docker Compose e MySQL 8**

### 1. **O Que é Docker Compose?**
O **Docker Compose** é uma ferramenta usada para definir e gerenciar aplicações Docker que envolvem múltiplos containers. Em vez de executar e configurar cada container individualmente com `docker run`, o Compose usa um arquivo de configuração `docker-compose.yml` para definir todos os serviços, redes e volumes necessários.

Com o Docker Compose, você pode:
- Definir um ambiente multi-container com um único arquivo.
- Executar todos os containers definidos com um único comando.
- Controlar a ordem de inicialização e dependências entre serviços.

---

### 2. **Instalação do Docker Compose**

Para instalar o Docker Compose, siga os passos abaixo:

#### Linux / WSL:
1. Baixe a versão mais recente do Docker Compose:
    ```bash
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.16.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    ```
2. Dê permissão de execução ao binário:
    ```bash
    sudo chmod +x /usr/local/bin/docker-compose
    ```
3. Verifique a instalação:
    ```bash
    docker-compose --version
    ```

#### Windows / Mac:
- No Windows e no Mac, o Docker Desktop já inclui o Docker Compose.

---

### 3. **Criando um Arquivo `docker-compose.yml`**

Agora que você já tem o Docker Compose instalado, vamos criar um arquivo `docker-compose.yml` para rodar o **MySQL 8**. Esse arquivo irá definir o container do MySQL, suas configurações de rede e persistência de dados.

#### Estrutura Básica do `docker-compose.yml`
O arquivo `docker-compose.yml` segue uma estrutura YAML, onde definimos cada serviço (container) que será executado. Abaixo está um exemplo básico de como rodar o MySQL 8 com Docker Compose:

```yaml
version: '3.8' # Define a versão do Docker Compose

services: 
  db:
    image: mysql:8   # Especifica a imagem do MySQL 8, versões disponíveis em https://hub.docker.com/_/mysql
    container_name: mysql_server  # Nome do container
    environment: 
      MYSQL_ROOT_PASSWORD: artemis2024 # Senha do usuário root
      MYSQL_DATABASE: artemis # Nome do banco de dados a ser criado
    networks:
      - artemis # Rede para comunicação entre containers
    ports:
      - "3306:3306" # Expõe a porta 3306 no host
    volumes:
      - db_data:/var/lib/mysql # Volume para persistência de dados

volumes:
  db_data: # Volume para armazenar os dados do banco
```

---

### 4. **Comandos Docker Compose**

#### Subindo o Ambiente com Docker Compose
Para iniciar os serviços definidos no arquivo `docker-compose.yml`, utilize o comando na pasta onde está o arquivo:

```bash
docker-compose up
```
Esse comando vai baixar a imagem do MySQL (caso ainda não esteja localmente), criar o container e iniciar o MySQL com as configurações definidas.

Se quiser rodar em segundo plano (modo "detached"), use o parâmetro `-d`:
```bash
docker-compose up -d
```

#### Parando os Containers
Para parar os containers em execução:

```bash
docker-compose down
```

#### Exibindo Logs
Para acompanhar os logs de todos os containers:

```bash
docker-compose logs
```

#### Verificando o Status dos Containers
Para ver quais containers estão em execução com o Docker Compose:

```bash
docker-compose ps
```

---

### 5. **Explicação dos Elementos do `docker-compose.yml`**

#### Versão
- A chave `version` define a versão do Docker Compose que estamos usando. No exemplo, usamos a versão '3.8', que é uma das mais recentes e estáveis.

#### Serviços
- **services** é onde você define os containers. No exemplo, criamos um serviço chamado `db` para o MySQL.
  - `image`: Define qual imagem será usada para criar o container.
  - `container_name`: Define um nome para o container.
  - `environment`: Configura variáveis de ambiente. No caso do MySQL, definimos a senha do root, o nome do banco de dados, o nome do usuário e sua senha.
  - `ports`: Faz o mapeamento de portas do host para o container. No exemplo, mapeamos a porta `3306` do MySQL para o host.
  - `volumes`: Define volumes que serão usados para armazenar dados de forma persistente. Isso garante que, mesmo que o container seja removido, os dados do banco de dados não sejam perdidos.

#### Volumes
- **volumes** são utilizados para persistir os dados fora do ciclo de vida do container. O volume `db_data` está sendo montado no diretório `/var/lib/mysql` dentro do container, que é onde o MySQL armazena seus dados.

---

### 6. **Conectando ao MySQL com Docker Compose**

Uma vez que o container do MySQL esteja rodando, você pode se conectar ao banco de dados de várias formas:

#### Acessando o MySQL de Dentro do Container
Você pode acessar o terminal do MySQL diretamente de dentro do container utilizando o seguinte comando:

```bash
docker exec -ti mysql_container mysql -uroot -p
```
Isso irá abrir o prompt do MySQL onde você pode rodar comandos SQL.

#### Conectando ao MySQL de Fora do Container
Se você tiver um cliente MySQL instalado no seu sistema, pode conectar-se usando a seguinte linha de comando:

```bash
mysql -h 127.0.0.1 -P 3306 -u usuario -p
```

Será solicitada a senha do usuário que você definiu no `docker-compose.yml`.

Para a comunicação funcionar de fora da rede, com 127.0.0.1/localhost, você precisa rodar a docker com `-p 0.0.0.0:3306:3306`. Isso fará com que o Docker abra a porta 3306 para qualquer IP (0.0.0.0). Caso o acesso seja apenas de dentro da rede, o padrão é suficiente `-p 3306:3306`.

---

### 7. **Docker Compose com Múltiplos Containers**

O Docker Compose é especialmente útil quando você precisa rodar múltiplos serviços que precisam se comunicar. Por exemplo, podemos adicionar um serviço de aplicação que se conecta ao MySQL:

```yaml
version: '3.8'

services:
  app-api:
    image: app-api  # Sua aplicação
    container_name: app-api
    environment: # Podemos usar o nome dos containeres na mesma rede para acessar o serviço, ao invés de usar o IP
      JWT_SECRET=supersecret
      NATS_SERVERS=nats://nats_server:4222
      DATABASE_URL="mysql://root:artemis2024@mysql_server:3306/artemis"
      REDIS_SERVER=redis://redis_server:6379
    depends_on: # informa quais containeres devem estar rodando antes de iniciar este
      - mysql_server
      - redis_server
      - nats_server
    ports:
      - "0.0.0.0:80:3000" # Mapeia a porta interna 3000 na porta 80 do host, externa, para nos ajudar a testar.
  
  mysql_server:
    image: mysql:8 # https://hub.docker.com/_/mysql
    container_name: mysql_server
    environment:
      MYSQL_ROOT_PASSWORD: artemis2024 # Senha do usuário root
      MYSQL_DATABASE: artemis # Nome do banco de dados
    networks:
      - artemis
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql

  nats_server:
    image: nats:latest # https://hub.docker.com/_/nats
    container_name: nats_server
    networks:
      - artemis
    ports:
      - "4222:4222"
    volumes:
      - ./nats/jetstream/:/data/jetstream/ # Mapeamos um volume para persistir os dados do JetStream, ao invés de usar o volume padrão
      - ./nats/nats-server.json:/nats-server.conf # Mapeamos o arquivo de configuração do NATS
    command: "--config /nats-server.conf" # Passamos o atributo do comando nats para usar nosso arquivo de config

  redis_server:
    image: redis:alpine # https://hub.docker.com/_/redis
    container_name: redis_server
    networks:
      - artemis
    ports:
      - "6379:6379"

networks:
  artemis:

volumes:
  db_data:
```

Aqui adicionamos o serviço `app`, que depende do serviço `db`. Com a chave `depends_on`, garantimos que o MySQL estará disponível antes da aplicação ser iniciada.

---

### 8. **Comandos Úteis Adicionais**

#### Recriando Containers
Se você fizer mudanças no `docker-compose.yml` ou nas imagens utilizadas, pode recriar os containers sem perder os dados:

```bash
docker-compose up -d --build
```

#### Parando e Removendo Containers
Para parar os containers e remover volumes, redes e containers criados pelo Docker Compose:

```bash
docker-compose down -v
```

Isso também remove os volumes, limpando os dados armazenados.

---

## Navegar pelo projeto
- [Apresentação do projeto](../README.md)
- **Módulo 1**: [Arquitetura da Aplicação](../dia1/README.md)
- **Módulo 2** [Introdução ao Docker](./README.md)
- - [Instalando docker em Linux / WSL](./1-instalar-wsl-e-docker.md)
- - [Instalando Docker Desktop em Windows / Mac](./1-instalando-docker-desktop.md)
- - [Como o Docker Funciona](./2-como-docker-funciona.md)
- - [Docker Volume](./2-docker-volume.md)
- - Docker Compose e MySQL 8 *(Você está aqui)*
- **Módulo 3** [MySQL básico](./dia3/README.md)