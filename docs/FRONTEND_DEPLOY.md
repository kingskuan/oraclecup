# OracleCup — Frontend Deploy (5 minutes)

The frontend is a **single self-contained HTML file** (`07_index.html`). No build step. No backend. Just upload.

---

## Step 1 — Paste your contract address (30 sec)

1. Open `07_index.html`
2. Find this line near the top of the `<script>` block:

```js
const CONTRACT_ADDRESS = "0xYOUR_CONTRACT_ADDRESS_HERE";
```

3. Replace with the address you got from Phase B (e.g. `"0x1234..."`)
4. Save.

---

## Step 2 — Deploy on Vercel (recommended, free, fast)

**Option A — Drag & drop (zero account hassle):**

1. Go to https://vercel.com/new (sign in with GitHub if asked)
2. Drag the `07_index.html` file directly onto the page
3. Wait 30s
4. ✅ You get a URL like `oraclecup-xxx.vercel.app`

**Option B — Netlify drop (even simpler):**

1. Go to https://app.netlify.com/drop
2. Drag the file onto the page
3. Done — instant URL

**Option C — GitHub Pages:**

1. Create a public repo `oraclecup-app`
2. Upload `07_index.html` as `index.html`
3. Settings → Pages → Deploy from `main` branch → root
4. Get URL `<username>.github.io/oraclecup-app`

---

## Step 3 — (Optional) Custom domain

If you grabbed `oraclecup.xyz`:
- Vercel → Project → Settings → Domains → Add `oraclecup.xyz`
- Update your DNS A/CNAME records as Vercel instructs
- 5–10 minutes propagation

---

## Step 4 — Smoke test

1. Open your URL
2. Click **Connect Wallet** → should switch you to X Layer 196 automatically
3. The market(s) you seeded in Phase B should appear
4. Try a tiny bet: 0.001 OKB on YES on Market #0
5. Refresh — your bet should be reflected in the YES pool

If you see markets and can bet, **you've shipped a working on-chain product on X Layer.** 🟢

---

## Common gotchas

- **Markets don't load**: check the contract address in `index.html`, check browser console for errors
- **"could not load markets"**: most likely the RPC is rate-limiting; just refresh
- **Wallet won't switch network**: do it manually first — settings → networks → X Layer 196
- **Tailwind not loading**: Tailwind CDN sometimes blocked in mainland China; use a VPN or self-host if needed

---

## What this dApp does (so you can describe it to judges)

- Read-only mode (no wallet) → anyone can see live markets, pool sizes, AI fair odds
- Connect Wallet → auto-adds X Layer to wallet if missing, switches network
- Bet flow → opens modal with payout estimate (live), confirms tx on X Layer
- Claim flow → one click after settle, payout lands in user's wallet
- Admin panel → only visible if connected wallet is owner or oracle; can create markets directly from UI (also used by the AI Agent script in Phase D)
- Mobile responsive, dark theme, zero tracking, no backend
