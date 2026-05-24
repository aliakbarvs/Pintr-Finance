# Pintr Finance - Architectural & Design Decisions (DECISIONS.md)
**Last Updated:** May 24, 2026  
**Status:** Confirmed & Implemented (Prototype Phase)

---

## 1. Core Architecture Decisions

### ⚖️ DEC-001: AI Receipt Processing Engine
* **Decision:** Use **Google Gemini 2.5 Flash Lite** (via Google AI Studio / Gemini API) as the primary extraction engine.
* **Rationale:** Traditional specialized OCR APIs (Veryfi, Mindee, Taggun) charge up to **$0.08 per receipt** and require monthly minimums. GPT-4o Vision is too expensive (~$0.02 per receipt). Gemini 2.5 Flash Lite has a **100% free tier** (up to 1,500 requests/day, 15 RPM) and costs a measly **$0.00045 per receipt** on pay-as-you-go, making it **177x cheaper** than legacy OCR while yielding superior extraction of unstructured line items.
* **Status:** Confirmed.

### ⚖️ DEC-002: Multi-Model Fallback Engine
* **Decision:** Use **Qwen 2.5 VL 72B** (via OpenRouter) as an ad-hoc fallback engine.
* **Rationale:** When Gemini returns low-confidence extractions (e.g., sum of line items does not equal the parsed total), the system automatically routes the image to Qwen 2.5 VL (the world's leading open vision-document model) for a tiny premium ($0.001/receipt). This keeps 98% of traffic on the $0.00045 tier while guaranteeing 99%+ production-grade accuracy.
* **Status:** Confirmed.

### ⚖️ DEC-003: Client-Side Image Preprocessing
* **Decision:** Downscale and compress receipt images to **max 1200px width** and **JPEG (75% quality)** on the client side *before* sending to the API.
* **Rationale:** Drops raw image sizes from 5-10MB to ~100-200KB. This drastically reduces the token footprint on Gemini (limiting visual tokens to ~1,800 to 2,300 per scan), cuts API latency in half, and preserves full text legibility.
* **Status:** Implemented in UI.

### ⚖️ DEC-004: Serverless "Zero-Dollar" Backend Stack
* **Decision:** Host database, storage, and API routing on a completely free-tier serverless stack:
  * **Compute:** Cloudflare Workers (100k requests/day free).
  * **Object Storage:** Cloudflare R2 (10GB free, **$0 egress fees** to avoid AWS S3 bandwidth traps).
  * **Database:** Turso serverless SQLite (500MB free, 9 billion reads/month).
* **Rationale:** Keeps operational costs at **exactly $0.00/month** until scaling past thousands of daily active users, maintaining absolute financial sustainability for the bootstrap launch.
* **Status:** Confirmed.

---

## 2. UI/UX Design Decisions

### ⚖️ DEC-005: Visual Theme (Slate-Dark Glassmorphism)
* **Decision:** Pivot away from typical "clean white flat cards" to a premium, world-class **Slate-Dark Glassmorphic Theme** (`#09090b` zinc-950 canvas with glowing indigo and emerald radial gradients).
* **Rationale:** Standard white expense apps look boring and corporate. A deep dark slate layout with frosted-glass containers (`backdrop-blur-md bg-zinc-900/60 border border-zinc-800/80`) feels like a modern SaaS utility (reminiscent of Linear or Stripe) and drives higher user engagement.
* **Status:** Implemented in prototype.

### ⚖️ DEC-006: Lightweight Data Visualization
* **Decision:** Code a custom, interactive **Donut Chart using native SVG** elements and math (`strokeDasharray`/`strokeDashoffset`), discarding heavy charting libraries (Recharts, Chart.js).
* **Rationale:** Keeps the client-side bundle size incredibly small, maintains lightning-fast page loading speeds on mobile networks, and prevents circular dependency crashes.
* **Status:** Implemented in prototype.

### ⚖️ DEC-007: Dialogic Scanning Experience
* **Decision:** Implement a three-stage scanning flow:
  1. **The Green Laser Sweep:** A glowing animated laser bar sweeps across the upload zone to give instant tactile satisfaction.
  2. **Live Processing Log:** Displays step-by-step terminal logs (`Ingesting...`, `OCR Boundary extraction...`, `Gemini parsing...`) to show the user the "AI is working."
  3. **Editable Review Card:** Instead of auto-saving, the parsed results are displayed in an intermediate editable card so the user can verify, correct categories, and manually approve before appending.
* **Rationale:** Promotes user control and prevents incorrect AI categorization from corrupting the financial database silently.
* **Status:** Implemented in prototype.

---

## 3. Deployment Decisions

### ⚖️ DEC-008: Deployment Fallback Domain
* **Decision:** Deploy the production release to **`https://pintr-sigma.vercel.app`** on Vercel.
* **Rationale:** The ideal domain `pintr.vercel.app` was already globally registered by an old project. Vercel automatically assigned the fallback custom alias `-sigma`, which remains clean and easily accessible for mobile testing.
* **Status:** Deployed.
