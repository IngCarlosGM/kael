# ADR-001: Monorepo Structure

## Status
Accepted

## Date
2025-01-01

## Context
Kael requires shared validation schemas (Zod) between React frontend and AWS Lambda backend. As a single-developer project, we need a repository structure that optimizes for development velocity and type safety without unnecessary complexity.

## Decision
Use monorepo with pnpm workspaces:
- `@kael/frontend` - React application
- `@kael/backend` - CDK infrastructure and Lambda handlers
- `@kael/shared` - Zod schemas and derived types

## Alternatives Considered

### Polyrepo
Separate repositories for frontend and backend.

**Rejected:** Shared schemas would require npm publishing or git submodules. API contract changes need coordinated updates across repos—excessive overhead for single-developer project.

### Monolith (single package.json)
All code in one package without workspaces.

**Rejected:** Mixes all dependencies together. Frontend deps would bloat Lambda artifacts. No isolated commands per workspace.

### Monorepo with pnpm workspaces ✓
**Selected.** Enables:
- Zod schemas as single source of truth for API contracts
- Atomic commits updating contract + implementation + consumer
- TypeScript types flow without publish cycles
- Independent deployment via workspace filters

## Consequences

### Positive
- Zero-cost abstraction for shared code
- Full-stack type checking in single command
- Coordinated tooling (Biome, TypeScript, Vitest)

### Negative
- Requires correct TypeScript project references configuration
- CI needs filters to avoid rebuilding unchanged workspaces

### Mitigations
- Use `pnpm --filter` for targeted workspace commands
- Configure CI caching and change detection

## References
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
