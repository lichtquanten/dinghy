FROM node:24.9.0-alpine AS base
RUN corepack enable
WORKDIR /app
COPY package.json ./
RUN corepack prepare --activate

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY packages/ui/package.json ./packages/ui/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile


FROM base AS development
COPY --from=deps /app/node_modules/ ./node_modules/
COPY . .
EXPOSE 3000
CMD ["pnpm", "--filter", "api", "run", "dev"]


FROM base AS build
COPY --from=deps /app/node_modules/ ./node_modules/
COPY . .
RUN pnpm --filter web run build


FROM node:24.9.0-alpine AS production
RUN corepack enable
WORKDIR /app
COPY package.json ./
USER node
RUN corepack prepare --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --from=deps /app/node_modules/ ./node_modules
COPY --from=deps /app/apps/api/node_modules/ ./apps/api/node_modules/

COPY --from=build /app/apps/web/dist ./apps/api/public/

COPY apps/api/package.json ./apps/api/
COPY apps/api/src/ ./apps/api/src/

EXPOSE 3000
CMD ["pnpm", "--filter", "api", "run", "start"]