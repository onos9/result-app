FROM node:lts-slim as build

RUN apt-get -qy update && apt-get -qy install openssl
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY .env ./
COPY prisma ./prisma/
RUN npx prisma db push
RUN npx prisma db seed

COPY . .
RUN npm run build

# production image runner
FROM node:lts-slim as run

RUN apt-get -qy update && apt-get -qy install openssl
WORKDIR /app

COPY --from=build /app/package.json ./package.json
RUN npm install --omit=dev

COPY --from=build /app/prisma ./prisma/
RUN npx prisma generate

COPY --from=build /app/build ./build
COPY --from=build /app/.env ./.env

ENTRYPOINT [ "npm", "run", "prod"]