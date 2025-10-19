# List all available commands
default:
    @just --list

# ============================================================================
# Env File Management
# ============================================================================

# Variables
env_manager := "pnpm exec node scripts/env-manager.ts"

# Env management
env-merge:
    {{env_manager}} merge

env-encrypt:
    {{env_manager}} encrypt

env-decrypt:
    {{env_manager}} decrypt

env-examples:
    {{env_manager}} examples

# Workflows
env-build: env-merge env-encrypt

env-setup: env-merge env-encrypt env-examples

# ============================================================================
# Development Environments
# ============================================================================

# Build local development (check if build works)
dev-build:
    docker compose -f compose.yaml -f compose.development.yaml --env-file .env/local.dev --profile api --profile infra build

# Build local development with no cache
dev-build-clean:
    docker compose -f compose.yaml -f compose.development.yaml --env-file .env/local.dev --profile api --profile infra build --no-cache

# Start local development
dev:
    docker compose -f compose.yaml -f compose.development.yaml --env-file .env/local.dev --profile api --profile infra up -d --build

# Start local development without rebuilding
dev-fast:
    docker compose -f compose.yaml -f compose.development.yaml --env-file .env/local.dev --profile api --profile infra up -d

# Stop local development
dev-down:
    docker compose -f compose.yaml -f compose.development.yaml --env-file .env/local.dev down

# ============================================================================
# Remote Development
# ============================================================================

# Build remote development (check if build works)
remote-build:
    docker compose -f compose.yaml -f compose.development.yaml --env-file .env/remote.dev --profile api --profile proxy build

# Build remote development with no cache
remote-build-clean:
    docker compose -f compose.yaml -f compose.development.yaml --env-file .env/remote.dev --profile api --profile proxy build --no-cache

# Start remote development
remote:
    docker compose -f compose.yaml -f compose.development.yaml --env-file .env/remote.dev --profile api --profile proxy up -d --build

# Start remote without rebuilding
remote-fast:
    docker compose -f compose.yaml -f compose.development.yaml --env-file .env/remote.dev --profile api --profile proxy up -d

# Stop remote development
remote-down:
    docker compose -f compose.yaml -f compose.development.yaml --env-file .env/remote.dev down

# ============================================================================
# Staging Environment
# ============================================================================

# Build staging (check if build works)
staging-build:
    docker compose --env-file .env/staging --profile api --profile proxy build

# Build staging with no cache
staging-build-clean:
    docker compose --env-file .env/staging --profile api --profile proxy build --no-cache

# Start staging environment
staging:
    docker compose --env-file .env/staging --profile api --profile proxy up -d --build

# Start staging without rebuilding
staging-fast:
    docker compose --env-file .env/staging --profile api --profile proxy up -d

# Stop staging environment
staging-down:
    docker compose --env-file .env/staging down

# ============================================================================
# Production
# ============================================================================

# Build production (check if build works)
prod-build:
    docker compose --env-file .env/prod --profile api build

# Build production with no cache
prod-build-clean:
    docker compose --env-file .env/prod --profile api build --no-cache

# Start production
prod:
    docker compose --env-file .env/prod --profile api up -d --build

# Start production without rebuilding
prod-fast:
    docker compose --env-file .env/prod --profile api up -d

# Stop production
prod-down:
    docker compose --env-file .env/prod down

# ============================================================================
# Infrastructure
# ============================================================================

# Start infrastructure only
infra:
    docker compose --env-file .env/local.dev --profile infra up -d

# Stop infrastructure
infra-down:
    docker compose --env-file .env/local.dev --profile infra down

# ============================================================================
# Admin Tools
# ============================================================================

# Start admin tools [env: local.dev|remote.dev|staging|prod]
admin env="local.dev":
    docker compose --env-file .env/{{env}} --profile admin-tools up -d

# Stop admin tools (works for any environment)
admin-down:
    docker compose --profile admin-tools down

# ============================================================================
# Logs & Status
# ============================================================================

# View logs [env: local.dev|remote.dev|staging|prod]
logs env="local.dev":
    docker compose --env-file .env/{{env}} --profile "*" logs -f

# View logs for specific service [env: local.dev|remote.dev|staging|prod]
logs-service service env="local.dev":
    docker compose -f compose.yaml -f compose.development.yaml --env-file .env/{{env}} logs -f {{service}}

# Show container status [env: local.dev|remote.dev|staging|prod]
status env="local.dev":
    docker compose -f compose.yaml -f compose.development.yaml --env-file .env/{{env}} ps

# ============================================================================
# Shell Access
# ============================================================================
# NOTE: Is it an issue if i have the development override even when i am using env of staging
# for example where I don't use this override?
# Open shell in API container [env: local.dev|remote.dev|staging|prod]
shell env="local.dev":
    docker compose -f compose.yaml -f compose.development.yaml --env-file .env/{{env}} exec api sh

# Open shell in specific service [env: local.dev|remote.dev|staging|prod]
shell-service service env="local.dev":
    docker compose -f compose.yaml -f compose.development.yaml --env-file .env/{{env}} exec {{service}} sh

# Open MongoDB shell [env: local.dev|remote.dev|staging|prod]
db-shell env="local.dev":
    docker compose -f compose.yaml -f compose.development.yaml --env-file .env/{{env}} exec mongodb mongosh

# Open Redis CLI [env: local.dev|remote.dev|staging|prod]
redis-shell env="local.dev":
    docker compose -f compose.yaml -f compose.development.yaml --env-file .env/{{env}} exec redis redis-cli

# ============================================================================
# Cleanup
# ============================================================================

# Stop all services [env: local.dev|remote.dev|staging|prod]
stop env="local.dev":
    docker compose -f compose.yaml --profile "*" --env-file .env/{{env}} down

# Stop and remove volumes [env: local.dev|remote.dev|staging|prod]
clean env="local.dev":
    docker compose -f compose.yaml --profile "*" --env-file .env/{{env}} down -v

# Remove everything including orphans [env: local.dev|remote.dev|staging|prod]
clean-all env="local.dev":
    docker compose -f compose.yaml --profile "*" --env-file .env/{{env}} down -v --remove-orphans
    docker system prune -f