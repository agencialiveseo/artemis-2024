## Módulo 7: Aplicação de API com NestJS e NATS

Neste módulo, avançamos no desenvolvimento da nossa aplicação API, integrando o NestJS com o sistema de mensageria **NATS**. Implementamos funcionalidades essenciais, como autenticação de usuários e operações de crawler, estruturando a aplicação em módulos específicos.

---

### 1. **Integração com NATS**

**NATS** é um sistema de mensageria de alto desempenho e em tempo real. A integração com o NATS permite que nossa aplicação se comunique de forma assíncrona com outros serviços, melhorando a escalabilidade e a resiliência.

Benefícios:

- **Comunicação Assíncrona**: Permite que diferentes partes da aplicação se comuniquem sem dependência direta.
- **Desacoplamento**: Facilita a manutenção e evolução de componentes independentes.
- **Alto Desempenho**: Ideal para aplicações que requerem baixa latência.

---

### 1.2. **Implementação do Módulo de Account**

O módulo **Account** é responsável pela gestão de usuários, incluindo registro, autenticação e autorização.

Principais funcionalidades:

- **Registro de Usuários**: Permite que novos usuários se cadastrem na aplicação.
- **Autenticação**: Implementa login seguro utilizando tokens JWT.
- **Proteção de Rotas**: Utiliza middlewares para proteger rotas e garantir que apenas usuários autenticados acessem determinados recursos.

Para mais detalhes sobre a implementação, acesse o [README-Account.md](./README-Account.md).

---

### 1.3. **Implementação do Módulo de Crawler**

O módulo **Crawler** gerencia as requisições de crawling de URLs, permitindo que usuários autenticados iniciem processos de extração de dados.

Principais funcionalidades:

- **Iniciar Crawling**: Usuários podem solicitar a extração de dados de uma URL específica.
- **Comunicação via NATS**: As requisições são enviadas para um serviço de processamento através do NATS.
- **Atualizações em Tempo Real**: Utiliza WebSockets para notificar os usuários sobre o status das suas requisições.

Para mais detalhes sobre a implementação, acesse o [README-Crawler.md](./README-Crawler.md).

---

### 1.4. **Estrutura Modular da Aplicação**

Dividimos a aplicação em módulos para melhorar a organização e facilitar a manutenção:

- **AccountModule**: Gerencia tudo relacionado à autenticação e usuários.
- **CrawlerModule**: Cuida das operações de crawling e comunicação com serviços externos.
- **Common Modules**: Contém serviços compartilhados, como conexão com o banco de dados (Prisma), comunicação com o NATS e gerenciamento de WebSockets.

---

### 1.5. **Próximos Passos**

Com os módulos de **Account** e **Crawler** implementados, nossa aplicação está pronta para ser integrada com outros serviços e componentes. Os próximos passos incluem:

- **Implementação de Testes**: Garantir a confiabilidade através de testes unitários e de integração.
- **Deploy da Aplicação**: Preparar o ambiente para implantação em produção.
- **Melhorias de Segurança**: Revisar e aprimorar as práticas de segurança existentes.

---

## Navegar pelo Projeto

- [Apresentação do projeto](../README.md)
- **Módulo 1**: [Arquitetura da Aplicação](../dia1/README.md)
- **Módulo 2**: [Introdução ao Docker](../dia2/README.md)
- **Módulo 3**: [MySQL Básico](../dia3/README.md)
- **Módulo 4**: [NATS e Mensageria](../dia4/README.md)
- **Módulo 5**: [Introdução ao TypeScript com Projeto Prático](../dia5/README.md)
- **Módulo 6**: [Introdução ao NestJS e Criação do Gateway](../dia6/README.md)
- **Módulo 7**: Aplicação de API com NestJS e NATS *(Você está aqui)*
- - [Módulo de Account](./README-Account.md)
- - [Módulo de Crawler](./README-Crawler.md)
- **Módulo 8**: [Frontend com VueJS e](../dia8/README.md)
