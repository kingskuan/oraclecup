const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const oracle = process.env.ORACLE_ADDRESS || deployer.address;
  const charity = process.env.CHARITY_ADDRESS || "0x0000000000000000000000000000000000000000";

  console.log("Network    :", hre.network.name);
  console.log("Deployer   :", deployer.address);
  console.log("Oracle     :", oracle);
  console.log("Charity    :", charity);
  console.log("Balance    :", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), "OKB");

  const Factory = await hre.ethers.getContractFactory("OracleCupMarket");
  const c = await Factory.deploy(oracle, charity);
  await c.waitForDeployment();
  const addr = await c.getAddress();

  console.log("\n=== DEPLOYED ===");
  console.log("Contract   :", addr);
  console.log("Explorer   : https://www.oklink.com/xlayer/address/" + addr);
  console.log("\nNext steps:");
  console.log("  1. Verify on OKLink (paste source from contracts/OracleCupMarket.sol)");
  console.log("  2. Paste address into frontend/index.html (CONTRACT_ADDRESS)");
  console.log("  3. Run agent: CONTRACT_ADDRESS=" + addr + " PRIVATE_KEY=... node agent/ai_agent.js --live");
}

main().catch(e => { console.error(e); process.exit(1); });
