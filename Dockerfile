FROM node:alpine

WORKDIR /mapbox-demo

COPY package*.json .

COPY . .

RUN npm run build

CMD [ "npm", "start" ]

#Build this image –
#docker build . -t <your username>/mapbox-demo

#Run this image
#docker run -p 3300:3300 -d <your username>/mapbox-demo