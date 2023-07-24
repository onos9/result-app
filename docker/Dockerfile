#############################################
# App Builder: From developrnt to production
#############################################
FROM node:lts-alpine as builder
WORKDIR /app

COPY package*.json .
RUN npm ci

COPY .env .
COPY prisma ./prisma
RUN npx prisma db push
RUN npx prisma db seed
RUN npx prisma generate

COPY . .
RUN npm run build
RUN npm prune --production

#############################################
# App Runner: Production image runner
#############################################
FROM node:lts-alpine as runner

WORKDIR /app

COPY --from=builder /app/.env ./.env
COPY --from=builder /app/build ./build/
COPY --from=builder /app/prisma ./prisma/
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules/

ENV NODE_ENV=production
ENTRYPOINT ["node", "build"]