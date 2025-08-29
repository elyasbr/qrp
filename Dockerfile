FROM node:20.5.1-alpine AS builder

RUN apk update && apk add git bash curl brotli

WORKDIR /app

COPY . .

RUN npm install --legacy-peer-deps
RUN npm run build

RUN find .next -type f -exec brotli -Z {} \;

FROM node:20.5.1-alpine AS runner

WORKDIR /app

COPY --from=builder /app /app

RUN npm ci --only=production

ENV NODE_ENV production

EXPOSE 4040

CMD ["npm", "run", "start"]