FROM node:16-alpine
# ENV NODE_ENV=production
ENV PATH /app/node_modules/.bin:$PATH
WORKDIR /usr/src/app
COPY ["package.json", "tsconfig.json", "package-lock.json*", "prisma", "./"]
RUN npm i
COPY ./src .
RUN npx prisma generate
RUN npm run build
RUN ls

CMD ["node", "dist/fiatWorker.js"]
