## **Introdução ao Vue 3**

Vue 3 é um framework JavaScript usado para criar interfaces de usuário interativas de forma simples e eficiente. Ele facilita a construção de sites e aplicativos modernos, permitindo que desenvolvedores organizem melhor o código e reutilizem partes dele com a Composition API. O Vue 3 também é rápido, graças à forma como atualiza a tela de maneira inteligente usando o Virtual DOM. Com ferramentas como o Vue Router para navegar entre páginas e Pinia para gerenciar informações no aplicativo, ele é uma ótima escolha para quem quer criar projetos web.

**Composition Api**

A Composition API é um recurso do Vue 3 que permite organizar e reutilizar código de forma mais flexível e eficiente. Em vez de usar a abordagem tradicional de opções, como `data`, `methods` e `computed`, a Composition API permite que você agrupe funcionalidades relacionadas em uma única função chamada `setup()`.

Dentro do `setup()`, você pode definir variáveis reativas, funções e até mesmo importar outros recursos de forma mais intuitiva. Isso facilita a criação de componentes mais complexos e a manutenção do código, tornando-o mais fácil de entender e testar. A Composition API é especialmente útil em projetos grandes, onde o reuso e a organização do código são essenciais.

O Vue 3 oferece uma variedade de funções e recursos que tornam o desenvolvimento de interfaces de usuário mais fácil e eficiente. Aqui estão algumas das principais funções e conceitos do Vue 3:

### 1. **Reatividade**

- **`reactive()`**: Cria um objeto reativo que rastreia alterações. Ideal para gerenciar estados complexos em aplicações.

  ```javascript
  import { reactive } from "vue";

  const state = reactive({
    count: 0,
  });
  ```

- **`ref()`**: Cria uma referência reativa a um valor primitivo, permitindo que valores simples sejam reativos.

  ```javascript
  import { ref } from "vue";
  const count = ref(0);
  ```

### 2. **Composition API**

- **`setup()`**: É a função principal da Composition API, onde você pode definir estado reativo, métodos e computações antes do componente ser montado.

  ```javascript
  import { defineComponent } from "vue";

  export default defineComponent({
    setup() {
      // lógica do componente aqui
    },
  });
  ```

### 3. **Ciclo de Vida**

- **Ciclo de Vida do Componente**: O Vue 3 oferece hooks do ciclo de vida que permitem executar código em diferentes momentos do ciclo de vida de um componente, como `onMounted`, `onUpdated`, e `onUnmounted`.

  ```javascript
  import { onMounted } from "vue";

  onMounted(() => {
    console.log("Componente montado!");
  });
  ```

### 4. **Computed Properties**

- **`computed()`**: Permite criar propriedades que são automaticamente recalculadas quando suas dependências reativas mudam. Isso é útil para calcular valores derivados de outros dados.

  ```javascript
  import { computed } from "vue";

  const fullName = computed(() => `${state.firstName} ${state.lastName}`);
  ```

### 5. **Watchers**

- **`watch()`**: Permite observar mudanças em variáveis reativas e executar funções em resposta a essas mudanças. Isso é útil para operações assíncronas ou efeitos colaterais.

  ```javascript
  import { watch } from "vue";

  watch(count, (newValue) => {
    console.log(`Novo valor: ${newValue}`);
  });
  ```

### 6. **Diretivas**

- **Diretivas como `v-if`, `v-for`, `v-bind`, `v-model`**: São usadas para manipular o DOM de maneira reativa. Por exemplo, `v-if` controla a renderização de elementos condicionalmente.

- `v-model`: Vincula dados entre um elemento de entrada e uma variável, permitindo atualização automática. É utilizado para formulários e entrada de dados.

- `v-for`: Permite a renderização de listas de elementos baseadas em um array ou objeto, criando componentes dinamicamente. Ideal para exibir coleções de dados.

- `v-if`: É uma diretiva que condiciona a renderização de um elemento no DOM com base em uma expressão booleana. Se a expressão for verdadeira, o elemento é exibido; caso contrário, ele é removido do DOM. É útil para mostrar ou ocultar partes da interface do usuário.

```html
<div v-if="isVisible">Este texto aparece condicionalmente.</div>
```

### 7. **Router e Estado Global**

- **Vue Router**: Permite gerenciar a navegação entre páginas em aplicações de página única (SPA).

- **Pinia**: Biblioteca para gerenciamento de estado global, substituindo o Vuex, com uma API mais simples e intuitiva.

### Resumo

Essas funções e recursos do Vue 3 proporcionam uma maneira poderosa e flexível de construir aplicações interativas e escaláveis. Com a reatividade, a Composition API e os componentes reutilizáveis, o Vue 3 facilita a criação de interfaces de usuário dinâmicas e responsivas.

### Instalação

Nosso projeto será iniciado utilizando o seguinte comando:

```javascript
npm create vuetify@latest
```

Devemos selecionar algumas opções:

- Project name: nome-do-seu-projeto
- Use Typescript: No / > Yes
- Would you like to install dependencies with yarn, npm or pnpm:

  yarn\
   ❯ npm\
   pnpm\
   bun\
   none

Essa instalação trará por padrão:

- Vue3
- Typescript
- Vuetify
- Vue Router
- Pinia

Instalar o pacote do Axios:

```javascript
npm install axios
```

## Aplicação frontend com Vue3, Vuetify, Pinia e Vue Router

Neste módulo iremos criar frontend do nosso projeto, criando uma tela de login, uma tela de listagem de rastreios e uma tela para exibição dos detalhes do rastreio.

## Tela de login

- Criar o arquivo authService onde será chamada a rota de autenticação e de criação do usuário;
- Criar o componente Login, que irá validar se o campo é um e-mail e logar o usuário na aplicação;
- Criar o componente Register para registrar o usuário na aplicação
- Adicionar a rota para o login e para o register dentro do router;

Acessar o README do services para as instruções da API.

Acessar o README do views/Account para as instruções do front.

## Tela inicial da aplicação

- Criar o componente da Home da aplicação, essa tela terá uma barra com o nome da aplicação e o botão de logaout;
- Adcionar ao arquivo de rotas a rota da home;

Acessar o README do views;

## Tela de listagem de Crawlers

- Criar o arquivo de crawlerService que será responsável por fazer as requisições referentes ao crawler;
- Criar o componente crawlerList que trará uma tabela com a listagem de crawlers e com um botão para iniciar um novo rastreio;
- Adicionar a rota para a tela com o componente crawlerList;

Acessar o README do Crawler

## Tela de detalhes do rastreio

- Criar o arquivo Details dentro da pasta Crawler;
- Adicionar a rota para a tela, passando como parametro o id do rastreio.

Acessar o README do Crawler

---

## Navegar pelo Projeto

- [Apresentação do projeto](../README.md)
- **Módulo 1**: [Arquitetura da Aplicação](../dia1/README.md)
- **Módulo 2**: [Introdução ao Docker](../dia2/README.md)
- **Módulo 3**: [MySQL Básico](../dia3/README.md)
- **Módulo 4**: [NATS e Mensageria](../dia4/README.md)
- **Módulo 5**: [Introdução ao TypeScript com Projeto Prático](../dia5/README.md)
- **Módulo 6**: [Introdução ao NestJS e Criação do Gateway](../dia6/README.md)
- **Módulo 7**: [Aplicação de API com NestJS e NATS](../dia7/README.md)
- **Módulo 8**: Frontend com Vue.js 3 *(Você está aqui)*