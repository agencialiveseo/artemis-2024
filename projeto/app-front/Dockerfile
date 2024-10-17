# Etapa 1: Construir a aplicação
FROM node:20.17.0 AS build

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY src/ ./src
COPY index.html ./
COPY public/ ./public
COPY vite.config.mts ./

RUN npm ci

RUN npm run build

# Etapa 2: Servir a aplicação usando Nginx
FROM nginx:latest

# Remover o site padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar os artefatos de build da etapa anterior
COPY --from=build /app/dist/ /usr/share/nginx/html

# Configura nginx para fornecer a aplicação Vue.js
#RUN echo "server { listen 80; server_name _; root /usr/share/nginx/html; index index.html; location / { try_files $uri $uri/ /index.html; } location = /index.html { try_files /index.html =404; } }" > /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor a porta 80
EXPOSE 80

# Iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]