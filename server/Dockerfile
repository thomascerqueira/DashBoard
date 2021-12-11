FROM node:lts

USER root

WORKDIR /app/server

COPY package.json .

RUN npm install
RUN npm install -g nodemon

EXPOSE 8080

COPY . .

CMD ["npm", "start"]