FROM node:16-alpine
ENV NODE_ENV=production
ENV PATH /app/node_modules/.bin:$PATH
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm ci
COPY ./dist .

CMD ["node", "import-worker.js"]
