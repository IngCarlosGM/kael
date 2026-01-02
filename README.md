# Kael

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-24.x-green.svg)
![TypeScript](https://img.shields.io/badge/typescript-strict-blue.svg)
![AWS](https://img.shields.io/badge/aws-serverless-orange.svg)
![Status](https://img.shields.io/badge/status-in%20development-yellow.svg)

**Personal chat client for interacting with LLMs using your own API key.**

Deploy your infrastructure on AWS, without suscriptions, pay only for the tokens you consume, and have full control over your data.

[Features](#features) • [Architecture](#architecture) • [Installation](#installation) • [Documentation](#documentation) • [Roadmap](#roadmap)

</div>

---

## Why Kael?

| Claude.ai / ChatGPT / Gemini | Kael |
|---------------------|------|
| Fixed monthly subscription | Pay only for tokens consumed |
| Your data on third-party servers | Your infrastructure, your AWS account |
| Basic chat folders | Projects with chats, notes, files, and context |
| Single model behavior | Pre-configured expert roles, reusable across chats |
| No cost visibility | Cost per message visible (tokens + USD) |

---

## Features

### Chat
- Real-time streaming conversations
- Persistent and editable history (edit questions, regenerate responses, delete messages to clean up the chat)
- Incognito mode for temporary conversations (convertible to normal chat and persisted)
- Syntax highlighting in code blocks
- Visible cost per message (tokens + USD)
- Search within current chat or globally across all conversations
- Quick navigation: jump to start/end or between your messages
- Slash commands for quick actions (/help, /summarize, /translate)

### Projects
- Group related chats under the same context
- Attach notes to remember pending tasks or where you left off
- Upload files (.md, .txt, .pdf) as additional knowledge for the LLM
- Define project-level instructions that apply to all its chats
- Assign a default expert role to the project

### Profiles (Expert Roles)
- Create reusable configurations: instructions, behavior, LLM model, template
- Examples of profiles: "Software Architect", "Code Reviewer", "Product Owner", "QA Tester"
- Assign roles at project or individual chat level
- Include an initial text template that auto-loads into the input

### Prompt Templates
- Save frequently used prompts for reuse
- Insert them into any chat with one click
- Editable before sending

### Multi-device
- Log in and work from any device with a browser
- Automatic sync between devices
- Mobile-friendly

---

## Architecture overview
```
                              ┌→ [Cognito]        ┌→ [Parameter store]
                              │                   │
[User] → [CloudFront/S3] → [API Gateway WS] → [Lambda] → [Anthropic API]
                                                  ↓
                                             [DynamoDB]
```


**Estimated infrastructure cost:** ~$0/month using AWS free tier (excluding Route 53 and LLM tokens)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Infrastructure | AWS CDK (TypeScript) |
| Backend | Lambda, API Gateway (WebSocket), DynamoDB, S3, Parameter store |
| Frontend | React 19, TypeScript, TanStack Query, Zustand, Tailwind, Vite, Zod |
| Auth | Cognito |
| CI/CD | GitHub Actions |
| Testing | Vitest, Testing Library |
| Code Quality | Biome, TypeScript strict |

---

## Prerequisites

- Node.js 24.x
- pnpm ≥9
- AWS account
- AWS CLI configured with credentials
- GitHub account (for CI/CD with GitHub Actions)
- Anthropic API key

---

## Installation

```bash
# Clone repository
git clone https://github.com/IngCarlosGM/kael.git
cd kael

# Install dependencies
pnpm install

# Configure environment variables
cp .env.example .env
# Edit .env with your API key and AWS configuration

# Deploy infrastructure
pnpm --filter @kael/backend cdk:deploy

# Start local development (run in separate terminals)
pnpm dev:backend
pnpm dev:frontend
```
---

## Project Structure

```
kael/
├── apps/
│   ├── backend/        # Lambda handlers + CDK stacks
│   └── frontend/       # React SPA
├── packages/
│   └── shared/         # Types, schemas, utils
├── docs/
│   ├── adr/            # Architecture Decision Records
│   └── architecture/   # Diagrams and overview
└── .github/
    └── workflows/      # CI/CD pipelines
```

---

## Documentation

- [Architecture](./docs/architecture/overview.md)
- [Technical Decisions (ADRs)](./docs/adr/)

---

## Roadmap

### v1 — Chat with projects and roles (In development)

Complete product for interacting with LLMs in an organized way.

### v2 — Development from the browser (Future)

Write complete features, adjustments, or fixes from any browser without needing a computer nearby.
```
┌─────────────┐         ┌─────────────┐       ┌─────────────┐
│    User     │         │    Kael     │       │     LLM     │
│  (Browser)  │◀──────▶│  (Lambda)   │◀───▶ │  Provider   │
└─────────────┘ iterate └──────┬──────┘       └─────────────┘
                               │
                               │                                          ┌─────────────┐
                               │      ┌──────────────────┐    Deploy      │   GitHub    │
                               └────▶│ PR to preview/*  │──────────────▶ │  Actions    │
                                      └──────────────────┘     temp       └─────────────┘
                                                │
                                                ▼
                                      ┌──────────────────┐
                                      │ Validate → Merge │
                                      │      to main     │
                                      └──────────────────┘
```

**Use cases:** Create end-to-end features from a planning file (.md) or text directly in chat, implement quick adjustments, or make fixes when you don't have access to your computer.


---

## Author

Built with ❤️ by **Carlos Gamboa**, fullstack developer passionate about AI and developer tools.

**Contact:** [GitHub](https://github.com/IngCarlosGM) • [LinkedIn](www.linkedin.com/in/gamboamc)

---

## License

MIT
