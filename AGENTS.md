# AGENTS.md — Fintr (Finance Tracker)

## Overview
Personal finance tracker with receipt scanning. SaaS model. MVP in progress.

## Tech Stack
- React + Vite + TypeScript
- (Planned: receipt OCR, transaction categorization)

## Setup
```bash
pnpm install
pnpm dev
```

## Build & Test
```bash
pnpm build         # tsc && vite build
pnpm preview
```

## Conventions
- Functional components, hooks for business logic
- TypeScript strict mode
- All financial calculations need unit tests
- Currency handling: use integers (cents), never floats

## Done When
- [ ] `pnpm build` succeeds
- [ ] Financial logic has test coverage
- [ ] UI renders correctly in preview
- [ ] Diff reviewed
