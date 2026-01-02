# Kael - Architecture

## Overview
Personal chat client for Anthropic API. Serverless, multi-device, minimal cost.

## Tech Stack
- **Infrastructure:** AWS CDK (TypeScript)
- **Backend:** Lambda, API Gateway (WebSocket), DynamoDB, Cognito, Parameter store, Cloudfront, S3, Cloudwatch
- **Frontend:** React 19, TypeScript, TanStack Query, Zustand, Tailwind, Vite
- **Shared:** Zod (validation schemas)
- **Testing:** Vitest, Testing Library
- **Code Quality:** Biome, TypeScript strict

## Diagram
```markdown
┌─────────────────────────────────────────────────────────────────┐
│                           USER                                  │
│                    (Browser / Mobile)                           │
└─────────────────────────────┬───────────────────────────────────┘
                              │ WSS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     AWS (Your account)                          │
│                                                                 │
│  ┌───────────────┐   ┌───────────────┐  ┌───────────────┐       │
│  │    Cognito    │◀─│  API Gateway  │  │  CloudFront   │       │
│  │    (Auth)     │   │  (WebSocket)  │  │   + S3 (UI)   │       │
│  └───────────────┘   └───────┬───────┘  └───────────────┘       │
│                              │                                  │
│                              ▼                                  │
│  ┌──────────────────┐   ┌───────────────┐                       │
│  │   Parameter      │─▶│    Lambda     │                       │
│  │ Store (Api keys) │   │  (Handlers)   │                       │
│  └──────────────────┘   └────┬──────────┘                       │
│                              │                                  │
│              ┌───────────────┼──────────────┐                   │
│              ▼               ▼              ▼                   │
│          ┌───────────┐  ┌───────────┐  ┌───────────┐            │
│          │ DynamoDB  │  │    S3     │  │CloudWatch │            │
│          │  (Data)   │  │ (Files)   │  │  (Logs)   │            │
│          └───────────┘  └───────────┘  └───────────┘            │
└─────────────────────────────┬───────────────────────────────────┘
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      LLM PROVIDER                               │
│            (Anthropic, OpenAI, Gemini, etc.)                    │
│                                                                 │
│                Your API Key → Pay per use                       │
└─────────────────────────────────────────────────────────────────┘
```
