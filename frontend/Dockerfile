FROM node:20-alpine AS base
RUN apk add --no-cache tini
WORKDIR /app

FROM base AS deps
COPY package*.json ./
RUN npm install --silent

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production PORT=3000 NEXT_TELEMETRY_DISABLED=1
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./
EXPOSE 3000
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["npm", "start"]