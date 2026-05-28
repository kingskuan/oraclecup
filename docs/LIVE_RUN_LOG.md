# Live-run proof — OracleCup AI Agent

This is on-chain proof that the autonomous AI Oracle actually creates markets on X Layer.

## Deployment

| Field | Value |
|---|---|
| Network | X Layer Mainnet |
| Chain ID | 196 |
| Contract address | [`0x89234D4A0289be6F62d05154F07900033c89C23D`](https://www.oklink.com/xlayer/address/0x89234D4A0289be6F62d05154F07900033c89C23D) |
| Deployer / Oracle | `0xE6EE04105Ea97b97df36c6094e0767e050f0fCd7` |
| Charity | `0x0000000000000000000000000000000000000000` (V1: disabled) |
| Solidity | 0.8.24, optimizer on (200 runs), EVM target = paris |

## AI Agent run — 6 markets seeded (autonomous, on-chain)

The `agent/ai_agent.js --live` script ran end-to-end with **no human input on chain**.
It read the in-code 2026 World Cup fixtures, ran Elo-based win-probability math, and broadcast 6 `createMarket()` txs to X Layer:

| # | Question | AI Fair Odds (YES) | Tx hash |
|---|---|---|---|
| 0 | Will Argentina beat Brazil? | 56.3 % | (first tx — see OKLink) |
| 1 | Will France beat Spain? | 57.6 % | [`0xe2997ea0…20e6`](https://www.oklink.com/xlayer/tx/0xe2997ea074702bf9b2776e4806c1885bfc19992ffec44a56aa2740bd799920e6) |
| 2 | Will Portugal beat Germany? | 51.9 % | [`0xe94b07e2…a7c5`](https://www.oklink.com/xlayer/tx/0xe94b07e2514f6142039ce0078c7402f228a8da71b739357d20f1d92008f8a7c5) |
| 3 | Will England beat Netherlands? | 56.3 % | [`0x254fa406…9797`](https://www.oklink.com/xlayer/tx/0x254fa406b377020a384caa1f730e313e67a71d9734231b80cd75bd6c94249797) |
| 4 | Will Brazil reach Final? | 32.0 % | [`0x19abe89e…05fd`](https://www.oklink.com/xlayer/tx/0x19abe89e781b436ec49e6b4b793a434a1946b4fa751ba6ba9c11b3a347ba05fd) |
| 5 | Will Argentina win the Cup? | 18.0 % | [`0x140d8d12…df1f`](https://www.oklink.com/xlayer/tx/0x140d8d12d03d8cb7998fefacf8308baa4ec25ed1b461aa4ede77c4112c68df1f) |

Every market is queryable via `contract.markets(<id>)` or `contract.listMarkets(0, 10)`.

## How the AI prices markets

For head-to-head fixtures, the agent uses Elo win-probability:

```
P(home wins) = 1 / (1 + 10 ^ ((Elo_away − Elo_home) / 400))
```

Elo ratings are seeded from publicly available historical data (see `agent/ai_agent.js` → `TEAMS`).

For prop markets (e.g. "Brazil reaches Final"), the agent uses a tournament-prior baseline; in V2 this becomes a Monte Carlo simulation over remaining bracket nodes.

## Reproducing this run

```bash
cd agent
npm install
CONTRACT_ADDRESS=0x89234D4A0289be6F62d05154F07900033c89C23D \
PRIVATE_KEY=0x<oracle wallet key> \
node ai_agent.js --live
```

(Or: `node ai_agent.js` for a dry-run that prints odds + tweets but does not broadcast.)
