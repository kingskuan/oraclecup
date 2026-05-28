# 🏆 OracleCup — Master Playbook (Build X Hackathon)

**You are here**: All code is written. You now have ~8 hours to execute. This file is your map.

---

## TL;DR — what you're shipping

A working, verified, on-chain prediction market on X Layer with an autonomous AI Agent that:
- Creates markets via `createMarket()` (real txs)
- Posts AI-priced odds to Twitter
- Settles outcomes on-chain
- Lets anyone bet & claim in OKB

**One-liner**: "The AI Oracle of the World Cup. On-chain."

---

## Execution sequence (FOLLOW THIS ORDER, NO SKIPPING)

| # | File | Time | What you do |
|---|---|---|---|
| 1 | `01_BRAND_BRIEF.md` | 0 min | Read once, internalize |
| 2 | `02_TWITTER_SETUP.md` | **20 min** | Create @OracleCup, post pin tweet, follow @XLayerOfficial |
| 3 | `06_DEPLOY_GUIDE.md` + `05_OracleCupMarket.sol` | **30 min** | Deploy contract on X Layer, verify on OKLink. **GET YOUR CONTRACT ADDRESS** |
| 4 | `08_FRONTEND_DEPLOY.md` + `07_index.html` | **10 min** | Paste contract address, deploy to Vercel |
| 5 | `10_AGENT_GUIDE.md` + `09_ai_agent.js` | **30 min** | Run agent in `--live` mode, seed 6 markets, save tweets |
| 6 | Post tweets manually | 20 min | Drip launch tweets from `02_TWITTER_SETUP.md` |
| 7 | `11_DEMO_VIDEO_SCRIPT.md` | **60 min** | Record 90s demo video on Loom or OBS, upload to YouTube |
| 8 | GitHub repo | 15 min | Push code with the README from `12_SUBMISSION_PACKAGE.md` |
| 9 | `12_SUBMISSION_PACKAGE.md` | 15 min | Submit Google Form with all links |
| 10 | Final public tweet | 5 min | The "we're live" tweet, tag @XLayerOfficial |
|   | **TOTAL** | **~3.5 hours** | (Buffer for debugging = 4.5 hours) |

---

## Files in this folder — what each one is

```
00_MASTER_PLAYBOOK.md       ← you are here
01_BRAND_BRIEF.md           ← project identity, colors, voice
02_TWITTER_SETUP.md         ← step-by-step Twitter account + 6 tweets ready
03_LOGO.svg                 ← logo (use as Twitter profile pic, convert to PNG via https://svgtopng.com)
04_LANDING_COPY.md          ← landing page text (already embedded in 07_index.html)
05_OracleCupMarket.sol      ← THE SMART CONTRACT — deploy this
06_DEPLOY_GUIDE.md          ← how to deploy 05 to X Layer
07_index.html               ← THE FRONTEND dAPP — deploy this to Vercel
08_FRONTEND_DEPLOY.md       ← how to deploy 07 to Vercel
09_ai_agent.js              ← THE AI ORACLE AGENT — run this with --live
10_AGENT_GUIDE.md           ← how to run 09
11_DEMO_VIDEO_SCRIPT.md     ← word-for-word voiceover script + scene list
12_SUBMISSION_PACKAGE.md    ← Google Form answers + GitHub README
```

---

## ⚠️ Risk register — things that could kill the submission

| Risk | Mitigation |
|---|---|
| Forgot to deploy to **X Layer mainnet** (used testnet by mistake) | Rules require mainnet. Check chain ID = 196 in your tx URL |
| Contract not verified on OKLink | Judges WILL check source code. 5-minute job, do it. |
| Twitter doesn't tag @XLayerOfficial in pin tweet | Rules explicitly require this. Edit the tweet if you forgot. |
| dApp link breaks 5 minutes before deadline | Have a backup Netlify drop URL ready |
| Demo video fails to record | Use the slideshow backup plan in `11_DEMO_VIDEO_SCRIPT.md` |
| Run out of OKB to deploy | Bridge ~5 OKB to X Layer first thing |
| Submit form 30 seconds late | Submit by 23:30 UTC, not 23:59 |

---

## Decision points where you might want to deviate

### Q: Should I deploy on testnet instead?
**A**: NO. Rules say "at least part deployed on X Layer" — mainnet is unambiguous, gas is sub-cent, no reason to use testnet.

### Q: Should I skip the AI Agent and just do prediction market?
**A**: NO. The Agent is the differentiator. Even running it once for the demo video is enough — the "autonomous" claim is justified by the code, not by 24/7 uptime.

### Q: Should I add token / token launch?
**A**: NO. Adds 4 hours of work, opens regulatory questions, judges don't reward shitcoins. Stick to the prediction market.

### Q: Should I add real World Cup result feed (oracle integration)?
**A**: For V1, no — we use the AI Agent's `settle()` call manually. Add Chainlink in V2 narrative.

### Q: My contract isn't deploying — should I switch to L1?
**A**: NO. Debug it. 99% of issues are wrong network selected in MetaMask. Phase B guide has troubleshooting section.

---

## After submission — what's next (V2 roadmap to mention to judges)

1. Chainlink price feed integration for autonomous settlement
2. Multi-outcome markets (exact score, top scorer, etc.)
3. Liquidity provider mode with fees
4. $ORACLE governance token
5. Cross-tournament expansion (Euros, Copa, NBA Finals)
6. Mobile app via Telegram Mini App on TON (cross-chain)

---

## Emergency support

- X Layer Builder Hub TG: https://t.me/+JInfz0yF9ihjNGE1
- X Layer docs: https://web3.okx.com/xlayer/docs
- OKLink explorer: https://www.oklink.com/xlayer
- X Layer faucet (testnet only): https://web3.okx.com/xlayer/faucet
- X Layer bridge (move OKB to L2): https://web3.okx.com/xlayer/bridge

**GO. Stop reading planning docs. Start deploying.**
