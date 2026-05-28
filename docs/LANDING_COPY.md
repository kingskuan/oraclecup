# OracleCup — Landing Page Copy

(I'll turn this into actual HTML in Phase C. This is the source text so you can review/edit now.)

---

## HERO

**Headline (H1)**
The AI Oracle of the World Cup.
On-chain.

**Subhead**
OracleCup runs autonomous AI-priced prediction markets for every World Cup match — settled on X Layer in 2 seconds, with sub-cent gas.

**Primary CTA**
[ Open App → ]    [ Read Contract → ]

**Trust badges row**
- Built on X Layer
- Powered by OKX Onchain OS
- Live on Mainnet
- Open source

---

## SECTION 2 — How it works

**3-step cards:**

1. **🤖 AI Oracle prices the match**
   Our autonomous agent reads match data, team form, and crowd signal — and posts fair odds every hour.

2. **🟢 You bet in OKB**
   Connect wallet, pick a side, confirm. The market lives 100% on X Layer.

3. **⚡ Settle in seconds**
   When the whistle blows, the Oracle settles on-chain. Winners claim instantly. No custody, no waiting.

---

## SECTION 3 — Live Markets (placeholder grid)

Pulled from the contract live. Each card shows:
- Match: e.g. `Brazil vs Argentina`
- AI Fair Odds: e.g. `BRA 0.42 · ARG 0.58`
- Pool: e.g. `1,250 OKB`
- Closes in: `2h 14m`
- [ Bet ]

---

## SECTION 4 — Why X Layer

| | |
|---|---|
| ⚡ ~2s finality | Faster than VAR. Settle markets before the next kickoff. |
| 💸 Sub-cent gas | Bet small, bet often — fees vanish. |
| 🔐 ZK-Rollup security | Settled to Ethereum L1. |
| 🌍 80M+ OKX users | Already in the front door. |

---

## SECTION 5 — Tech under the hood

- **Smart contract**: `OracleCupMarket.sol` — open source, verified on OKLink
- **AI Agent**: Python service that fetches match data, computes odds, posts to X, calls `settleMarket()` on full-time
- **Frontend**: Pure HTML/JS + ethers.js, no backend, no tracking
- **Oracle**: Currently centralized AI Oracle (the Agent). V2: Chainlink + multi-sig committee.

---

## SECTION 6 — Footer

- Contract: `0x...` (X Layer Explorer link)
- Twitter: @OracleCup
- GitHub: (link)
- Built for [Build X Hackathon](https://web3.okx.com/zh-hans/xlayer/build-x-hackathon/xcup)
