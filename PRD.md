# Pintr Finance - Product Requirements Document (PRD)

## 1. Overview

**Product Name:** Pintr Finance  
**Type:** Mobile-first Web Application  
**Core Value:** Personal finance tracking with receipt OCR for Indonesian users  
**Target:** Office workers, freelancers, contractors in Indonesia

---

## 2. User Stories

| ID | Story | Priority |
|----|-------|----------|
| US1 | As a user, I want to add expenses manually so I can track spending | P0 |
| US2 | As a user, I want to upload receipts and auto-extract amount/category | P0 |
| US3 | As a user, I want to see my balance (income - expenses) | P0 |
| US4 | As a user, I want to view spending by category | P1 |
| US5 | As a user, I want weekly spending insights | P2 |

---

## 3. Functional Requirements

### 3.1 Transaction Management
- Add income/expense with amount, category, description, date
- List all transactions with filters (date range, category)
- Delete transactions

### 3.2 Receipt Scanning (MVP: Mock OCR)
- Upload image (JPG, PNG)
- Simulate OCR extraction (production: Google Cloud Vision API)
- Pre-fill form with extracted data

### 3.3 Categories
- Default: Food, Transport, Shopping, Bills, Entertainment, Health, Other, Income
- Future: Custom categories

### 3.4 Reports
- Balance overview
- Spending by category (pie/bar chart)
- Weekly/monthly trends

---

## 4. Technical Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + Vite + TypeScript |
| Styling | Tailwind CSS v4 |
| State | React useState |
| Storage | LocalStorage (MVP) |
| OCR | Mock (production: Google Cloud Vision) |

---

## 5. UI/UX

### Layout
- Mobile-first (max-width: 480px centered)
- Bottom nav: Transactions | Add | Reports

### Visual
- Clean white cards on gray background
- Green gradient balance card
- Category icons (emoji-based for MVP)

---

## 6. Pricing Model

| Tier | Price | Features |
|------|-------|----------|
| Free | Rp 0 | Manual entry, basic reports |
| Pro | Rp 49k/mo | Receipt OCR, insights, export |
| Business | Rp 149k/mo | Multiple users, API access |

---

## 7. Success Metrics (3-month)

| Metric | Target |
|--------|--------|
| Beta users | 50 |
| Paid subscribers | 0 |
| Receipts scanned | 100 |

---

## 8. Timeline

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| MVP | 1 week | Manual entry + mock OCR |
| Beta | 2 weeks | Real OCR + reports |
| Launch | 1 month | Polish + GoLive |

---

*PRD Version: 1.0*  
*Last Updated: Feb 22, 2026*
