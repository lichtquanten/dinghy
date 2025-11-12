# Dinghy

A web-based coding platform supporting multiple programming languages. Execute code snippets in a sandboxed environment, from the browser.

## Features

- Execute code in 10+ languages (Python, JavaScript, Java, C++, Go, Rust, and more)
- Sandboxed execution environment via Judge0
- User authentication
- Monaco/CodeMirror editor integration
- Type-safe API with tRPC

## Tech Stack

**Frontend**: React, Vite, TailwindCSS

**Backend**: Hono, tRPC

**Database**: MongoDB, Redis

**Code Execution**: Judge0

**Infrastructure**: Docker Compose

Built as a pnpm monorepo with shared packages for database models and programming language definitions.

## Quick Start

### Prerequisites

- Node.js 24.9.0
- pnpm 10.18.3+
- Docker & Docker Compose
- [just](https://github.com/casey/just) command runner

### Setup

```bash
# Install dependencies
pnpm install

# Configure environment
cp .env/source/base.example .env/source/base
cp .env/source/local.dev.example .env/source/local.dev

# Edit the files above with your credentials

# Required: MongoDB credentials, Redis password, Clerk auth keys

# Merge environment configs
just env-build

# Start the stack
just dev
```

API runs at `http://localhost:3000`

## Development

Common commands (run `just` to see all):

```bash
just dev              # Start development stack
just dev-down         # Stop all services
just logs             # View logs
just shell            # Shell into API container
just admin            # Start admin tools (Mongo Express, Redis Commander)
```

Services include:

- API server (default: port 3000)
- MongoDB (default: port 27017)
- Redis (default: port 6379)
- Judge0 (default: port 2358)

## Project Structure

```
apps/
  api/              # Hono API server
  web/              # React frontend
packages/
  ai-models/   # Shared AI model config
  code-languages/   # Shared programming language configs
  database/         # Shared MongoDB models
  ui/               # Shared React components
```

## Environment Management

The project uses a two-layer environment system in `.env/source/`:

- `base` - Shared configuration
- `{local_dev,remote_dev,staging,prod}` - Environment-specific overrides

Source files are merged into `.env/` directory. After editing source files, run `just env-merge` to regenerate.

See `.env/source/*.example` files for available configuration options.

## Deployment

Multiple deployment targets are supported:

```bash
just dev       # Local development
just remote    # Remote dev with ngrok proxy
just staging   # Staging environment
just prod      # Production
```

Each uses its corresponding environment file from `.env/source/`.

## Scripts

```bash
pnpm build           # Build all packages
pnpm lint            # Lint code
pnpm typecheck       # Type checking
```
