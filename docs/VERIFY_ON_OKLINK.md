# Verify the OracleCup contract on OKLink

The contract is deployed at:
**[`0x89234D4A0289be6F62d05154F07900033c89C23D`](https://www.oklink.com/xlayer/address/0x89234D4A0289be6F62d05154F07900033c89C23D)**

(X Layer mainnet, chain ID 196)

Verifying tells judges the deployed bytecode matches our published source.

---

## Step-by-step

1. Open the contract page on OKLink:
   https://www.oklink.com/xlayer/address/0x89234D4A0289be6F62d05154F07900033c89C23D

2. Click the **"Contract"** tab → **"Verify and Publish"** (or similar wording).

3. Fill in the verification form with **these exact values**:

   | Field | Value |
   |---|---|
   | Compiler Type | **Solidity (Single file)** |
   | Compiler Version | **v0.8.24+commit.e11b9ed9** |
   | Open Source License | **MIT License (MIT)** |
   | Optimization | **Yes** |
   | Optimization Runs | **200** |
   | EVM Version | **paris** (or "default") |

4. **Contract Source Code**: paste the entire contents of
   `contracts/OracleCupMarket.flat.sol`
   (this is the Hardhat-flattened single-file version — it already has the SPDX header and pragma).

5. **Constructor Arguments (ABI-encoded)** — paste this exact hex blob (no `0x` prefix):
   ```
   000000000000000000000000e6ee04105ea97b97df36c6094e0767e050f0fcd70000000000000000000000000000000000000000000000000000000000000000
   ```
   This decodes to:
   - `_oracle` = `0xE6EE04105Ea97b97df36c6094e0767e050f0fCd7`
   - `_charity` = `0x0000000000000000000000000000000000000000`

6. Submit and wait ~30 sec. You should see a green ✅ "Verified" badge.

---

## If OKLink asks for "Standard JSON Input" instead

Some explorers prefer JSON. In that case use Hardhat's build-info file:
`contracts/artifacts/build-info/<hash>.json` — paste the `"input"` field.

---

## Smoke test the verified contract

After verification, on OKLink:

- Go to **Read Contract** → call `owner()` → should return the deployer address
- Call `nextMarketId()` → should return however many markets the AI Agent has seeded (initially 0, grows after agent --live runs)
- Call `listMarkets(0, 10)` → should show the markets array

---

## Constructor args decoded (for the judges / your own reference)

```solidity
constructor(address _oracle, address _charity)
//          ^                  ^
//          deployer wallet    address(0) — no charity for V1
```

`_oracle` is the AI Agent's signing address — only it can `createMarket()` and `settle()`.
`_charity` is 0 by design — the 1% charity hook is wired in code but disabled until V2.
