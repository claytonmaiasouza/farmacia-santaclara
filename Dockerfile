FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV OPENAI_API_KEY=build_placeholder
ENV OPENROUTER_API_KEY=build_placeholder
ENV DATABASE_URL=postgresql://placeholder:placeholder@localhost:5432/placeholder
ENV NEXTAUTH_SECRET=build_placeholder_secret_32chars_minimum
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules/pdfkit ./node_modules/pdfkit
COPY --from=builder /app/node_modules/imapflow ./node_modules/imapflow
COPY --from=builder /app/node_modules/nodemailer ./node_modules/nodemailer
RUN mkdir -p .next/cache && chown -R nextjs:nextjs .next
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
