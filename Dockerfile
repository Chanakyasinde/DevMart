FROM node:18-alpine AS client-build

WORKDIR /app/client

COPY client/package*.json ./
RUN npm ci

COPY client/ .
RUN npm run build

FROM node:18-alpine AS server-build

WORKDIR /app/server

COPY server/package*.json ./
RUN npm ci --omit=dev

COPY server/ .


FROM node:18-alpine AS production

WORKDIR /app

COPY --from=server-build /app/server ./server

COPY --from=client-build /app/client/dist ./server/public

ENV NODE_ENV=production
ENV PORT=5001

EXPOSE 5001

CMD ["node", "server/src/index.js"]
