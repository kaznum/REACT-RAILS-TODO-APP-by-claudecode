FROM node:20

WORKDIR /app

COPY package*.json ./

COPY . .

EXPOSE 8080

CMD ["sh", "-c", "npm install && npm run server"]
