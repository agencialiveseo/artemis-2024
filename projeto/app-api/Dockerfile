FROM node:20.17.0

WORKDIR /app

COPY package*.json /app
COPY src/ /app/src
COPY tsconfig*.json /app
COPY prisma/ /app/prisma

RUN npm ci

RUN npx prisma generate

RUN npm run build

RUN rm -rf /app/src

EXPOSE 3000

CMD ["npm", "run", "start:prod:migrate"]