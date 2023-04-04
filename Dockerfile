FROM node:18-alpine

WORKDIR /client

COPY . .

RUN yarn

RUN yarn build

EXPOSE 3000

CMD yarn start