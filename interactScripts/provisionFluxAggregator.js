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

  //send link tokens
  let receipt = await contract
    .transfer(process.env.FLUXAGGREGATOR, Drip.fromCFX(1))
    .sendTransaction({ from: account })
    .executed();
  console.log(receipt);

  const aggregator = cfx.Contract({
    abi: fluxAggregator.abi,
    address: process.env.FLUXAGGREGATOR
  });

  //trigger balance check
  await aggregator
    .updateAvailableFunds()
    .sendTransaction({ from: account })
    .executed();

  //need to setup two addresses (chainlink node address to trigger rounds + adapter address for fulfillment)
  // min + max set = 1 because node won't trigger because it is associated with two different addresses (must be set low)
  receipt = await aggregator
    .changeOracles(
      [],
      ["0x363775370436EBbe37B090e1BC95cf68839e4Bb9", account.address],
      [account.address, account.address],
      1,
      1,
      0
    )
    .sendTransaction({ from: account })
    .executed();
  console.log(receipt);

  // provision requester address
  await aggregator
    .setRequesterPermissions(account.address, true, 0)
    .sendTransaction({ from: account })
    .executed();

  //display available tokens
  const funds = await aggregator.availableFunds();
  console.log("Available Funds", funds.toString());
}

main().catch(e => console.error(e));
