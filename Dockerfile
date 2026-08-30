# Build stage for frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Production stage for server
FROM node:20-alpine
WORKDIR /app
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install --production

WORKDIR /app
COPY server/ ./server/
COPY --from=frontend-builder /app/client/dist ./client/dist

ENV PORT=3001
ENV NODE_ENV=production

EXPOSE 3001
CMD ["node", "server/server.js"]
