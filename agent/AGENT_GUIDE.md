# OracleCup — AI Agent Guide

The AI Agent is what makes this an "AI Agent" project (not just a vanilla prediction market). For the hackathon, **run it once on demo day** and showcase it in the video.

---

## What it does (in plain English)

1. Loads a list of upcoming World Cup matches
2. Looks up each team's Elo rating
3. Computes "AI fair odds" using the Elo win-probability formula:
   `P(A wins) = 1 / (1 + 10^((Elo_B - Elo_A) / 400))`
4. Creates an on-chain market for each match — embedding the AI odds into the contract
5. Composes a tweet for each market (with stats, contract link)
6. Optionally auto-posts to Twitter
7. (Later) settles the market when results come in

This is enough to credibly call it "an AI Oracle" for the hackathon. V2 can plug in more sophisticated models (xG, GPT-driven sentiment, real-time data).

---

## Step 1 — Run it locally (5 min)

You need Node.js 18+ installed. Test with `node --version`.

```bash
# Install dependencies
npm init -y
npm install ethers@6 twitter-api-v2

# Set env vars
export CONTRACT_ADDRESS=0xYourContractAddressFromPhaseB
export PRIVATE_KEY=0xYourOracleWalletPrivateKey

# Dry-run first (no on-chain txs, just shows the plan)
node 09_ai_agent.js

# When you're happy, run live (creates 6 markets on X Layer!)
node 09_ai_agent.js --live
```

**Important security**: Use a **fresh wallet** as the Oracle, with only ~1 OKB on it. If it gets compromised, only that small balance is at risk. The `owner` wallet (which can change the oracle and withdraw fees) should be your main wallet, kept separately.

Don't ever paste your private key into the frontend or commit it to git. Use environment variables or a `.env` file (and `.gitignore` it).

---

## Step 2 — Tweet posting

### Option A — Manual (easiest, recommended for hackathon)

After running `node 09_ai_agent.js --live`, the script saves all the tweets to a file:

```
tweets_to_post.txt
```

Open it, copy each tweet block, paste into @OracleCup on X, post one every 30 minutes. Done.

### Option B — Auto-tweet via X API

Only do this if you have a Twitter Developer account (free tier works, takes ~5 min to apply):

1. https://developer.twitter.com/en/portal/dashboard
2. Create app → get the 5 keys
3. Set env vars before running the agent:

```bash
export TWITTER_API_KEY=...
export TWITTER_API_SECRET=...
export TWITTER_ACCESS_TOKEN=...
export TWITTER_ACCESS_SECRET=...
export TWITTER_BEARER_TOKEN=...
```

The script will auto-post each tweet with a 2-second gap.

---

## Step 3 — Settling markets

When a match finishes, run:

```bash
# 1 = YES won, 2 = NO won, 3 = CANCELLED
node 09_ai_agent.js --settle 0 1
```

This will:
- Call `settle(0, 1)` on the contract
- Move 1% of pool to charity wallet (if set)
- Print the "Settled" tweet for you to post

---

## Step 4 — (Optional) Deploy as a background service

To make it truly "autonomous" for V2, deploy to Railway or Render:

1. Push the script + `package.json` to GitHub
2. Connect Railway/Render to the repo
3. Add the env vars (CONTRACT_ADDRESS, PRIVATE_KEY, TWITTER_*)
4. Set the start command to: `node 09_ai_agent.js --live`
5. Schedule it to run every 6 hours via Railway's cron

For the hackathon demo, manual execution is totally fine — the video shows what it does.

---

## Why this is "Agentic"

For judges asking — here's the agentic loop the agent does on each run:

1. **Perceive**: read on-chain state (`nextMarketId`, current markets)
2. **Decide**: compute new markets from fixture list + Elo math
3. **Act**: call `createMarket` on X Layer (real on-chain action with gas spent)
4. **Communicate**: produce natural-language tweet output describing each action

That's the classic agent loop — perceive, decide, act, communicate — and it runs autonomously. Future versions can add memory (track past predictions, calibrate Elo), planning (multi-round tournaments), and tool use (real-time score APIs).

---

## Troubleshooting

- **"insufficient funds"** — top up the oracle wallet with a bit more OKB on X Layer
- **"not oracle"** — the wallet you're using isn't set as the oracle. In Remix, call `setOracle(yourWalletAddress)` from the owner wallet, OR just deploy the contract with this wallet as oracle in constructor.
- **Twitter rate limit** — free tier is 50 tweets/day. The script only posts 6, you're fine.
