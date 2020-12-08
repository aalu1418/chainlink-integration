/* eslint-disable */

const { Conflux, Drip } = require("js-conflux-sdk");
const {
  abi
} = require("../chainlinkContractDeploy/build/contracts/LinkToken.json");
const fluxAggregator = require("../chainlinkContractDeploy/build/contracts/FluxAggregator.json");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

async function main() {
  // const defaultGasPrice = util.unit("GDrip", "Drip")(10)

  const cfx = new Conflux({
    url: "http://test.confluxrpc.org",
    logger: console
  });

  // ================================ Account =================================
  const account = cfx.wallet.addPrivateKey(PRIVATE_KEY); // create account instance

  // ================================ Contract ================================
  // create contract instance
  const contract = cfx.Contract({
    abi,
    address: process.env.LINK
  });

  // //send link tokens
  // let receipt = await contract
  //   .transfer(process.env.FLUXAGGREGATOR, Drip.fromCFX(1))
  //   .sendTransaction({ from: account })
  //   .executed();
  // console.log(receipt);

  const aggregator = cfx.Contract({
    abi: fluxAggregator.abi,
    address: process.env.FLUXAGGREGATOR
  });

  // //trigger balance check
  // await aggregator
  //   .updateAvailableFunds()
  //   .sendTransaction({ from: account })
  //   .executed();
  //
  // //need to setup two addresses (chainlink node address to trigger rounds + adapter address for fulfillment)
  // receipt = await aggregator
  //   .changeOracles(
  //     [],
  //     ["0x34193825395f8abb4aacac9d4e356c1ad77dadab", account.address],
  //     [account.address, account.address],
  //     1,
  //     2,
  //     0
  //   )
  //   .sendTransaction({ from: account })
  //   .executed();
  // console.log(receipt);

  // start oracle rounds (set up a requestor + request first round)
  await aggregator
    .setRequesterPermissions(account.address, true, 0)
    .sendTransaction({ from: account })
    .executed();
  receipt = await aggregator
    .requestNewRound()
    .sendTransaction({ from: account })
    .executed();
  console.log(receipt);

  //display available tokens
  const funds = await aggregator.availableFunds();
  console.log("Available Funds", funds.toString());
}

main().catch(e => console.error(e));
