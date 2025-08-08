# Use the official Node.js runtime as the base image
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
COPY apps/admin/package.json ./apps/admin/
COPY apps/student/package.json ./apps/student/
COPY packages/db/package.json ./packages/db/
COPY packages/ui/package.json ./packages/ui/

# Install dependencies
RUN pnpm install --frozen-lockfile
RUN pnpm add -D @eslint/js

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Build all applications
RUN pnpm turbo run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the standalone outputs
COPY --from=builder /app/apps/admin/.next/standalone ./apps/admin/
COPY --from=builder /app/apps/admin/.next/static ./apps/admin/.next/static
COPY --from=builder /app/apps/admin/public ./apps/admin/public

COPY --from=builder /app/apps/student/.next/standalone ./apps/student/
COPY --from=builder /app/apps/student/.next/static ./apps/student/.next/static
COPY --from=builder /app/apps/student/public ./apps/student/public

# Set the correct permission for prerender cache
RUN mkdir -p apps/admin/.next apps/student/.next
RUN chown -R nextjs:nodejs apps/

USER nextjs

EXPOSE 3000 3001

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Default to running the student app
# You can override this with CMD ["node", "apps/admin/server.js"] for admin
CMD ["node", "apps/student/server.js"]
