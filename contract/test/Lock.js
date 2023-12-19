const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { log } = require("console");
const { upgrades } = require("hardhat")

describe("Lock", function () {
  let add1, add2;
  async function deployOneYearLockFixture() {
    [add1, add2] = await ethers.getSigners();
    const account1 = "0x19759366933CaF4f4A0A6AEc01A4D6bFf3e520FE"
    const account2 = "0x037B83c8C7E8169565B8E14C03aeCF1855428de1"

    const TimelessTokens2 = await ethers.getContractFactory("TimelessTokens2")
    const instance = await upgrades.deployProxy(TimelessTokens2, ["Matcha Dan Dan", "MCDD", 5, account1, add1.address])
    // console.log(instance);
    const upgraded = await upgrades.upgradeProxy(instance.target, TimelessTokens2);
    console.log(upgraded);


    return {};
  }

  describe("Deployment", function () {
    it("Should set the right unlockTime", async function () {
      const { } = await loadFixture(deployOneYearLockFixture);

    });
  });
});
