FROM node:lts

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY scrappie-config.yml ./

COPY src /app/src

RUN ls -a

RUN npm install
RUN npm run build

EXPOSE 7777

CMD ["npm", "start"]