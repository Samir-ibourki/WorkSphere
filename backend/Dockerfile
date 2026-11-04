FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
COPY src/prisma ./src/prisma
RUN npm install
COPY . .
EXPOSE 3030
CMD ["npm", "start"]







