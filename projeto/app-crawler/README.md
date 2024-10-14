
# **App Crawler**

## **Rodando o projeto**

Essa será nossa única aplicação que não fará parte do docker-compose.yml, pois será iniciada sob-demanda pelo app-gateway.

Para rodar o projeto local, basta criar uma cópia do arquivo `.env_demo` como `.env` na raiz do projeto e setar a variável `ENVIRONMENT=development`.

Para rodar a docker do projeto, você pode usar o .env_demo para testes:
```bash
docker build -t app-crawler .
docker run --env-file=.env_demo --network projeto_artemis --rm app-crawler
```

## **Navegar pelo projeto**
A estrutura de arquivos do projeto segue uma organização modular que facilita a navegação e a separação de responsabilidades entre diferentes componentes. Abaixo está uma descrição da estrutura e a responsabilidade de cada parte:

### Arquivos de configuração e metadata:
- **`.env_demo`**: Contém variáveis de ambiente usadas no projeto, como credenciais e configurações de ambiente. A versão `demo` serve como um exemplo para criação da versão `.env` ou ser usada de referência.
- **`.gitignore`**: Define os arquivos e pastas que devem ser ignorados pelo Git (e.g., `node_modules`, variáveis sensíveis).
- **`Dockerfile`**: Define as instruções para criar uma imagem Docker personalizada para o projeto.
- **`package.json` / `package-lock.json`**: Informações sobre as dependências do projeto e scripts configurados para rodar comandos, como `start`, `build`, etc.
- **`tsconfig.json`**: Configurações do TypeScript, incluindo paths, target e outras opções de compilação.
- **`.vscode`**: Configurações específicas do editor Visual Studio Code, otimizando o ambiente de desenvolvimento.

### Estrutura de código:
- **`src/`**: Pasta principal contendo o código-fonte do projeto.
  - **`@types/`**: Arquivos de definição de tipos, geralmente utilizados para estender ou adaptar tipos em bibliotecas de terceiros.
  - **`core/`**: Contém a lógica central e as funções principais que governam o comportamento do projeto.
  - **`helpers/`**: Módulos de suporte que contêm funções auxiliares reutilizáveis, como formatação de dados, gerenciamento de requisições e outras funções utilitárias.
  - **`modules/`**: Módulos independentes que contêm funcionalidades específicas do sistema, como integração com APIs, serviços de NATS, e outras operações encapsuladas.
  - **`main.ts`**: O ponto de entrada principal da aplicação, que inicializa os serviços e começa o processamento principal.

### Navegação:
1. **Início**: O ponto de partida do projeto é o arquivo `main.ts`, que coordena a inicialização dos módulos e dos serviços.
2. **Modularização**: Os módulos dentro de `modules/` contêm funcionalidades específicas, como requisições HTTP ou interações com o sistema de mensagens NATS.
3. **Suporte**: Funções de apoio estão no diretório `helpers/`, garantindo a reutilização de lógica comum, como verificação de `robots.txt` ou configuração de requisições via Axios ou Puppeteer.