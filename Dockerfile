FROM node:20.11.0

WORKDIR /src/

COPY package.json /
COPY package-lock.json /

RUN npm install

COPY . . 

EXPOSE 5000

CMD ["npm", "run", "start:prod"]