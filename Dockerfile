# Gunakan node versi LTS terbaru
FROM node:20-alpine AS base

# Set environment variables
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV YARN_CACHE_FOLDER=/root/.yarn-cache

# Install dependencies yang diperlukan
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Dependencies stage
FROM base AS deps
# Install dependencies yang diperlukan untuk build
RUN apk add --no-cache git

# Copy package files
COPY package.json yarn.lock ./

# Install ALL dependencies termasuk devDependencies
ENV NODE_ENV=development
RUN yarn install && \
    yarn cache clean

# Builder stage
FROM base AS builder
WORKDIR /app

# Copy dependencies dari stage sebelumnya
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set memory untuk build
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Build aplikasi
ENV NODE_ENV=production
RUN yarn build

# Release stage
FROM base AS release
WORKDIR /app

# Buat user non-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Set directory permissions
RUN mkdir .next && \
    chown -R nextjs:nodejs .next

# Copy build output dan file yang diperlukan
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch ke user non-root
USER nextjs

# Expose port
EXPOSE 3050

# Set environment variables dengan format yang benar
ENV PORT=3050
ENV HOSTNAME="0.0.0.0"

# Command untuk menjalankan aplikasi
CMD ["node", "server.js"]
