FROM node:12-alpine3.9

WORKDIR /app

COPY . /app/

RUN npm install express
RUN npm install --production

# Installation de dockerize
RUN apk add --no-cache openssl
RUN wget https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-linux-amd64-v0.6.1.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-v0.6.1.tar.gz \
    && rm dockerize-linux-amd64-v0.6.1.tar.gz

RUN ls -l

CMD ["dockerize", "-wait", "tcp://db:3306", "-timeout", "60s", "node", "app.js"]