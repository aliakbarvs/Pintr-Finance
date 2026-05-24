# Pintr Finance - Product Requirements Document (PRD)
**Version:** 1.1  
**Date:** May 24, 2026  
**Status:** ✅ MVP Deployed (https://pintr-sigma.vercel.app)  
**Authors:** Hermes (Autonomous Operator) & AL (Founder)

---

## 1. Overview

**Product Name:** Pintr Finance  
**Type:** Mobile-first Web Application & Telegram Bot  
**Core Value:** Personal finance tracking with ultra-low-cost, high-fidelity receipt scanning (OCR) tailored for Indonesian users.  
**Target Audience:** Office workers, freelancers, contractors, and gig workers in Indonesia who need to track expenses on-the-go without the friction of manual data entry.

---

## 2. User Stories

| ID | User Story | Priority | Status |
|----|------------|----------|--------|
| **US1** | As a user, I want to add expenses manually so I can track spending. | P0 | ✅ Implemented |
| **US2** | As a user, I want to upload/snap receipts and have merchant, date, total, and category auto-extracted. | P0 | ✅ Implemented (Mock Engine & UI Pipeline) |
| **US3** | As a user, I want to see my live balance (income - expenses) at a glance. | P0 | ✅ Implemented |
| **US4** | As a user, I want to view my spending broken down by category dynamically. | P1 | ✅ Implemented |
| **US5** | As a user, I want to review, edit, and confirm AI-extracted metadata before it is saved. | P1 | ✅ Implemented |
| **US6** | As a user, I want to use local Indonesian transaction categories (GoPay, OVO, Grab, Gojek, Tokopedia, etc.). | P1 | ✅ Implemented |
| **US7** | As a user, I want to snap a picture on Telegram and have it auto-logged to my dashboard. | P2 | 📋 Backlog |

---

## 3. Functional Requirements

### 3.1 Transaction Management
* Manual entry supporting transaction type (Income/Expense), Amount, Category, Description, and Date.
* Live transaction log with real-time text-based search (by description, vendor, or category) and quick-tab filters (All, Income, Expense, or specific Category selectors).
* Rich interactive category-specific iconography (using Lucide icons like `Utensils`, `Car`, `ShoppingBag`, `Receipt`, etc.) mapped to Indonesian transaction patterns.

### 3.2 Premium AI Receipt Scanning
* **Client-Side Preprocessing:** High-res mobile photos are compressed on the client side to a maximum width of 1200px and 75% JPEG quality to save bandwidth and API token overhead.
* **Laser Sweeper Animation:** Uploading a receipt triggers a horizontal green laser scan on the UI to provide clear tactile feedback during processing.
* **Real-time Progress Logging:** Interactive console reporting (e.g., `Ingesting...`, `OCR Layout extraction...`, `Gemini parsing...`) to entertain and inform the user during API roundtrips.
* **Editable Draft Review Card:** Extracted merchant name, date, category, and amount are presented in an editable modal card so the user can verify or correct parameters before permanent DB insertion.

### 3.3 Dynamic Analytics Reporting
* Real-time balance tracker (Total Income vs Total Expenses).
* **Lightweight Donut Chart:** A native SVG donut chart that renders segments dynamically using vector calculations without third-party library overhead. Hover/click feedback reveals category percentages.
* Responsive category progress bars showing visual budget usage per sector.

---

## 4. Technical Stack

| Layer | Technology Chosen | Rationale |
|-------|-------------------|-----------|
| **Frontend** | React 19 + Vite + TypeScript | Blazing-fast edge rendering, type safety, and zero startup cold starts. |
| **Styling** | Tailwind CSS v4 | Class utility styling with modern CSS variable-based design tokens. |
| **API Ingestion** | Cloudflare Workers | Serverless edge handlers with 100,000 free requests/day. |
| **Image Storage** | Cloudflare R2 | 10GB free tier, **$0 egress fees** to avoid S3 bandwidth pricing traps. |
| **Database** | Turso (Serverless SQLite) | Light, responsive SQLite engine at the edge; 500MB free. |
| **AI OCR Engine** | Google Gemini 2.5 Flash Lite | Ultra-cheap ($0.00045/receipt), includes a 1,500 requests/day free tier. |
| **Fallback Engine**| Qwen 2.5 VL 72B (OpenRouter) | Heavy-duty vision fallback ($0.001/receipt) for faded or complex receipts. |

---

## 5. UI/UX Specifications

### Theme and Layout
* **Premium Slate-Dark Glassmorphism:** Deep dark background canvas (`#09090b` zinc-950) overlayed with glowing emerald and indigo radial gradients.
* **Frosted Containers:** Glassmorphic content cards using `backdrop-blur-md bg-zinc-900/60 border border-zinc-800/80` with smooth micro-interactions.
* **Responsive Layout:** Desktop centered layout bounded to `max-width: 480px` on mobile displays to guarantee pristine mobile-first proportions.

### Brand Palette (Pintr Neon)
* **Canvas:** Zinc-950 (`#09090b`)
* **Frosted Fills:** Zinc-900 at 60% opacity (`#18181b` / `rgba(24,24,27,0.6)`)
* **Primary Accent (Emerald):** `#10b981` — used for success states, income indicators, and laser sweeps.
* **Secondary Accent (Indigo):** `#6366f1` — used for interactive reports and neutral buttons.
* **Text Primary:** White (`#ffffff`)
* **Text Secondary:** Zinc-400 (`#a1a1aa`)

---

## 6. Pricing Model

| Tier | Price | Features |
|------|-------|----------|
| **Free** | Rp 0 / month | Manual entry, basic native reports, local storage backups. |
| **Pro** | Rp 49.000 / month | Unlimited Receipt OCR (Gemini), email ingestion, Telegram bot logging, weekly CSV export. |
| **Business** | Rp 149.000 / month | Multi-user team expense claims, API accounting exports, and custom category rules. |

---

## 7. Timeline

| Phase | Milestone | Scope | Status |
|-------|-----------|-------|--------|
| **Phase 1** | MVP & High-Fidelity UI | Dynamic React app, SVG chart, simulated OCR sweep, local state storage. | ✅ Completed (May 24, 2026) |
| **Phase 2** | Production Cloud Integration | Set up Cloudflare Worker, Turso DB, Cloudflare R2 bucket, and integrate real Gemini API. | 📋 Planned |
| **Phase 3** | Telegram Bot & Portal | Hook up Telegram webhook to CF Worker for camera-to-dashboard logging. | 📋 Planned |
| **Phase 4** | Beta Release & Launch | Onboard first 50 beta users, gather feedback on OCR accuracy. | 📋 Planned |
