/* ============================================================
   OracleCup — AI Oracle Agent
   ------------------------------------------------------------
   Autonomous agent that:
     1. Reads upcoming World Cup fixtures
     2. Computes AI fair odds via Elo
     3. Creates on-chain markets on X Layer
     4. Posts tweet drafts (or auto-tweets if TWITTER_* env set)
     5. Settles markets after kickoff + result is known

   Usage (one-shot, all-in-one demo):
     CONTRACT_ADDRESS=0x...
     PRIVATE_KEY=0x...                  (the oracle wallet)
     node 09_ai_agent.js                # runs once, dry-run-friendly
     node 09_ai_agent.js --live         # actually broadcasts txs

   Optional auto-tweet (skip if you'll copy-paste tweets):
     TWITTER_BEARER_TOKEN=...
     TWITTER_API_KEY=...
     TWITTER_API_SECRET=...
     TWITTER_ACCESS_TOKEN=...
     TWITTER_ACCESS_SECRET=...

   ============================================================ */

const { ethers } = require("ethers");
const fs = require("fs");

const RPC = process.env.XLAYER_RPC || "https://rpc.xlayer.tech";
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const LIVE = process.argv.includes("--live");
const OFFLINE = !process.env.CONTRACT_ADDRESS; // pure-simulation dry-run: no RPC calls

if (LIVE && OFFLINE) { console.error("--live requires CONTRACT_ADDRESS env var"); process.exit(1); }
if (LIVE && !PRIVATE_KEY) { console.error("Set PRIVATE_KEY for --live mode"); process.exit(1); }

const ABI = [
  "function createMarket(string,uint64,uint64) returns (uint256)",
  "function settle(uint256,uint8)",
  "function nextMarketId() view returns (uint256)",
  "function markets(uint256) view returns (string,uint64,uint64,uint128,uint128,uint8,bool)",
  "event MarketCreated(uint256 indexed id,string question,uint64 closeTime,uint64 aiYesOddsBps)"
];

/* -------------------- TEAM DATABASE --------------------
   Elo ratings approximated from publicly available historical data.
   The AI's "fair odds" come from win-probability based on Elo difference.
*/
const TEAMS = {
  "Argentina": 2078, "France": 2055, "Brazil": 2034, "England": 1993, "Spain": 2002,
  "Portugal": 1981, "Netherlands": 1949, "Belgium": 1925, "Croatia": 1910, "Italy": 1900,
  "Germany": 1968, "Uruguay": 1881, "Colombia": 1875, "Morocco": 1862, "Switzerland": 1848,
  "USA": 1817, "Mexico": 1832, "Senegal": 1820, "Japan": 1827, "Korea Republic": 1816,
  "Iran": 1809, "Denmark": 1834, "Poland": 1798, "Australia": 1768, "Canada": 1770,
  "Ecuador": 1762, "Saudi Arabia": 1745, "Tunisia": 1750, "Ghana": 1740, "Serbia": 1820,
  "Wales": 1755, "Cameroon": 1738, "Costa Rica": 1716, "Qatar": 1690
};

/* -------------------- 2026 WORLD CUP FIXTURES (sample) --------------------
   For the hackathon, we seed 6 markets that show off the breadth.
*/
const NOW = Math.floor(Date.now() / 1000);
const H = 3600;
const D = 86400;

const FIXTURES = [
  { home: "Argentina",  away: "Brazil",     kickoff: NOW + 2*D,    type: "h2h" },
  { home: "France",     away: "Spain",      kickoff: NOW + 3*D,    type: "h2h" },
  { home: "Portugal",   away: "Germany",    kickoff: NOW + 4*D,    type: "h2h" },
  { home: "England",    away: "Netherlands",kickoff: NOW + 5*D,    type: "h2h" },
  { team: "Brazil",     prop: "reaches Final",   close: NOW + 14*D, baseProb: 0.32, type: "prop" },
  { team: "Argentina",  prop: "wins the Cup",    close: NOW + 21*D, baseProb: 0.18, type: "prop" }
];

