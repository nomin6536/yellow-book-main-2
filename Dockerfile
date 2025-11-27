FROM node:20-bullseye-slim AS builder
WORKDIR /app

# copy repo sources needed for build
COPY package.json package-lock.json nx.json ./
COPY tsconfig.base.json ./
COPY apps/ ./apps/
COPY libs/ ./libs/
COPY prisma/ ./prisma

RUN npm install --legacy-peer-deps

# generate prisma client if needed
RUN npx prisma generate || true

# build web app with nx/next (produces apps/web/.next)
RUN npx nx build @yellow/web --prod

# runner
FROM node:20-bullseye-slim AS runner
WORKDIR /app

# copy built app (next build output) and public/static sources
COPY --from=builder /app/apps/web ./

# copy production node_modules created in builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV=production
EXPOSE 3000

# start the Next.js app from the apps/web folder
CMD ["npx", "next", "start", "--hostname", "0.0.0.0", "--port", "3000"]