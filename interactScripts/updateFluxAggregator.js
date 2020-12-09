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

  const aggregator = cfx.Contract({
    abi: fluxAggregator.abi,
    address: process.env.FLUXAGGREGATOR
  });

  //updating aggregator parameters
  let receipt = await aggregator
    .updateFutureRounds(
      100,
      1,
      1,
      0,
      0
    )
    .sendTransaction({ from: account })
    .executed();
  console.log(receipt);

  //display available tokens
  const funds = await aggregator.availableFunds();
  console.log("Available Funds", funds.toString());
}

main().catch(e => console.error(e));
