# Projeto: Rastreio e Extração de Informações de Páginas Web

Olá astronautas, 🚀

Bem-vindos ao nosso treinamento intensivo onde, ao longo dos próximos 10 dias, desenvolveremos juntos uma aplicação completa utilizando tecnologias modernas e uma arquitetura baseada em microsserviços. Nossa jornada abrangerá desde o front-end até o back-end, passando por frameworks como **Vue.js 3**, **Nest.js**, **TypeScript**, **Puppeteer**, **Docker**, **MySQL** e a mensageria com **NATS** para Event-Driven-Architecture.

---

## Objetivo do Projeto

Vamos criar uma aplicação de **rastreio e extração de informações de páginas web**. Esta aplicação permitirá que os usuários:

- **Cadastrem-se e realizem login** na plataforma.
- **Solicitem a extração de dados** de URLs específicas.
- **Visualizem suas solicitações anteriores**, acompanhando o status de cada uma.
- **Acessem os dados extraídos** após a conclusão do processamento.

---

## Cronograma de treinamento

**Dia 1: Introdução ao Treinamento, SEO e Projeto**

- **Objetivo**: Apresentação do treinamento, da empresa liveSEO, e introdução aos conceitos básicos de SEO e ao projeto a ser desenvolvido.
- **Tópicos**:
  - Introdução ao treinamento
  - Apresentação sobre a liveSEO
  - O que é SEO?
  - Introdução ao projeto

**Dia 2: Docker e Preparação do Ambiente**

- **Objetivo**: Introduzir Docker e configurar o ambiente de desenvolvimento com Docker Compose para rodar o MySQL.
- **Tópicos**:
  - Instalação do Docker
  - Introdução a Docker e contêineres
  - Criando uma imagem Docker
  - Docker Compose para rodar o MySQL

**Dia 3: SQL e Configuração do Banco de Dados**

- **Objetivo**: Configurar o MySQL e criar a estrutura de tabelas necessária para o projeto.
- **Tópicos**:
  - Conceitos básicos de SQL
  - Criação de tabelas e índices
  - Inserção e consulta de dados

**Dia 4: Usando NATS para Comunicação entre Aplicações**

- **Objetivo**: Introduzir a arquitetura dirigida por eventos (EDA) e configurar o NATS como message broker.
- **Tópicos**:
  - O que é EDA (Event-Driven Architecture)?
  - Introdução ao NATS
  - Instalando e configurando NATS com Docker Compose
  - Habilitando JetStream para persistência de mensagens

**Dia 5: Criando Aplicação de Extração com TypeScript**

- **Objetivo**: Planejar e iniciar a implementação de uma aplicação de extração de dados utilizando Puppeteer e NATS.
- **Tópicos**:
  - Introdução ao TypeScript
  - Iniciando o projeto com TypeScript
  - Usando Puppeteer para automação
  - Integração com NATS

**Dia 6: Estrutura de Código e Gateway com NestJS**

- **Objetivo**: Desenvolver a aplicação Gateway utilizando NestJS para gerenciar os rastreamentos.
- **Tópicos**:
  - Introdução ao NestJS
  - Arquitetura EDA aplicada no projeto
  - Criação da aplicação Gateway com NestJS

**Dia 7: Estrutura de Código e API com NestJS**

- **Objetivo**: Criar a API pública com NestJS que será utilizada pelo front-end.
- **Tópicos**:
  - Criação de módulos e rotas no NestJS
  - Preparação de autenticação
  - Integração com NATS

**Dia 8: Criando a Aplicação de Front-end com Vue 3**

- **Objetivo**: Desenvolver a interface do usuário com Vue 3 e Vuetify para interação com a API.
- **Tópicos**:
  - Introdução ao Vue 3 e Vuetify
  - Planejamento da aplicação
  - Criação de componentes e rotas

**Dia 9: Integração e Ajustes Finais**

- **Objetivo**: Integrar os componentes do projeto e realizar ajustes finais.
- **Tópicos**:
  - Integração entre front-end, backend e serviços
  - Testes e validações
  - Melhorias no projeto

**Dia 10: Avaliação Final**

- **Objetivo**: Revisão do conteúdo e avaliação final do projeto.
- **Tópicos**:
  - Avaliação de Docker, TypeScript, NestJS, Vue 3 e MySQL

---

## Navegar pelo projeto
- **Apresentação do projeto** *(Você está aqui)*
- **Módulo 1** [Arquitetura do projeto](./dia1/README.md)
- **Módulo 2** [Docker e Preparação do Ambiente](./dia2/README.md)
- **Módulo 3** [MySQL básico](./dia3/README.md)
- **Módulo 4** [Introdução ao NATS](./dia4/README.md)
- **Módulo 5**: [Introdução ao TypeScript com Projeto Prático](./dia5/README.md)
- **Módulo 6**: [Introdução ao NestJS e Criação do Gateway](./dia6/README.md)
- **Módulo 7**: [Aplicação de API com NestJS e NATS](./dia7/README.md)
- **Módulo 8**: [Front-end com Vue.js 3](./dia8/README.md)