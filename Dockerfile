FROM node:20.11.1-slim
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV SCHEMA_PATH=./src/repo/prisma/schema.prisma

RUN npx prisma db pull --schema=$SCHEMA_PATH
RUN npx prisma generate --schema=$SCHEMA_PATH

EXPOSE 8080

CMD ["npm", "start"]