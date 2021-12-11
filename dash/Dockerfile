FROM node:lts

USER root

WORKDIR /app/dash

COPY package.json .

RUN npm install

COPY . .

CMD ["npm", "start"]