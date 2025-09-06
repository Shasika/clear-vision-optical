# Multi-stage build for optimal image size
FROM node:20-alpine AS frontend-builder

# Set working directory for frontend build
WORKDIR /app

# Copy frontend package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

# Install frontend dependencies
RUN npm ci --only=production

# Copy frontend source code
COPY src/ ./src/
COPY public/ ./public/
COPY index.html ./

# Build frontend
RUN npm run build

# Backend stage
FROM node:20-alpine AS backend-builder

# Set working directory for backend
WORKDIR /app/server

# Copy backend package files
COPY server/package*.json ./

# Install backend dependencies
RUN npm ci --only=production

# Copy backend source code
COPY server/ ./

# Production stage
FROM node:20-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy backend from builder stage
COPY --from=backend-builder --chown=nodejs:nodejs /app/server ./server

# Copy frontend build from builder stage
COPY --from=frontend-builder --chown=nodejs:nodejs /app/dist ./public/dist

# Create necessary directories
RUN mkdir -p ./public/data ./public/images/frames ./public/images/sunglasses ./public/images/company
RUN chown -R nodejs:nodejs ./public

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Start the server
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server/server.js"]