/* -------------------- ELO MATH -------------------- */
function eloWinProb(eloA, eloB) {
  return 1 / (1 + Math.pow(10, (eloB - eloA) / 400));
}

/* -------------------- TWEET COMPOSER -------------------- */
function composeTweet({ marketId, question, yesProb, txHash, fixture }) {
  const pct = (yesProb * 100).toFixed(0);
  const inverse = (100 - parseInt(pct));
  const lines = [
    `🤖 ORACLE UPDATE`,
    ``,
    `Market #${marketId}: ${question}`,
    ``,
    `AI Fair Odds:`,
    `→ YES ${pct}%`,
    `→ NO  ${inverse}%`,
    ``,
    `Live on @XLayerOfficial. Settle on-chain.`,
    `Bet → oraclecup-production.up.railway.app`,
    `Contract → ${CONTRACT_ADDRESS.slice(0,6)}…${CONTRACT_ADDRESS.slice(-4)}`,
    ``,
    `#BuildXHackathon #XLayer #OnchainOS`
  ];
  return lines.join("\n");
}

function composeSettleTweet({ marketId, question, outcome }) {
  const label = ["UNSET","YES ✅","NO ❌","CANCELLED ↩️"][outcome];
  return [
    `🏁 SETTLED — Market #${marketId}`,
    ``,
    `${question}`,
    `Result: ${label}`,
    ``,
    `Winners can claim now: oraclecup-production.up.railway.app`,
    `Settled in <2s on @XLayerOfficial — try doing THAT off-chain.`,
    ``,
    `#BuildXHackathon #XLayer`
  ].join("\n");
}

