// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

// verify:
// npx hardhat verify --network base-goerli "address"
const { ethers, upgrades } = require("hardhat");

async function main() {
  const account1 = "0x19759366933CaF4f4A0A6AEc01A4D6bFf3e520FE"
  const account2 = "0x037B83c8C7E8169565B8E14C03aeCF1855428de1"
  const TimelessTokens2 = await ethers.getContractFactory("TimelessTokens2");
  console.log("Deploying TimelessTokens2...");
  const instance = await upgrades.deployProxy(TimelessTokens2, ["Matcha Dan Dan", "MCDD", 5, account1, account2])
  await instance.waitForDeployment();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
