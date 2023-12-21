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
    const TimelessTokens2 = await ethers.getContractFactory("TimelessTokens2")
    await upgrades.upgradeProxy("0x28a809048924ec75aa659634c254d499555f9582", TimelessTokens2);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
