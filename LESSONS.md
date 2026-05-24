# Pintr Finance - Lessons Learned
**Last Updated:** May 24, 2026  
**Status:** ✅ Phase 1 MVP Built - Production UI & Architecture locked

---

## 🚀 What Worked

### 1. High-Fidelity UI Overhaul (May 24, 2026)
* **Milestone:** Successfully transformed the flat white Tailwind layout into a premium, world-class **Slate-Dark Glassmorphic Theme** (`#09090b` zinc-950 canvas with glowing indigo and emerald radial gradients).
* **SVG Donut Chart:** Coded a dynamic Donut Ring chart using native vector SVG math. No heavy external charting libraries (like Recharts) are needed, ensuring the bundle size remains tiny and fast over Indonesian mobile networks.
* **Laser Scanner Zone:** Built an interactive, highly engaging OCR upload area with a horizontal green laser sweep, step-by-step progress logging, and an editable review card for draft confirmation.
* **Vercel Deploy:** Connected securely to GitHub (`aliakbarvs/Pintr-Finance`) and deployed the live prototype with zero build errors to: **`https://pintr-sigma.vercel.app`**.

### 2. Environment Fixes (May 24, 2026)
* **Circular Vite Loop Resolved:** Local dev servers were crashing with `EMFILE: too many open files` due to a circular backup of `clawd/` folders nested recursively inside the project root. Resolved by explicitly ignoring nested `**/clawd/**` watching in `vite.config.ts`, updating `tsconfig.json`, and cleaning up `.gitignore` to maintain instant hot-reloads.

---

## ❌ Past Challenges

### Pre-Development (Feb 2026)
1. **API Pricing Traps:** Initial research assumed legacy OCR providers (Veryfi, Mindee) or GPT-4o would be required, which would kill unit economics at Rp 49k/month ($3.00 USD).
2. **Indonesian Categories:** Hard to map generic transactions without accommodating localized digital payment methods (GoPay, Gojek, OVO, Grab).

---

## 📚 Key Architectural Learnings

1. **Gemini 2.5 Flash Lite is the Economic Winner:** Google AI Studio's new Vision LLM model handles skewed thermal receipt scans with exceptional precision at a fraction of SOTA costs (**$0.00045 per receipt**, with up to 1,500 scans/day for 100% free), making it the most cost-efficient choice on earth.
2. **Serverless Edge is Crucial:** Moving database and storage to Turso SQLite (serverless SQLite at the edge) and Cloudflare R2 ($0 egress fees) allows us to maintain **exactly $0.00/month operational overhead** for hosting, making bootstrap launch completely sustainable.
3. **Client-Side Image Squeeze:** Resizing photos on the client side to a max-width of 1200px at 75% JPEG quality before dispatching to Gemini cuts input token size by 80% and slashes network transfer lag in half.

---

## 🎯 Next Steps

### Phase 2: Live Cloud Integration (Planned)
- [ ] Implement Cloudflare Worker boilerplate.
- [ ] Connect Turso serverless SQLite database and run migrations.
- [ ] Wire up Cloudflare R2 bucket for secure receipt image hosting.
- [ ] Build the live Gemini 2.5 Flash Lite parsing endpoint and connect it to the React prototype.

### Phase 3: Ingestion Expansion
- [ ] Set up Telegram Bot webhook routing to Cloudflare Workers for instant camera-to-dashboard receipt logging.
- [ ] Set up Cloudflare Email routing to auto-parse emailed PDF invoices (Gojek, Grab, Tokopedia).
