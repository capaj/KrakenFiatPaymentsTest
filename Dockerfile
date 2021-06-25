FROM node:16-alpine
# ENV NODE_ENV=production
ENV PATH /app/node_modules/.bin:$PATH
ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

WORKDIR /usr/src/app
COPY ["package.json", "tsconfig.json", "package-lock.json*", "prisma", "./"]
RUN npm i
COPY ./src .
# we need  this before tsc runs
RUN npx prisma generate 
RUN npm run build


CMD dockerize -wait tcp://db:5432 -timeout 60m npm run migrateAndRun

