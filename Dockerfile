FROM node:16-alpine
# ENV NODE_ENV=production
ENV PATH /app/node_modules/.bin:$PATH
WORKDIR /usr/src/app
COPY ["package.json", "tsconfig.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm i
RUN npm run build
COPY ./dist .

CMD ["node", "fiatWorker.js"]
