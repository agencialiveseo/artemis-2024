### Tutorial: Criando um Serviço de API com Axios e Interceptadores em Vue 3

#### 1. **Criando o Arquivo `apiService.ts`**

Agora, vamos criar o serviço de API que utilizará o Axios para fazer as requisições HTTP.

1. **Crie o arquivo `apiService.ts` dentro da pasta `src/services`:**

   ```bash
   src/services/apiService.ts
   ```

2. **Adicione o seguinte código ao arquivo:**

   ```typescript
   import axios from "axios";
   import { getSessionToken, removeSessionToken } from "./sessionService";
   import router from "../router";

   // Criação de uma instância Axios
   export const axiosInstance = axios.create({
     baseURL: "http://localhost:3000/", // A URL base para todas as requisições
     timeout: 60000, // Tempo limite de 60 segundos para as requisições
   });

   // Interceptor para adicionar o token JWT nas requisições
   axiosInstance.interceptors.request.use(
     (config) => {
       const token = getSessionToken(); // Recupera o token de sessão
       if (token) {
         config.headers.Authorization = `Bearer ${token}`; // Adiciona o token no cabeçalho da requisição
       }
       return config;
     },
     (error) => {
       return Promise.reject(error); // Lida com erro na requisição
     }
   );

   // Interceptor para tratar respostas de erro
   axiosInstance.interceptors.response.use(
     (response) => {
       console.log(response); // Log da resposta
       return response;
     },
     (error) => {
       if (error.response?.status === 401) {
         // Se o status for 401 (não autorizado)
         removeSessionToken(); // Remove o token inválido
         router.push("/login"); // Redireciona o usuário para a página de login
       }
       return Promise.reject(error); // Rejeita o erro para tratamento posterior
     }
   );
   ```

#### 3. **Explicação do Código**

- **Instância Axios (`axiosInstance`):**

  - Configuramos uma instância do Axios com um `baseURL` que será usada em todas as requisições. Esse `baseURL` é a URL do backend (neste exemplo, `http://localhost:3100/`).
  - Definimos um tempo limite (`timeout`) de 60 segundos para todas as requisições.

- **Interceptor de Requisição:**

  - Este interceptor é executado antes de cada requisição. Ele recupera o token de sessão do usuário (armazenado no localStorage ou outra fonte) usando a função `getSessionToken`.
  - Se o token estiver disponível, ele é anexado ao cabeçalho `Authorization` da requisição no formato `Bearer <token>`.

- **Interceptor de Resposta:**
  - Este interceptor lida com a resposta da API.
  - Caso a resposta retorne um erro com status 401 (não autorizado), o token de sessão é removido usando a função `removeSessionToken`, e o usuário é redirecionado para a página de login utilizando o `router.push('/login')`.
  - O interceptor de resposta também rejeita os erros, permitindo que sejam tratados de forma adequada nas chamadas da API.

#### 4. **Criando o Serviço de Sessão**

Agora vamos criar o serviço de sessão, que vai lidar com o armazenamento e remoção do token.

1. **Crie o arquivo `sessionService.ts` em `src/services`:**

   ```bash
   src/services/sessionService.ts
   ```

2. **Adicione o seguinte código:**

   ```typescript
   // Armazena o token no localStorage
   export function setSessionToken(token: string) {
     localStorage.setItem("authToken", token);
   }

   // Recupera o token do localStorage
   export function getSessionToken() {
     return localStorage.getItem("authToken");
   }

   // Remove o token do localStorage
   export function removeSessionToken() {
     localStorage.removeItem("authToken");
   }
   ```

#### 5. **Configurando o Router**

O serviço de API redireciona o usuário para a página de login quando ocorre um erro 401. Certifique-se de que o roteamento esteja configurado corretamente.

1. **No arquivo `router/index.ts` (ou `router.js`), adicione o seguinte código:**

   ```typescript
   import { createRouter, createWebHistory } from "vue-router";
   import Login from "@/components/Login.vue";

   const routes = [
     { path: "/login", name: "login", component: Login },
     {
       path: "/",
       name: "home",
       component: () => import("@/components/Home.vue"),
     },
   ];

   const router = createRouter({
     history: createWebHistory(),
     routes,
   });

   export default router;
   ```

