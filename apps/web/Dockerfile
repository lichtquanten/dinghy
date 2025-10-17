FROM node:24.9.0-alpine AS base
RUN corepack enable
WORKDIR /app
COPY package.json ./
RUN corepack prepare --activate

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/ ./packages/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --filter web --filter ui --filter ai-models

FROM base AS development
COPY --from=deps /app/node_modules/ ./node_modules/
COPY apps/web/ ./apps/web/
COPY packages/ ./packages/
EXPOSE 5173
CMD ["pnpm", "--filter", "web", "run", "dev"]
