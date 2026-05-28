// Sync the compiled ABI from Hardhat artifacts into frontend/index.html.
// Replaces the `const ABI = [...]` block in-place.
const fs = require("fs");
const path = require("path");

const ARTIFACT = path.resolve(__dirname, "../artifacts/contracts/OracleCupMarket.sol/OracleCupMarket.json");
const INDEX_HTML = path.resolve(__dirname, "../../frontend/index.html");
const ABI_JSON_OUT = path.resolve(__dirname, "../OracleCupMarket.abi.json");

if (!fs.existsSync(ARTIFACT)) {
  console.error("Artifact not found. Run `npx hardhat compile` first.");
  process.exit(1);
}

const artifact = JSON.parse(fs.readFileSync(ARTIFACT, "utf8"));
const abi = artifact.abi;

// Save standalone ABI file for reference
fs.writeFileSync(ABI_JSON_OUT, JSON.stringify(abi, null, 2));
console.log("Wrote ABI →", ABI_JSON_OUT);

// Inject into frontend
let html = fs.readFileSync(INDEX_HTML, "utf8");
const abiLiteral = "const ABI = " + JSON.stringify(abi, null, 2) + ";";

const re = /const ABI = \[[\s\S]*?\];/m;
if (!re.test(html)) {
  console.error("Could not locate `const ABI = [...]` block in frontend/index.html");
  process.exit(1);
}
html = html.replace(re, abiLiteral);
fs.writeFileSync(INDEX_HTML, html);
console.log("Synced ABI →", INDEX_HTML);
