# OracleCup — Deploy Guide (X Layer Mainnet)

**Goal**: 20 minutes from here to a verified contract on X Layer.

---

## Step 0 — Add X Layer to your wallet (2 min)

If your OKX Wallet / MetaMask doesn't have X Layer mainnet yet:

| Field | Value |
|---|---|
| Network Name | `X Layer Mainnet` |
| RPC URL | `https://rpc.xlayer.tech` |
| Chain ID | `196` |
| Currency Symbol | `OKB` |
| Block Explorer | `https://www.oklink.com/xlayer` |

(One-click add via ChainList: https://chainlist.org/chain/196)

Also good to know — testnet (if you want to dry-run first):

| Field | Value |
|---|---|
| RPC URL | `https://testrpc.xlayer.tech` |
| Chain ID | `195` |
| Faucet | https://web3.okx.com/xlayer/faucet |

**You need ~0.5 OKB on mainnet for deploy + a buffer.**
Bridge OKB to X Layer: https://web3.okx.com/xlayer/bridge

---

## Step 1 — Open Remix (1 min)

1. Go to https://remix.ethereum.org
2. Left sidebar → "File Explorer" → new file → name it `OracleCupMarket.sol`
3. Paste the full contents of `05_OracleCupMarket.sol` (in this folder)

---

## Step 2 — Compile (1 min)

1. Left sidebar → "Solidity Compiler" (the second icon)
2. Compiler version: **`0.8.24`**
3. EVM version: **`shanghai`** (X Layer compatible)
4. Hit **Compile OracleCupMarket.sol**
5. ✅ Should compile with 0 errors

---

## Step 3 — Connect wallet to Remix on X Layer (2 min)

1. In your OKX Wallet / MetaMask, **switch the active network to "X Layer Mainnet"**
2. Remix → "Deploy & Run Transactions" (third icon)
3. **Environment** dropdown → **"Injected Provider — MetaMask"** (or OKX Wallet)
4. It should now show: `CUSTOM (196) NETWORK` and your address with OKB balance

---

## Step 4 — Deploy with constructor arguments (3 min)

In the "Deploy & Run" panel:

1. **Contract**: select `OracleCupMarket`
2. Next to the orange **Deploy** button, click the small arrow to expand inputs:
   - `_oracle`: paste YOUR OWN wallet address for now (you'll act as the AI Oracle initially — we'll switch to the AI Agent's wallet in Phase D)
   - `_charity`: paste `0x0000000000000000000000000000000000000000` (or your charity wallet)
3. Click **Deploy (transact)**
4. Confirm in your wallet (gas should be < $0.01)
5. ⏱️ ~2 seconds later, the contract appears under "Deployed Contracts" — **copy the address!**

🟢 **Save this address — I'll call it `CONTRACT_ADDRESS`. We need it for the frontend.**

---

## Step 5 — Verify on OKLink Explorer (5 min)

1. Open `https://www.oklink.com/xlayer/address/<CONTRACT_ADDRESS>`
2. Click **Contract → Verify and Publish**
3. Settings:
   - Compiler: `v0.8.24+commit.e11b9ed9`
   - Optimization: `No` (unless you enabled it in Remix)
   - License: `MIT`
4. Paste the **entire contents** of `05_OracleCupMarket.sol`
5. ABI-encoded constructor args:
   - Generate at https://abi.hashex.org/ with inputs: `address` (your wallet), `address` (0x0)
   - Or just leave blank and Remix's verification plugin works too
6. Submit → ✅ green checkmark

**Why verify?** Judges & users can read your source code on explorer. Big credibility win.

---

## Step 6 — Seed a market (2 min, you do this right after verifying)

In Remix's "Deployed Contracts" panel, expand your contract:

1. Find `createMarket` (red because it's a state-changing call)
2. Inputs:
   - `question`: `"Will Brazil reach the 2026 World Cup Final?"`
   - `closeTime`: a future unix timestamp (e.g. `1748908800` = a few weeks out — use https://www.unixtimestamp.com/)
   - `aiYesOddsBps`: `4200` (means AI thinks 42%)
3. Click → confirm in wallet → ✅

Now your contract has Market #0. We'll seed 4–6 more after the frontend is up.

---

## Step 7 — Sanity check

Call `listMarkets(0, 10)` (blue button, view function). You should see your market with `closeTime`, `aiYesOddsBps`, both pools at 0, outcome `Unset`.

🎉 Done. Hand me back the `CONTRACT_ADDRESS` and I'll wire the frontend in Phase C.

---

## Troubleshooting

- **"insufficient funds"**: Bridge a tiny bit more OKB via https://web3.okx.com/xlayer/bridge
- **"injected provider not detected"**: Make sure OKX Wallet/MetaMask is unlocked AND network is set to X Layer 196
- **Compile error on `^0.8.24`**: Switch compiler to exactly `0.8.24`
- **Verification fails**: Most common reason is wrong optimization setting — match exactly what you used in Remix

---

## Sanity checklist before moving to Phase C

- [ ] Contract deployed on X Layer mainnet (chain 196)
- [ ] `CONTRACT_ADDRESS` saved
- [ ] Verified on OKLink (green check)
- [ ] At least 1 market created and `listMarkets` returns it
- [ ] Tested `bet()` once with 0.001 OKB to make sure it works
