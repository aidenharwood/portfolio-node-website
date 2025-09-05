FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app

COPY --from=builder /app/dist ./dist
npm ci --omit=dev

EXPOSE 3000
CMD ["serve", "-s", "dist"]