/* -------------------- MAIN AGENT LOOP -------------------- */
async function main() {
  console.log("╔════════════════════════════════════════════╗");
  console.log("║       OracleCup AI Agent — booting...      ║");
  console.log("╚════════════════════════════════════════════╝");
  console.log("Mode:", LIVE ? "🟢 LIVE (broadcasts txs)" : OFFLINE ? "🟡 DRY-RUN OFFLINE (no RPC, no txs)" : "🟡 DRY-RUN (reads RPC, no txs)");
  console.log("Contract:", OFFLINE ? "(none — pure simulation)" : CONTRACT_ADDRESS);

  let provider, wallet, contract;
  if (!OFFLINE) {
    provider = new ethers.JsonRpcProvider(RPC);
    if (LIVE) {
      wallet = new ethers.Wallet(PRIVATE_KEY, provider);
      contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);
      console.log("Oracle address:", wallet.address);
      const bal = await provider.getBalance(wallet.address);
      console.log("Balance:", ethers.formatEther(bal), "OKB");
    } else {
      contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
    }
  }

  console.log("\n────── Phase 1: SCAN UPCOMING FIXTURES ──────\n");

  const tweets = [];

  for (const fx of FIXTURES) {
    let question, closeTime, yesProb;
    if (fx.type === "h2h") {
      const eA = TEAMS[fx.home];
      const eB = TEAMS[fx.away];
      yesProb = eloWinProb(eA, eB);
      question = `Will ${fx.home} beat ${fx.away}?`;
      closeTime = fx.kickoff;
      console.log(`📊 ${fx.home} (${eA}) vs ${fx.away} (${eB})`);
      console.log(`   AI fair: ${(yesProb*100).toFixed(1)}% YES`);
    } else {
      yesProb = fx.baseProb;
      question = `Will ${fx.team} ${fx.prop}?`;
      closeTime = fx.close;
      console.log(`📊 ${fx.team} ${fx.prop}`);
      console.log(`   AI prop: ${(yesProb*100).toFixed(1)}% YES`);
    }
    const oddsBps = Math.round(yesProb * 10000);

    let marketId = "DRYRUN";
    let txHash = "0x0";

    if (LIVE) {
      try {
        console.log("   ⏳ Broadcasting createMarket...");
        const tx = await contract.createMarket(question, closeTime, oddsBps);
        txHash = tx.hash;
        const receipt = await tx.wait();
        const evt = receipt.logs
          .map(l => { try { return contract.interface.parseLog(l); } catch { return null; }})
          .find(p => p && p.name === "MarketCreated");
        marketId = evt ? evt.args.id.toString() : "?";
        console.log(`   ✅ Market #${marketId} created — ${txHash}`);
      } catch (e) {
        console.log(`   ❌ Failed: ${e.shortMessage || e.message}`);
        continue;
      }
    } else if (!OFFLINE) {
      const next = Number(await contract.nextMarketId());
      marketId = String(next);
    } else {
      marketId = String(FIXTURES.indexOf(fx));
    }

    tweets.push(composeTweet({ marketId, question, yesProb, txHash, fixture: fx }));
  }

  console.log("\n────── Phase 2: COMPOSE TWEETS ──────\n");
  for (let i = 0; i < tweets.length; i++) {
    console.log(`─── Tweet #${i+1} ───`);
    console.log(tweets[i]);
    console.log("");
  }

  // Save tweets to a file for easy copy-paste
  fs.writeFileSync("tweets_to_post.txt", tweets.join("\n\n────────────────────\n\n"));
  console.log("📝 Saved → tweets_to_post.txt (copy-paste these to @OracleCup on X)\n");

  /* Optional auto-tweet via X API v2 ----------------------- */
  if (process.env.TWITTER_BEARER_TOKEN) {
    console.log("🐦 Twitter creds detected — auto-posting...");
    const Twitter = require("twitter-api-v2").TwitterApi;
    const client = new Twitter({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_SECRET
    });
    for (const t of tweets) {
      try {
        const res = await client.v2.tweet(t);
        console.log(`   ✅ Posted: ${res.data.id}`);
        await new Promise(r => setTimeout(r, 2000)); // rate limit gap
      } catch (e) {
        console.log(`   ❌ Tweet failed:`, e.message);
      }
    }
  }

  console.log("\n────── Phase 3: CHECK SETTLEMENT CANDIDATES ──────\n");
  if (LIVE) {
    const next = Number(await contract.nextMarketId());
    for (let i = 0; i < next; i++) {
      const m = await contract.markets(i);
      const closeTime = Number(m[1]);
      const outcome = Number(m[5]);
      if (outcome === 0 && Date.now()/1000 >= closeTime) {
        console.log(`Market #${i} ready to settle — needs result input.`);
        console.log(`   Run: node 09_ai_agent.js --settle ${i} <1=YES|2=NO|3=CANCEL>`);
      }
    }
  } else {
    console.log("(dry run skipped)");
  }

  console.log("\n╔════════════════════════════════════════════╗");
  console.log("║         AI Agent loop complete.            ║");
  console.log("╚════════════════════════════════════════════╝");
}

/* -------------------- SETTLE COMMAND -------------------- */
async function settleCmd() {
  const settleIdx = process.argv.indexOf("--settle");
  const id = parseInt(process.argv[settleIdx + 1]);
  const outcome = parseInt(process.argv[settleIdx + 2]);
  if (!PRIVATE_KEY) { console.error("Need PRIVATE_KEY"); return; }
  const provider = new ethers.JsonRpcProvider(RPC);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);
  console.log(`Settling Market #${id} → outcome ${outcome}`);
  const tx = await contract.settle(id, outcome);
  console.log("Tx:", tx.hash);
  await tx.wait();
  console.log("✅ Settled.");

  const m = await contract.markets(id);
  console.log("\n--- POST THIS TWEET ---\n");
  console.log(composeSettleTweet({ marketId: id, question: m[0], outcome }));
}

if (process.argv.includes("--settle")) settleCmd().catch(console.error);
else main().catch(e => { console.error(e); process.exit(1); });
