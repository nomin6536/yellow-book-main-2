# 1. Base image
FROM node:20-alpine AS builder

# 2. Working directory
WORKDIR /app

# 3. Copy package files
COPY package.json ./

# 4. Install dependencies (ci биш install)
RUN npm install --legacy-peer-deps

# 5. Copy all project files
COPY . .

# 6. Build the web app
RUN npx nx build @yellow/web --prod

# --------------------------
# 7. Production image
FROM node:20-alpine AS runner

WORKDIR /app

# Copy built files from builder
COPY --from=builder /app/dist/apps/web ./

# Install only production dependencies
COPY package.json ./
RUN npm install --production --legacy-peer-deps

# Expose port 3000
EXPOSE 3000

# Start the app
CMD ["node", "main.js"]
