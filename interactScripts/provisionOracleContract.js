/* eslint-disable */

const { Conflux, util } = require('js-conflux-sdk');
const { abi } = require('../chainlinkContractDeploy/build/contracts/Oracle.json')
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

async function main() {
  // const defaultGasPrice = util.unit("GDrip", "Drip")(10)

  const cfx = new Conflux({
    url: 'http://main.confluxrpc.org',
    logger: console,
  });

  // ================================ Account =================================
  const account = cfx.Account({privateKey: PRIVATE_KEY}); // create account instance

  // ================================ Contract ================================
  // create contract instance
  const contract = cfx.Contract({
    abi,
    address: process.env.ORACLE,
  });

  const tx = contract.setFulfillmentPermission("0x15fd1e4f13502b1a8be110f100ec001d0270552d", true);
  const receipt = await account.sendTransaction(tx).executed();
  console.log(receipt);
}

main().catch(e => console.error(e));
