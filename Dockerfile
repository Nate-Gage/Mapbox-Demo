FROM node:alpine

WORKDIR /mapbox-demo

COPY package*.json .

COPY . .

RUN npm run build

CMD [ "sh", "-c", "npm run start" ]