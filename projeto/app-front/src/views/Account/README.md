### Tutorial: Criando um Componente de Login com Vue 3 e Vuetify

#### 1. **Configuração do Projeto Vue 3 e Vuetify**

Se você ainda não tem um projeto configurado com Vue 3 e Vuetify, siga estas etapas para configurar:

1. **Criar um novo projeto Vue 3:**

```bash
npm init vue@latest
cd nome-do-projeto
npm install
```

2. **Instalar Vuetify:**

```bash
npm install vuetify@next
```

3. **Configurar Vuetify no seu projeto:**

Edite o arquivo `main.ts` ou `main.js` para importar o Vuetify:

```typescript
// src/main.ts
import { createApp } from "vue";
import App from "./App.vue";
import { createVuetify } from "vuetify";
import "vuetify/styles"; // Estilos base do Vuetify
import { aliases, mdi } from "vuetify/iconsets/mdi"; // Ícones Material Design

// Vuetify Configuração
const vuetify = createVuetify({
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
});

const app = createApp(App);
app.use(vuetify);
app.mount("#app");
```

#### 2. **Criando o Componente de Login**

Agora vamos criar o arquivo do componente de login.

1. **Crie uma pasta `views` dentro da pasta `src`.**
2. **Crie uma pasta `Account` dentro da pasta `views`.**
3. **Crie um arquivo `Login.vue` dentro da pasta `Account`.**

#### 3. **Explicação do Componente**

- **Formulário de Login:**

  - Usa o `v-form` do Vuetify com campos de texto (`v-text-field`) para capturar o email e a senha.
  - Valida o formulário com as regras definidas em `rules` (campo obrigatório, email válido e tamanho da senha).

- **Validação do Formulário:**

  - `isValid`: Indica se o formulário é válido ou não.
  - Regras de validação:
    - `required`: Verifica se o campo não está vazio.
    - `email`: Verifica se o email tem um formato válido.
    - `password_size`: Verifica se a senha tem pelo menos 6 caracteres.

- **Autenticação:**
  - O `login` chama a função `loginUser` que interage com o serviço de autenticação.
  - Se o login for bem-sucedido, o token é armazenado e o usuário é redirecionado para a página principal (no caso, `"crawler-list"`).
  - Em caso de erro, uma mensagem de alerta é exibida.

#### 4. **Serviços de Autenticação e Sessão**

Aqui estão exemplos dos serviços `authService.ts` e `sessionService.ts` que você pode configurar:

1. **Serviço de Autenticação (`authService.ts`):**

```typescript
// src/services/authService.ts
import { axiosInstance } from "@/services/apiService";

export async function loginUser(credentials: {
  email: string;
  password: string;
}) {
  const response = await axiosInstance.post("/account/login", credentials);
  return response.data;
}
```

2. **Serviço de Sessão (`sessionService.ts`):**

```typescript
// src/services/sessionService.ts
export function setSessionToken(token: string) {
  localStorage.setItem("authToken", token);
}

export function getSessionToken() {
  return localStorage.getItem("authToken");
}

export function clearSession() {
  localStorage.removeItem("authToken");
}
```

#### 5. **Adicionando Rotas (Router)**

Você precisa definir as rotas para navegação entre a página de login e outras páginas, como o cadastro e a lista de itens. Edite o arquivo `router/index.ts`:

```typescript
import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Account/Login.vue";
import Register from "@/views/Account/Register.vue"; // Crie esse componente

const routes = [
  { path: "/", name: "login", component: Login },
  { path: "/register", name: "register", component: Register },
  {
    path: "/crawler-list",
    name: "crawler-list",
    component: () => import("@/components/CrawlerList.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
```

#### 6. **Estilos e Layout**

O contêiner Vuetify (`v-container`) e o cartão (`v-card`) são usados para centralizar o formulário na tela e melhorar o layout. O CSS adicional em `style scoped` garante que o contêiner preencha a altura da tela e alinha o formulário no centro verticalmente.

#### 7. **Testando o Componente**

Agora, execute o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse `http://localhost:3000` (ou a porta configurada) e teste o componente de login. Ele deve validar o formulário, autenticar o usuário e armazenar o token da sessão.

---

Este tutorial fornece uma implementação completa de um componente de login com Vuetify e Vue 3. Ele inclui validação de formulário, integração com a API de autenticação e tratamento de erros. Você pode ajustar o layout e adicionar outras funcionalidades, como autenticação de sessão persistente.

---

### Tutorial: Criando um Componente de Registro com Vue 3 e Vuetify

#### 1. **Criando o Componente de Registro**

1. **Criar o arquivo do componente:**

Dentro da pasta `src/views/Account`, crie o arquivo `Register.vue` e adicione o seguinte código:

#### 3. **Explicação do Componente**

- **Formulário de Registro:**

  - Utiliza o `v-form` do Vuetify com campos de texto (`v-text-field`) para capturar o email, senha e a confirmação da senha.
  - As regras de validação incluem:
    - Campo obrigatório (`rules.required`),
    - Validação de email (`rules.email`),
    - Validação de tamanho de senha e confirmação de senha (`rules.password_size` e `rules.password_check`).

- **Validação do Formulário:**

  - `isValid`: Verifica se o formulário está válido.
  - Regras de validação:
    - `required`: Campo obrigatório.
    - `email`: Verifica se o email está em um formato válido.
    - `password_check`: Verifica se as senhas são iguais.
    - `password_size`: Verifica se a senha tem pelo menos 6 caracteres.

- **Autenticação e Registro:**
  - A função `register` chama a função `registerUser` do serviço de autenticação para criar a conta do usuário.
  - Se o registro for bem-sucedido, o token de autenticação é armazenado e o usuário é redirecionado para a página inicial.
  - Em caso de erro, uma mensagem de erro é exibida no `v-alert`.

#### 2. **Adicionando Rotas**

Adicione as rotas para que o componente de registro e a página de login funcionem corretamente:

1. **Definir as rotas no `router/index.ts`:**

```typescript
import { createRouter, createWebHistory } from "vue-router";
import Register from "@/views/Account/Register.vue";
import Login from "@/views/Account/Login.vue";

const routes = [
  { path: "/", name: "home", component: () => import("@/components/Home.vue") },
  { path: "/register", name: "register", component: Register },
  { path: "/login", name: "login", component: Login },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
```

#### 3. **Testando o Componente**

Após configurar o componente e as rotas, execute o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse `http://localhost:3000` (ou a porta configurada) para testar o componente de registro. O formulário deve validar os dados e permitir que o usuário se registre, armazenando o token de sessão e redirecionando para a página inicial.
