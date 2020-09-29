/* eslint-disable */

const { Conflux, util } = require('js-conflux-sdk');
const { abi } = require('../chainlinkContractDeploy/build/contracts/ChainlinkExample.json')
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

async function main() {
  // const defaultGasPrice = util.unit("GDrip", "Drip")(10)

  const cfx = new Conflux({
    url: 'http://testnet-jsonrpc.conflux-chain.org:12537',
    // logger: console,
  });

  // ================================ Account =================================
  const account = cfx.Account({privateKey: PRIVATE_KEY}); // create account instance

  // ================================ Contract ================================
  // create contract instance
  const contract = cfx.Contract({
    abi,
    address: process.env.CHAINLINK_EXAMPLE
  });

  const price = await contract.currentPrice();
  console.log("ETH price: ", price.toString());
}

main().catch(e => console.error(e));
