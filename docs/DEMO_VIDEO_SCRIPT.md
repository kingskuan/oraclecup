# OracleCup — Demo Video Script (90 seconds)

**Goal**: Show judges in 90 seconds that this is innovative, on-chain, and complete. The rules say 1–3 min, 90s is sweet spot.

---

## Tools you need (free)

- **Loom** (https://loom.com) — easiest screen recorder, gives a URL instantly
- OR **OBS** if you want offline file (free, https://obsproject.com)
- Microphone (laptop mic is fine; speak clearly)
- 3 browser tabs open and ready:
  1. Your OracleCup dApp URL
  2. OKLink explorer on your contract address
  3. Terminal with `09_ai_agent.js` ready to run

---

## Recording plan — 6 scenes, 90s total

### Scene 1 — Hook (0:00 – 0:08, 8s)
**Show**: OracleCup landing page hero (`oraclecup.xyz`)
**Say**:
> "The 2026 World Cup will have billions of viewers — but no native way to back predictions on-chain. OracleCup fixes that."

### Scene 2 — The AI Agent in action (0:08 – 0:30, 22s)
**Show**: Terminal — run `node 09_ai_agent.js --live`
- Show the boot banner
- Show fixtures being read
- Show "AI fair: 54.2% YES" lines
- Show "✅ Market #0 created — 0x..." live tx hash
- Cut to OKLink explorer briefly to show the tx exists

**Say**:
> "This AI Agent reads upcoming matches, computes fair odds using Elo math, and creates on-chain markets autonomously on X Layer. Each market call is a real transaction — under one cent of gas, two-second finality."

### Scene 3 — User flow (0:30 – 0:55, 25s)
**Show**: dApp markets page
- Click "Connect Wallet"
- Wallet auto-switches to X Layer (show network badge change)
- Click "Bet YES" on a market
- Show payout estimate updating live
- Click "Confirm Bet"
- Show wallet confirmation popup
- Show "✅ Bet confirmed on X Layer" toast
- Show the YES Pool number going up

**Say**:
> "Users connect wallet — it auto-switches to X Layer. Pick a side, see your potential payout in real-time, confirm. Two seconds later your bet is on-chain. No custody, no waiting."

### Scene 4 — Settlement (0:55 – 1:10, 15s)
**Show**: Terminal again — run `node 09_ai_agent.js --settle 0 1`
- Show "✅ Settled."
- Cut back to dApp — market shows "YES won"
- Click "Claim Payout"
- Show wallet popup → confirm
- Show "🎉 Payout sent to your wallet!" toast

**Say**:
> "When the match ends, the AI Oracle settles on-chain. Winners claim instantly. Zero intermediaries."

### Scene 5 — Why X Layer (1:10 – 1:22, 12s)
**Show**: dApp footer "Why X Layer" section
**Say**:
> "We built on X Layer because prediction markets need cheap, fast, and deep. Sub-cent gas, two-second finality, and 80 million OKX users already in the front door."

### Scene 6 — Close (1:22 – 1:30, 8s)
**Show**: Landing page hero with logo + URL
**Say**:
> "OracleCup. The AI Oracle of the World Cup. Live now on X Layer. Built in 8 hours for Build X Hackathon."

---

## Filming tips

- Record in 1080p, landscape
- **Speak first, then act** — pause briefly between scenes so the voice-over breathes
- If you flub a line, just keep going — you can re-do scenes in Loom one at a time
- Add captions in editing (Loom auto-generates, just enable them)
- Background: silent or quiet — no music needed for hackathon judges

---

## Upload checklist

1. Upload to **YouTube** (unlisted, but accessible by link) — preferred by judges
2. Title: `OracleCup — AI Oracle for the FIFA World Cup on X Layer | Build X Hackathon 2026`
3. Description: copy the project one-liner + paste links to dApp, contract, Twitter, GitHub
4. Get the URL — you'll paste it into the Google Form

If short on time, **Loom is fine too** — judges accept it.

---

## Backup plan if recording fails

If you hit any tech issue recording, here's the absolute minimum that still wins points:

- Quick screenshot tour: 5 images (landing, agent terminal, market grid, bet modal, OKLink contract) → make into a 60-second slideshow with text overlay using https://canva.com (free) → upload as MP4

Judges said "non-strict, bonus points." Don't let perfection block submission.
