FROM node:20-alpine AS base
RUN apk add --no-cache openssl tini
WORKDIR /app
RUN npm i -g pnpm@9 --silent

FROM base AS deps
COPY package*.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN pnpm install --frozen-lockfile=false

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production PORT=5000
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
# Prisma needs schema + migrations at runtime for `migrate deploy`
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./
COPY package*.json ./
EXPOSE 5000
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["npm", "run", "start:prod"]