#### 6. **Utilizando o `axiosInstance` nas Chamadas de API**

Agora, sempre que você precisar fazer uma requisição HTTP autenticada, basta usar a instância `axiosInstance`. Por exemplo:

```typescript
import { axiosInstance } from "@/services/apiService";

export async function fetchUserData() {
  try {
    const response = await axiosInstance.get("/user/profile");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
  }
}
```

---

### Tutorial: Gerenciando Sessões com Token JWT usando `localStorage` em Vue 3

Este tutorial guiará você na criação de um sistema básico de gerenciamento de sessão baseado em token JWT, utilizando o `localStorage` do navegador. Vamos armazenar, recuperar e remover o token de autenticação, além de verificar se o usuário está autenticado.

#### 1. **Visão Geral**

O gerenciamento de sessão com `localStorage` envolve:

- **Armazenar o token JWT** após o login.
- **Recuperar o token JWT** para ser usado em requisições autenticadas.
- **Remover o token JWT** ao realizar logout.
- **Verificar se o token JWT existe**, indicando se o usuário está autenticado.

#### 2. **Criando o Arquivo `sessionService.ts`**

Primeiro, crie um arquivo para lidar com o armazenamento do token.

1. **Criar o arquivo `sessionService.ts` dentro da pasta `src/services`:**

   ```bash
   src/services/sessionService.ts
   ```

2. **Adicione o seguinte código ao arquivo:**

   ```typescript
   const TOKEN_KEY = "auth_token";

   // Armazenar o token no localStorage
   export function setSessionToken(token: string): void {
     localStorage.setItem(TOKEN_KEY, token);
   }

   // Obter o token do localStorage
   export function getSessionToken(): string | null {
     return localStorage.getItem(TOKEN_KEY);
   }

   // Remover o token (logout)
   export function removeSessionToken(): void {
     localStorage.removeItem(TOKEN_KEY);
   }

   // Verificar se o usuário está autenticado
   export function isAuthenticated(): boolean {
     if (!getSessionToken()) {
       return false;
     }
     return true;
   }
   ```

#### 3. **Explicação do Código**

- **`TOKEN_KEY`**: Esta constante define a chave que será usada para armazenar o token no `localStorage`.

- **Funções:**
  - **`setSessionToken(token: string): void`**:
    - Armazena o token JWT no `localStorage` usando a chave `auth_token`.
  - **`getSessionToken(): string | null`**:
    - Recupera o token JWT armazenado no `localStorage`. Se não houver token, retorna `null`.
  - **`removeSessionToken(): void`**:
    - Remove o token JWT do `localStorage`, efetivamente realizando o logout.
  - **`isAuthenticated(): boolean`**:
    - Verifica se o token JWT está presente no `localStorage`. Se sim, retorna `true` (usuário autenticado), caso contrário, retorna `false`.

#### 4. **Como Utilizar o Serviço de Sessão**

Agora que temos o serviço de sessão pronto, podemos utilizá-lo nas operações de login, logout e para verificar se o usuário está autenticado.

##### **1. Armazenando o Token Após o Login**

Quando o usuário realizar o login com sucesso, você deve armazenar o token JWT no `localStorage` usando a função `setSessionToken`.

Exemplo:

```typescript
import { loginUser } from "@/services/authService";
import { setSessionToken } from "@/services/sessionService";

const login = async (credentials) => {
  try {
    const response = await loginUser(credentials);
    setSessionToken(response.token); // Armazenar o token no localStorage
    // Redirecionar o usuário para outra página, por exemplo, a página principal
  } catch (error) {
    console.error("Erro ao fazer login", error);
  }
};
```

##### **2. Verificando se o Usuário Está Autenticado**

Você pode verificar se o usuário está autenticado utilizando a função `isAuthenticated`.

Exemplo:

