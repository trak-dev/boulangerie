FROM node:20-alpine

RUN mkdir -p /home/node/app
WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

RUN chown -R node:node /home/node/app

USER node

COPY --chown=node:node ./dist .

EXPOSE 8080

CMD ["node", "index.js"]
