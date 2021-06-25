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

ENTRYPOINT [ "/usr/bin/python3", "dockerize", "-wait", "tcp://db:5432" ]
CMD [ "npm", "run", "migrateAndRun" ]