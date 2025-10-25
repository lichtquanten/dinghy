# List all available commands
default:
 @just --list

# ============================================================================
# Env File Management
# ============================================================================

# Variables
env_manager := "pnpm exec node scripts/env-manager.ts"

env-merge:
 {{env_manager}} merge

env-encrypt:
 {{env_manager}} encrypt

env-decrypt:
 {{env_manager}} decrypt

env-examples:
 {{env_manager}} examples

env-build: env-merge env-encrypt

env-setup: env-merge env-encrypt env-examples

# ============================================================================
# Docker Command Helpers
# ============================================================================

# Helper to determine compose files based on environment
_compose_files env:
 #!/usr/bin/env bash
 if [[ "{{env}}" == "local" || "{{env}}" == "remote" ]]; then
   echo "-f compose.yaml -f compose.development.yaml"
 else
   echo "-f compose.yaml"
 fi

# Helper to determine env file based on environment
_env_file env:
 #!/usr/bin/env bash
 if [[ "{{env}}" == "local" || "{{env}}" == "remote" ]]; then
   echo "--env-file ./.env/{{env}}_dev"
 else
   echo "--env-file ./.env/{{env}}"
 fi

# Helper to convert space-separated profiles to --profile flags
_profile_flags profiles:
 #!/usr/bin/env bash
 profile_flags=""
 for p in {{profiles}}; do
   profile_flags="$profile_flags --profile $p"
 done
 echo "$profile_flags"

# ============================================================================
# Build Images
# ============================================================================

# Build services [env: local|remote|staging|prod]
build env="remote" profiles="api" *FLAGS="":
 docker compose `just _compose_files {{env}}` `just _profile_flags "{{profiles}}"` build {{FLAGS}}

# ============================================================================
# Start Services
# ============================================================================

# Start services [env: local|remote|staging|prod] [profiles: api, infra, proxy, etc.]
up env="remote" profiles="api proxy" *FLAGS="":
 docker compose `just _env_file {{env}}` `just _compose_files {{env}}` `just _profile_flags "{{profiles}}"` up -d {{FLAGS}}

# ============================================================================
# Stop Services
# ============================================================================

# Stop services [env: local|remote|staging|prod]
down env="remote" profiles="api proxy" *FLAGS="":
 docker compose `just _compose_files {{env}}` `just _profile_flags "{{profiles}}"` down {{FLAGS}}

# ============================================================================
# Clean
# ============================================================================

# Remove everything, including orphans
clean:
 docker stop $(docker ps -aq); docker system prune -a -f --volumes

# ============================================================================
# Shell Access
# ============================================================================

# Open a shell in a service [env: local|remote|staging|prod] [service: api, db, etc.]
shell env="remote" service="api":
 docker compose `just _compose_files {{env}}` exec {{service}} /bin/bash

# Open a shell in a service (fallback to sh if bash unavailable)
sh env="remote" service="api":
 docker compose `just _compose_files {{env}}` exec {{service}} /bin/sh

# Run a one-off command in a service
exec env="remote" service="api" *CMD:
 docker compose `just _compose_files {{env}}` exec {{service}} {{CMD}}

# ============================================================================
# Logs
# ============================================================================

# View logs for services [env: local|remote|staging|prod]
logs env="remote" service="api" *FLAGS="":
 docker compose `just _compose_files {{env}}` logs {{FLAGS}} {{service}} -f