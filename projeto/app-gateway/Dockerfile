FROM node:20.17.0

WORKDIR /app

COPY package*.json /app
COPY src/ /app/src
COPY tsconfig*.json /app

RUN npm ci

RUN npm run build

RUN rm -rf /app/src

CMD ["node", "dist/main.js"]