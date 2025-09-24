FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN cp .env.example .env.local

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
