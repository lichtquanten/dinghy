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
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/

FROM deps AS deps-dev
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM deps AS deps-prod
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --prod

FROM deps-dev AS development
COPY . .
EXPOSE 3000
CMD ["pnpm", "--filter", "api", "run", "dev"]

FROM deps-dev AS build-development
COPY . .
RUN pnpm --filter web run build

FROM deps-dev AS build-production
COPY . .
RUN --mount=type=secret,id=dotenv_key \
    export DOTENV_PRIVATE_KEY=$(cat /run/secrets/dotenv_key) && \
    pnpm exec dotenvx run --strict -f .env.production -- pnpm --filter web run build

FROM deps-prod AS host-production
COPY --chown=node:node --from=deps-prod /app/node_modules/ ./node_modules
COPY --chown=node:node apps/api ./apps/api/
COPY --chown=node:node --from=build-production /app/apps/web/dist ./apps/api/public/
COPY --chown=node:node .env.production ./
USER node
EXPOSE 3000
CMD ["pnpm", "exec", "dotenvx", "run", "--strict", "-f", ".env.production", "--", "pnpm", "--filter", "api", "run", "start"]