```typescript
import { isAuthenticated } from "@/services/sessionService";

if (isAuthenticated()) {
  console.log("Usuário está autenticado");
} else {
  console.log("Usuário não está autenticado");
}
```

##### **3. Removendo o Token (Logout)**

Ao realizar o logout, você pode remover o token JWT do `localStorage` usando a função `removeSessionToken`.

Exemplo:

```typescript
import { removeSessionToken } from "@/services/sessionService";

const logout = () => {
  removeSessionToken(); // Remove o token do localStorage
  // Redirecionar o usuário para a página de login ou outra página
};
```

#### 5. **Testando o Serviço de Sessão**

- **Login**: Após fazer o login e armazenar o token com `setSessionToken`, verifique no `localStorage` do navegador se o token foi armazenado corretamente.
- **Autenticação**: Utilize a função `isAuthenticated` para garantir que o sistema reconheça o usuário como autenticado quando o token estiver presente.
- **Logout**: Certifique-se de que, ao realizar logout com `removeSessionToken`, o token seja removido e o usuário não esteja mais autenticado.

#### 6. **Conclusão**

Com esse serviço de sessão, você pode facilmente gerenciar o token JWT no lado do cliente em um projeto Vue 3, usando o `localStorage` para armazenar, recuperar e remover o token. Isso permite que seu aplicativo controle o estado de autenticação do usuário de forma eficaz.

### Tutorial: Desenvolvendo Funções de Login e Registro com Axios em TypeScript

#### 1. **Criando o Serviço de API**

Você precisará criar um serviço de API central onde o Axios será configurado. Este serviço lidará com as requisições HTTP.

1. **Crie uma pasta `services` dentro da pasta `src`**.
2. **Crie um arquivo chamado `authService.ts` dentro de `services`.**

```typescript
// src/services/apiService.ts
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://sua-api-base-url.com/api", // Substitua pela URL base real da sua API
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Opcional: Adicione interceptadores para lidar com requisições/respostas
axiosInstance.interceptors.request.use((config) => {
  // Anexe o token de autorização ou modifique os headers da requisição, se necessário
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Lida com erros globais de resposta, como 401, 500
    return Promise.reject(error);
  }
);
```

#### 2. **Entendendo os Tipos e Interfaces**

No TypeScript, você precisa definir os tipos de dados para as funções para garantir a segurança de tipo.

- `Credentials`: Define a estrutura para as credenciais de login/registro.
- `LoginResponse`: Define a resposta esperada da API, que contém o token.

```typescript
// Definindo interfaces para os tipos de requisição e resposta

interface Credentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}
```

#### 3. **Desenvolvendo a Função `loginUser`**

Esta função é responsável por enviar as credenciais do usuário (email e senha) para o endpoint de login da API e retornar o token de autenticação.

```typescript
export async function loginUser(
  credentials: Credentials
): Promise<LoginResponse> {
  try {
    const response = await axiosInstance.post<LoginResponse>(
      "/account/login",
      credentials
    );
    return response.data; // Retorna o token da resposta
  } catch (error) {
    throw new Error("Erro ao realizar login"); // Tratamento de erro
  }
}
```

**Explicação**:

- `axiosInstance.post`: Faz uma requisição `POST` para o endpoint de login `/account/login`.
- `credentials`: O `email` e a `senha` são enviados para autenticar o usuário.
- A função retorna os dados da resposta contendo o token.

#### 4. **Desenvolvendo a Função `registerUser`**

Esta função é semelhante à função `loginUser`, exceto que envia as credenciais para o endpoint `/account/register` para criar uma nova conta.

```typescript
export async function registerUser(
  credentials: Credentials
): Promise<LoginResponse> {
  try {
    const response = await axiosInstance.post<LoginResponse>(
      "/account/register",
      credentials
    );
    return response.data; // Retorna o token após o registro
  } catch (error) {
    throw new Error("Erro ao realizar login"); // Tratamento de erro
  }
}
```

**Explicação**:

- Envia as `credentials` (email e senha) para o endpoint de registro.
- Lida com as respostas bem-sucedidas e erros da mesma forma que a função `loginUser`.

---
