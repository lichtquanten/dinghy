# List all available commands
default:
    @just --list

# ============================================================================
# Private Helpers
# ============================================================================

# Run docker compose with encrypted env file
_dc env *ARGS:
    ENV_FILE_ENCRYPTED="./.env/{{env}}.encrypted" docker compose {{ARGS}}

# Run docker compose with development overrides and encrypted env file
_dcdev env *ARGS:
    ENV_FILE_ENCRYPTED="./.env/{{env}}.encrypted" docker compose -f compose.yaml -f compose.development.yaml {{ARGS}}

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
dev-build env="local_dev":
    @just _dcdev "{{env}}" --profile api --profile infra build

# Build local development with no cache
dev-build-clean env="local_dev":
    @just _dcdev "{{env}}" --profile api --profile infra build --no-cache

# Start local development
dev env="local_dev":
    @just _dcdev "{{env}}" --profile api --profile infra up -d --build

# Start local development without rebuilding
dev-fast env="local_dev":
    @just _dcdev "{{env}}" --profile api --profile infra up -d

# Stop local development
dev-down env="local_dev":
    @just _dcdev "{{env}}" down

# ============================================================================
# Remote Development
# ============================================================================

# Build remote development (check if build works)
remote-build env="remote_dev":
    @just _dcdev "{{env}}" --profile api --profile proxy build

# Build remote development with no cache
remote-build-clean env="remote_dev":
    @just _dcdev "{{env}}" --profile api --profile proxy build --no-cache

# Start remote development
remote env="remote_dev":
    @just _dcdev "{{env}}" --profile api --profile proxy up -d --build

# Start remote without rebuilding
remote-fast env="remote_dev":
    @just _dcdev "{{env}}" --profile api --profile proxy up -d

# Stop remote development
remote-down env="remote_dev":
    @just _dcdev "{{env}}" down

# ============================================================================
# Staging Environment
# ============================================================================

# Build staging (check if build works)
staging-build env="staging":
    @just _dc "{{env}}" --profile api --profile proxy build

# Build staging with no cache
staging-build-clean env="staging":
    @just _dc "{{env}}" --profile api --profile proxy build --no-cache

# Start staging environment
staging env="staging":
    @just _dc "{{env}}" --profile api --profile proxy up -d --build

# Start staging without rebuilding
staging-fast env="staging":
    @just _dc "{{env}}" --profile api --profile proxy up -d

# Stop staging environment
staging-down env="staging":
    @just _dc "{{env}}" down

# ============================================================================
# Production
# ============================================================================

# Build production (check if build works)
prod-build env="prod":
    @just _dc "{{env}}" --profile api build

# Build production with no cache
prod-build-clean env="prod":
    @just _dc "{{env}}" --profile api build --no-cache

# Start production
prod env="prod":
    @just _dc "{{env}}" --profile api up -d --build

# Start production without rebuilding
prod-fast env="prod":
    @just _dc "{{env}}" --profile api up -d

# Stop production
prod-down env="prod":
    @just _dc "{{env}}" down

# ============================================================================
# Infrastructure
# ============================================================================

# Start infrastructure only
infra env="local_dev":
    @just _dc "{{env}}" --profile infra up -d

# Stop infrastructure
infra-down env="local_dev":
    @just _dc "{{env}}" --profile infra down

# ============================================================================
# Admin Tools
# ============================================================================

# Start admin tools [env: local_dev|remote_dev|staging|prod]
admin env="local_dev":
    @just _dc "{{env}}" --profile admin-tools up -d

# Stop admin tools (works for any environment)
admin-down env="local_dev":
    @just _dc "{{env}}" --profile admin-tools down

# ============================================================================
# Logs & Status
# ============================================================================

# View logs [env: local_dev|remote_dev|staging|prod]
logs env="local_dev":
    @just _dc "{{env}}" --profile "*" logs -f

# View logs for specific service [env: local_dev|remote_dev|staging|prod]
logs-service service env="local_dev":
    @just _dcdev "{{env}}" logs -f {{service}}

# Show container status [env: local_dev|remote_dev|staging|prod]
status env="local_dev":
    @just _dcdev "{{env}}" ps

# ============================================================================
# Shell Access
# ============================================================================
# NOTE: Is it an issue if i have the development override even when i am using env of staging
# for example where I don't use this override?
# Open shell in API container [env: local_dev|remote_dev|staging|prod]
shell env="local_dev":
    @just _dcdev "{{env}}" exec api sh

# Open shell in specific service [env: local_dev|remote_dev|staging|prod]
shell-service service env="local_dev":
    @just _dcdev "{{env}}" exec {{service}} sh

# Open MongoDB shell [env: local_dev|remote_dev|staging|prod]
db-shell env="local_dev":
    @just _dcdev "{{env}}" exec mongodb mongosh

# Open Redis CLI [env: local_dev|remote_dev|staging|prod]
redis-shell env="local_dev":
    @just _dcdev "{{env}}" exec redis redis-cli

# ============================================================================
# Cleanup
# ============================================================================

# Stop all services [env: local_dev|remote_dev|staging|prod]
stop env="local_dev":
    @just _dc "{{env}}" -f compose.yaml --profile "*" down

# Stop and remove volumes [env: local_dev|remote_dev|staging|prod]
clean env="local_dev":
    @just _dc "{{env}}" -f compose.yaml --profile "*" down -v

# Remove everything including orphans [env: local_dev|remote_dev|staging|prod]
clean-all env="local_dev":
    @just _dc "{{env}}" -f compose.yaml --profile "*" down -v --remove-orphans
    docker system prune -f