# OracleCup

> The AI Oracle of the World Cup. On-chain.

OracleCup is an AI-Agent–powered prediction market for the FIFA World Cup, built natively on **X Layer** for the **Build X Hackathon 2026**.

## Live links

- 🌐 App: _TBD (Railway URL after deploy)_
- 📜 Contract: [`0x89234D4A0289be6F62d05154F07900033c89C23D`](https://www.oklink.com/xlayer/address/0x89234D4A0289be6F62d05154F07900033c89C23D) on X Layer mainnet
- 🐦 Twitter: https://x.com/OracleCup
- 🎥 Demo video: _TBD (YouTube)_

## How it works

1. An autonomous AI Agent reads upcoming World Cup fixtures
2. Computes fair odds using Elo win-probability math
3. Creates on-chain YES/NO markets on X Layer via `createMarket()`
4. Tweets the markets with AI-priced odds from `@OracleCup`
5. Settles markets after kickoff via `settle()`
6. Winners claim pro-rata of the total pool — instantly, on-chain

## Architecture

| Layer | Stack |
|---|---|
| Smart contract | Solidity 0.8.24, deployed on X Layer mainnet (chain 196) |
| Frontend | Single-file HTML + ethers.js v6 + Tailwind CDN |
| AI Agent | Node.js + ethers.js, Elo-based odds engine, Twitter API v2 |

## Repo layout

```
oraclecup/
├── contracts/      Hardhat project — Solidity source, deploy scripts, ABI
│   ├── contracts/OracleCupMarket.sol
│   ├── scripts/deploy.js
│   └── hardhat.config.js
├── frontend/       Single-file dApp (deployed to Vercel)
│   └── index.html
├── agent/          Autonomous AI Oracle (Node.js)
│   ├── ai_agent.js
│   └── package.json
├── docs/           Brand, submission, deploy, demo-video guides
└── README.md
```

## Why X Layer

- Sub-cent gas (vs. $0.01–$0.50 elsewhere)
- ~2s finality (faster than VAR)
- EVM-equivalent — all tooling works
- Native OKB gas, 80M+ OKX users one click away
- ZK-Rollup settled to Ethereum L1

## Run locally

### Compile contract
```
cd contracts
npm install
npx hardhat compile
```

### Run AI Agent (dry-run)
```
cd agent
npm install
CONTRACT_ADDRESS=0x... node ai_agent.js
```

### Frontend
Open `frontend/index.html` in a browser, or `vercel deploy` from that folder.

## Roadmap (V2)

- Real-time score API integration for autonomous settlement
- Multi-outcome markets (final scores, top scorer)
- Liquidity provider rewards
- Chainlink + multi-sig committee as oracle
- $ORACLE governance token + revenue share

## License
MIT

---
Built for [Build X Hackathon 2026](https://web3.okx.com/zh-hans/xlayer/build-x-hackathon/xcup)
