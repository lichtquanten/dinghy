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
COPY packages/ai-models/package.json ./packages/ai-models/
COPY packages/code-languages/package.json ./packages/code-languages/
COPY packages/database/package.json ./packages/database/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/ui/package.json ./packages/ui/

# =============================================================================
# DEVELOPMENT TARGET
# =============================================================================
FROM base AS development
ARG API_CONTAINER_PORT
ARG ENV_FILE_ENCRYPTED
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile
COPY ${ENV_FILE_ENCRYPTED} ./.env.encrypted

EXPOSE ${API_CONTAINER_PORT}
EXPOSE ${WEB_CONTAINER_PORT}

CMD sh -c "set -a && \
  eval \"\$(pnpm exec dotenvx get --format eval --strict \
    --env-file ./.env.encrypted)\" && \
  set +a && \
  pnpm run dev"

  # =============================================================================
# BUILD STAGE
# =============================================================================
FROM package-json AS build
ARG ENV_FILE_ENCRYPTED

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

COPY . .

RUN --mount=type=secret,id=dotenv_key \
    set -a && \
    eval "$(pnpm exec dotenvx get --format eval --strict --env-keys-file /run/secrets/dotenv_key --env-file ${ENV_FILE_ENCRYPTED})" && \
    set +a && \
    pnpm run build

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
ARG API_CONTAINER_PORT
ARG ENV_FILE_ENCRYPTED

COPY --from=production-dependencies --chown=node:node /app/ ./

COPY --chown=node:node packages/ ./packages/

COPY --from=build --chown=node:node /app/apps/web/dist/ ./apps/api/public/
COPY --from=build --chown=node:node /app/apps/api/dist/ ./apps/api/dist/
COPY --from=build --chown=node:node /app/packages/database/dist/ ./packages/database/dist/

COPY --chown=node:node ${ENV_FILE_ENCRYPTED} ./.env.encrypted

USER node
EXPOSE ${API_CONTAINER_PORT}

CMD sh -c "set -a && \
    eval \"\$(pnpm exec dotenvx get --format eval --strict \
    --env-file ./.env.encrypted)\" && \
    set +a && \
    pnpm --filter api run start"