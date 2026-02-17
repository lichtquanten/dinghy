# =============================================================================
# BASE STAGE
# =============================================================================
FROM node:24.9.0-alpine AS base
RUN corepack enable
WORKDIR /app
COPY package.json ./
RUN corepack prepare --activate

# =============================================================================
# PACKAGE.JSON STAGE
# =============================================================================
FROM base AS package-json
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY packages/db/package.json ./packages/db/
COPY packages/pairing/package.json ./packages/pairing/
COPY packages/seed/package.json ./packages/seed/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/yjs-store/package.json ./packages/yjs-store/
COPY packages/ui/package.json ./packages/ui/

# =============================================================================
# DEVELOPMENT TARGET
# =============================================================================
FROM package-json AS development
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm config set store-dir /pnpm/store && \
    pnpm install --frozen-lockfile --prefer-offline

CMD sh -c "if [ -n \"${ENV_FILE_ENCRYPTED}\" ]; then \
    set -a && \
    if [ -n \"${ENV_KEYS}\" ]; then \
        eval \"\$(DOTENV_KEY=\"${ENV_KEYS}\" pnpm exec dotenvx get --format eval --strict --env-file ${ENV_FILE_ENCRYPTED})\"; \
    else \
        eval \"\$(pnpm exec dotenvx get --format eval --strict --env-file ${ENV_FILE_ENCRYPTED})\"; \
    fi && \
    set +a; \
fi && \
pnpm run dev"

  # =============================================================================
# BUILD STAGE
# =============================================================================
FROM package-json AS build

ARG PRISMA_DB_URL
ENV PRISMA_DB_URL=$PRISMA_DB_URL

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

# =============================================================================
# DEPENDENCIES STAGE
# =============================================================================
FROM package-json AS production-dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --prod

# =============================================================================
# PRODUCTION TARGET
# =============================================================================
FROM base AS production

COPY --from=production-dependencies --chown=node:node /app/ ./

COPY --chown=node:node packages/ ./packages/

COPY --chown=node:node .env/ .env/

COPY --from=build --chown=node:node /app/apps/web/dist/ ./apps/api/public/
COPY --from=build --chown=node:node /app/apps/api/dist/ ./apps/api/dist/
COPY --from=build --chown=node:node /app/packages/db/dist/ ./packages/db/dist/
COPY --from=build --chown=node:node /app/packages/db/src/generated/prisma/ ./packages/db/src/generated/prisma/
COPY --from=build --chown=node:node /app/packages/pairing/dist/ ./packages/pairing/dist/
COPY --from=build --chown=node:node /app/packages/yjs-store/dist/ ./packages/yjs-store/dist/

USER node

CMD sh -c "if [ -n \"${ENV_FILE_ENCRYPTED}\" ]; then \
        set -a && \
        if [ -n \"${ENV_KEYS}\" ]; then \
            eval \"\$(DOTENV_KEY=\"${ENV_KEYS}\" pnpm exec dotenvx get --format eval --strict --env-file ${ENV_FILE_ENCRYPTED})\"; \
        else \
            eval \"\$(pnpm exec dotenvx get --format eval --strict --env-file ${ENV_FILE_ENCRYPTED})\"; \
        fi && \
        set +a; \
    fi && \
    pnpm run --filter api inject-env-vars && \
    pnpm --filter api run start"