FROM node:20.11.1-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npx", "prisma", "db", "pull"]

CMD ["npx", "prisma", "generate"]

CMD ["npm", "start"]