const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { upgrades } = require("hardhat")

describe("Lock", function () {
  let add1, add2;
  async function deployOneYearLockFixture() {
    [add1, add2] = await ethers.getSigners();
    const account1 = "0x19759366933CaF4f4A0A6AEc01A4D6bFf3e520FE"
    const account2 = "0x037B83c8C7E8169565B8E14C03aeCF1855428de1"

    const TimelessTokens2 = await ethers.getContractFactory("TimelessTokens2")
    const instance = await upgrades.deployProxy(TimelessTokens2, ["Matcha Dan Dan", "MCDD", 5, account1, add1.address])


    return { instance };
  }

  describe("Deployment", function () {
    it("Test executeMintByOwner", async function () {
      const { instance } = await loadFixture(deployOneYearLockFixture);

      await instance.submitTobeReviewedList("title", "description", "metadataURI1", ethers.parseEther("0.01"), { value: ethers.parseEther("0.011") })
      await instance.executeMintByOwner([0n], ["metadataURI1"])
    });

    it("Test removeReviewedListByIndex", async function () {
      const { instance } = await loadFixture(deployOneYearLockFixture);

      await instance.submitTobeReviewedList("title", "description", "metadataURI1", ethers.parseEther("0.01"), { value: ethers.parseEther("0.011") })
      console.log(await instance.getAllToBeReviewLists());
      await instance.removeReviewedListByIndex(0n, "metadataURI1")
      console.log(await instance.getAllToBeReviewLists());
    });

    it("Test removeMultipleReviewedListByindices", async function () {
      const { instance } = await loadFixture(deployOneYearLockFixture);

      await instance.submitTobeReviewedList("title", "description", "metadataURI1", ethers.parseEther("0.01"), { value: ethers.parseEther("0.011") })
      console.log(await instance.getAllToBeReviewLists());
      await instance.removeMultipleReviewedListByindices([0n], ["metadataURI1"])
      console.log(await instance.getAllToBeReviewLists());

      await instance.submitTobeReviewedList("title", "description", "metadataURI1", ethers.parseEther("0.01"), { value: ethers.parseEther("0.011") })
      await instance.submitTobeReviewedList("title", "description", "metadataURI2", ethers.parseEther("0.01"), { value: ethers.parseEther("0.011") })

      console.log(await instance.getAllToBeReviewLists());

      await instance.removeMultipleReviewedListByindices([0n, 1n], ["metadataURI1", "metadataURI2"])
      // await instance.removeMultipleReviewedListByindices([1n, 0n], ["metadataURI2", "metadataURI1"])

      console.log(await instance.getAllToBeReviewLists());

      // 如果提交两个相同 URL 的 list 在还没有审核通过的情况下不会报错
      // 但是如果同时通过两个有相同 URL 的 list 那么在执行 mint 的时候就会报错

    });


    it("Test mintByOwner", async function () {
      const { instance } = await loadFixture(deployOneYearLockFixture);

      await instance.mintByOwner("title", "description", "metadataURI2", ethers.parseEther("0.01"), { value: ethers.parseEther("0.011") })
    });

    it("Test executeMintByOwner", async function () {
      const { instance } = await loadFixture(deployOneYearLockFixture);

      await instance.submitTobeReviewedList("title", "description", "metadataURI1", ethers.parseEther("0.01"), { value: ethers.parseEther("0.011") })
      console.log(await instance.getAllToBeReviewLists());

      await instance.executeMintByOwner([0n], ["metadataURI1"])
      console.log(await instance.getAllToBeReviewLists());
      console.log(await instance.getAllNFTs());

      // test execute more
      await instance.connect(add1).submitTobeReviewedList("title", "description", "metadataURI2", ethers.parseEther("0.01"), { value: ethers.parseEther("0.011") })
      await instance.connect(add1).submitTobeReviewedList("title", "description", "metadataURI3", ethers.parseEther("0.01"), { value: ethers.parseEther("0.011") })
      console.log(await instance.getAllToBeReviewLists());

      // await instance.executeMintByOwner([0n, 1n], ["metadataURI2", "metadataURI3"])
      await instance.executeMintByOwner([1n], ["metadataURI3"])
      console.log(await instance.getAllNFTs());

    });

    it("Test executeMintByOwner", async function () {
      const { instance } = await loadFixture(deployOneYearLockFixture);
      // test submit two lists which have the same URL
      await instance.connect(add1).submitTobeReviewedList("title", "description", "metadataURI1", ethers.parseEther("0.01"), { value: ethers.parseEther("0.011") })
      await instance.connect(add1).submitTobeReviewedList("title", "description", "metadataURI1", ethers.parseEther("0.01"), { value: ethers.parseEther("0.011") })

      await instance.executeMintByOwner([0n], ["metadataURI1"])
      console.log(await instance.getAllNFTs());
    });


    it("Test withdrawEth", async function () {
      const { instance } = await loadFixture(deployOneYearLockFixture);
      // test submit two lists which have the same URL
      await instance.connect(add1).submitTobeReviewedList("title", "description", "metadataURI1", ethers.parseEther("0.01"), { value: ethers.parseEther("0.011") })
      await instance.connect(add1).submitTobeReviewedList("title", "description", "metadataURI1", ethers.parseEther("0.01"), { value: ethers.parseEther("0.011") })

      // await instance.withdrawEth(ethers.parseEther("1"))
      // await instance.withdrawEth(0)
      // await instance.withdrawEth(ethers.parseEther("0.023"))
      // await instance.withdrawEth(ethers.parseEther("0.022"))
      // await instance.withdrawEth(ethers.parseEther("0.002"))

      await instance.connect(add1).submitTobeReviewedList("title", "description", "metadataURI1", ethers.parseEther("0.01"), { value: ethers.parseEther("0.022") })

      await instance.withdrawEth(ethers.parseEther("0.011"))




    });

  });
});


// 设计问题：removeMultipleReviewedListByindices 按照 index 删除数组的时候只能保证传入的数据是从小到大的，有没有更好的设计？
// 设计问题：如果用户 submitTobeReviewedList 调用时传入了大于 0.011 数量的原生代币，之后取消订单的话用户是只能拿到 0.011 的，多余的会保存在合约中，由 owner 通过 withdrawEth 函数取出