FROM node:20.17.0

WORKDIR /app

# Instala dependências do puppeteer para rodar na docker headless
RUN apt update 
RUN apt install -y \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils

# Limpa cache do apt - para economizar espaço
RUN apt-get clean

# Limpa arquivos temporários - para economizar espaço
RUN rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

COPY package.json /app
COPY package-lock.json /app
COPY src/ /app/src
COPY tsconfig.json /app

# Realiza a instalação via npm CI ao invés de install
# Isso é recomendado para uso em ambientes de produção
RUN npm ci

# Compila o código TypeScript
RUN npm run build

# Apaga arquivos que não serão mais usados após compilação
RUN rm -rf /app/src

CMD ["node", "dist/main.js"]