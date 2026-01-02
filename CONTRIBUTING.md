# Contributing to Kael

Thank you for your interest in contributing to Kael! This document provides guidelines and standards to ensure a consistent, high-quality codebase.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Error Handling](#error-handling)
- [Commit Conventions](#commit-conventions)
- [Pull Request Process](#pull-request-process)
- [Testing Requirements](#testing-requirements)
- [Architecture Decisions](#architecture-decisions)
- [Reporting Issues](#reporting-issues)

## Getting Started

### Prerequisites

- **Node.js 24.x** (LTS) - Required for AWS Lambda compatibility
- **pnpm >= 9** - Package manager for monorepo workspaces
- **Git** with hooks enabled (automatic via Husky)

### Project Structure

```
kael/
├── apps/
│   ├── frontend/     # @kael/frontend - React 19 + Vite + TanStack Query
│   └── backend/      # @kael/backend - AWS CDK + Lambda + DynamoDB
├── packages/
│   └── shared/       # @kael/shared - Zod schemas and shared types
└── docs/
    ├── adr/          # Architecture Decision Records
    └── architecture/ # System design documentation
```

### Initial Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd kael
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Verify setup:**
   ```bash
   pnpm type-check
   pnpm lint
   pnpm test
   ```

All checks should pass before you begin development.

## Development Workflow

This project uses [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow):

- `main` is always deployable
- Create feature branches from `main`
- Open PR when ready for review
- Merge to `main` after CI passes
- Delete branch after merge

### 1. Create a Branch

```bash
git switch -c feat/your-feature-name
```

Branch naming conventions:
- `feat/feature-name` - New features
- `fix/bug-name` - Bug fixes
- `refactor/description` - Code refactoring
- `docs/description` - Documentation updates

### 2. Make Changes

Follow the [Code Standards](#code-standards) section below.

### 3. Validate Your Changes

**Before committing, run these commands in order:**

```bash
pnpm type-check   # Must pass - no TypeScript errors
pnpm lint:fix     # Must pass - auto-fixes and reports remaining issues
pnpm test         # Must pass - all tests green
```

**Your changes are NOT complete until all three commands show zero errors.**

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat(frontend): add dark mode toggle"
```

Automated hooks will run:
- **Pre-commit**: Lints and formats staged files
- **Commit-msg**: Validates commit message format
- **Pre-push**: Runs full test suite

If any hook fails, fix the issues and try again.

## Code Standards

### SOLID Principles (Non-Negotiable)

- **Single Responsibility**: One function/class = one responsibility
- **Open/Closed**: Extend behavior without modifying existing code
- **Liskov Substitution**: Derived types must be substitutable for base types
- **Interface Segregation**: Many specific interfaces > one general interface
- **Dependency Inversion**: Depend on abstractions, not concretions

### Clean Code Requirements

- ✅ **English only** - All code, variables, functions, comments, and commit messages
- ✅ **Descriptive names** - No abbreviations, no acronyms unless universally known (HTTP, API)
- ✅ **Small functions** - Each function should do one thing well
- ✅ **Self-documenting code** - Code should explain itself; comments only when logic is non-obvious
- ✅ **DRY principle** - Don't Repeat Yourself; extract common logic
- ✅ **Explicit error handling** - Never silently fail; handle or propagate errors

### Stack-Specific Constraints

- ❌ **No AWS SDK v2** - Only use `@aws-sdk/client-*` (v3); v2 is deprecated
- ❌ **No callbacks in Lambda handlers** - Only async/await
- ❌ **No silent errors** - Always log or propagate errors (see [Error Handling](#error-handling))

### Code Formatting

Handled automatically by Biome:
- **Indentation**: Tabs
- **Quotes**: Single quotes (double for JSX)
- **Line width**: 100 characters max
- **Trailing commas**: Always

### Import Organization

Imports are automatically organized by Biome. No manual sorting needed.

## Error Handling

### Principles

1. **Internal/external separation**: Every error has two messages - technical for logs, generic for client
2. **Never expose to frontend**: Stack traces, class names, implementation details
3. **Log everything completely**: CloudWatch receives full context for debugging
4. **Use AWS Lambda Powertools**: For structured logging - don't create custom loggers

### Error Hierarchy

Base class `AppError` with:
- `statusCode`: HTTP status code
- `isOperational`: `true` = expected (validation, not found), `false` = bug
- `internalMessage`: Technical detail for logs
- `clientMessage`: Generic message for end users

Operational errors: `ValidationError`, `NotFoundError`, `UnauthorizedError`, `RateLimitError`, `ExternalServiceError`

### Centralized Wrapper

All handlers use `withErrorHandler()` which:
1. Catches any error
2. Logs internally with full context (Powertools)
3. Responds to client only with `clientMessage` and generic code

### Client Response Format

```json
{
  "success": false,
  "error": {
    "message": "The provided data is invalid",
    "code": 400
  }
}
```

Error codes: `BAD_REQUEST`, `UNAUTHORIZED`, `NOT_FOUND`, `CONFLICT`, `RATE_LIMITED`, `INTERNAL_ERROR`, `SERVICE_UNAVAILABLE`

### Rules

- ❌ **Never expose** `error.message` or `error.stack` to client
- ✅ **Always log** before responding
- ✅ **Client messages**, understandable by non-technical users
- ✅ **Use wrapper** in all handlers without exception

## Commit Conventions

This project uses [Conventional Commits](https://www.conventionalcommits.org/) with automated validation via commitlint.

### Commit Format

```
type(scope): description

[optional body]

[optional footer]
```

### Required Structure

- **type**: Must be from the allowed types list
- **scope**: Must be from the allowed scopes list
- **description**: Lowercase, max 100 characters, no period at end

### Allowed Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting, whitespace) |
| `refactor` | Code refactoring (no bug fix or feature) |
| `perf` | Performance improvements |
| `test` | Adding or updating tests |
| `build` | Build system or dependency changes |
| `ci` | CI/CD configuration changes |
| `chore` | Other changes (tooling, configs) |
| `revert` | Revert a previous commit |

### Allowed Scopes

| Scope | Description |
|-------|-------------|
| `frontend` | @kael/frontend workspace |
| `backend` | @kael/backend workspace |
| `shared` | @kael/shared workspace |
| `infra` | AWS CDK infrastructure changes |
| `deps` | Dependency updates |
| `root` | Root-level changes (configs, docs) |

### Examples

```bash
# Features
feat(frontend): add user authentication flow
feat(backend): implement websocket message handler
feat(infra): add cognito user pool stack

# Fixes
fix(backend): resolve websocket connection timeout
fix(frontend): correct dark mode toggle state

# Infrastructure
chore(infra): configure dynamodb TTL
refactor(infra): split api gateway into separate stack

# Dependencies
chore(deps): update aws-sdk to v3.958.0
build(deps): bump vitest to 3.0

# Documentation and config
docs(root): add ADR for state management choice
ci(root): add security audit job to pipeline

# Refactoring and tests
refactor(shared): simplify user validation schema
test(frontend): add integration tests for chat component
```

### Invalid Commits

```bash
Add feature                          # Missing type and scope
feat: add feature                    # Missing scope
FEAT(frontend): Add Feature          # Uppercase type/description
feat(frontend): Add feature.         # Period at end
feat(mobile): add feature            # Invalid scope
fixed the bug                        # Wrong format entirely
```

## Pull Request Process

### Before Creating a PR

1. ✅ All tests pass (`pnpm test`)
2. ✅ No TypeScript errors (`pnpm type-check`)
3. ✅ No linting errors (`pnpm lint`)
4. ✅ Code follows SOLID principles
5. ✅ Changes are documented if they affect architecture

### PR Guidelines

1. **Title**: Follow commit convention format
   ```
   feat(frontend): add user profile settings page
   ```

2. **Description**: Use the PR template (`.github/PULL_REQUEST_TEMPLATE.md`)
   - Summarize the changes
   - Link related issues
   - Describe testing performed
   - Note any breaking changes

3. **Size**: Keep PRs focused and reviewable
   - Aim for < 400 lines of changes
   - Split large features into multiple PRs
   - One feature/fix per PR

4. **Reviews**:
   - Address all review comments
   - Respond to feedback professionally
   - Request re-review after changes

### PR Merge Requirements

- ✅ All CI checks passing
- ✅ At least one approving review (if applicable)
- ✅ No merge conflicts
- ✅ Branch up to date with `main`

## Testing Requirements

### Testing Philosophy

**Write tests for:**
- ✅ Complex business logic
- ✅ Critical user flows (end-to-end)
- ✅ Edge cases and error scenarios
- ✅ API contracts and integrations

**Don't waste time testing:**
- ❌ Simple property accessors
- ❌ Third-party library behavior
- ❌ Framework boilerplate
- ❌ Type definitions

Focus coverage on business logic and critical paths.

### Coverage Requirements

**Target coverage:** 70-80% on backend (business logic), 70% on frontend (UI has lower test ROI)

When implementing a feature, test:
- ✅ **Happy path** - Normal expected behavior
- ✅ **Edge cases** - Boundary conditions, empty states
- ✅ **Error cases** - Validation failures, network errors, exceptions

### Test Commands

```bash
pnpm test              # Run all tests
pnpm test:coverage     # Run tests with coverage report
```

### Test Organization

```typescript
// ✅ Good: Descriptive, organized by scenario
describe('UserAuthenticationFlow', () => {
  describe('when credentials are valid', () => {
    it('should authenticate user and redirect to dashboard', () => {
      // ...
    });
  });

  describe('when credentials are invalid', () => {
    it('should display error message', () => {
      // ...
    });
  });
});

// ❌ Bad: Vague, unorganized
it('test auth', () => {
  // ...
});
```

## Architecture Decisions

### When to Create an ADR

Create an Architecture Decision Record (ADR) in `docs/adr/` when:

- Choosing between significant architectural patterns
- Selecting major libraries or frameworks
- Making decisions that impact system design
- Changing critical data flows or security models

### ADR Format

Use the template structure:
```markdown
# ADR-XXX: [Title]

## Status
[Proposed | Accepted | Deprecated | Superseded]

## Context
What is the issue we're facing?

## Decision
What did we decide?

## Reasons
Why did we make this decision?

## Consequences
What are the trade-offs and implications?
```

See existing ADRs in [`docs/adr/`](./docs/adr/) for examples.

## Reporting Issues

### Bug Reports

When reporting a bug, include:

1. **Description**: Clear summary of the issue
2. **Steps to Reproduce**: Numbered list of exact steps
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**: OS, Node version, browser (if applicable)
6. **Screenshots**: If relevant

### Feature Requests

When proposing a feature, include:

1. **Problem Statement**: What problem does this solve?
2. **Proposed Solution**: How should it work?
3. **Alternatives Considered**: What other options exist?
4. **Impact**: Who benefits and how?

## Questions or Help?

- Check existing [documentation](./docs/)
- Review [Architecture Overview](./docs/architecture/overview.md)
- Open a discussion or issue on GitHub

---

**Thank you for contributing to Kael!** Your efforts help make this project better for everyone.
