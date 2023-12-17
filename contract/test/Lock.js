const {
  loadFixture,
  impersonateAccount
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { upgrades } = require("hardhat")

async function deployContract(name, args, options) {
  const contractFactory = await ethers.getContractFactory(name, options)
  return await contractFactory.deploy(...args)
}

async function contractAt(name, address) {
  const contractFactory = await ethers.getContractFactory(name)
  return await contractFactory.attach(address)
}

describe("Lock", function () {
  let add1, add2;
  async function deployOneYearLockFixture() {
    [add1, add2] = await ethers.getSigners();

    return {};
  }

  describe("Deployment", function () {
    it("Should set the right unlockTime", async function () {
      const { } = await loadFixture(deployOneYearLockFixture);
      // console.log(await bitx_wbnb_pair.getReserves());
      // console.log(await grok_wbnb_pair.getReserves());
      // console.log(await bitx_grok_pair.getReserves());
    });
  });
});
