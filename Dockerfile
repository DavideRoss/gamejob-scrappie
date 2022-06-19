# https://gist.github.com/zmts/509f224950f85f3cfe4365e2b80081d1

FROM node:lts

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

COPY src /app/src

RUN ls -a

RUN npm install
RUN npm run build

EXPOSE 7777

CMD ["npm", "start"]