/* eslint-disable */

const { Conflux, util } = require("js-conflux-sdk");
const {
  abi
} = require("../chainlinkContractDeploy/build/contracts/ChainlinkExample.json");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

async function main() {
  // const defaultGasPrice = util.unit("GDrip", "Drip")(10)

  const cfx = new Conflux({
    url: "http://main.confluxrpc.org",
    logger: console
  });

  // ================================ Account =================================
  const account = cfx.Account({ privateKey: PRIVATE_KEY }); // create account instance

  // ================================ Contract ================================
  // create contract instance
  const contract = cfx.Contract({
    abi,
    address: process.env.CHAINLINK_EXAMPLE
  });

  const receipt = await contract
    .requestEthereumPrice(
      process.env.ORACLE,
      Buffer.from("b776a5eda42c41c796f3d16f32fbaa29"),
      1
    )
    .sendTransaction({ from: account })
    .executed();
  console.log(receipt);
}

main().catch(e => console.error(e));
