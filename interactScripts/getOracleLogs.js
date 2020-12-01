/* eslint-disable */

const { Conflux } = require("js-conflux-sdk");
const { abi } = require('../chainlinkContractDeploy/build/contracts/Oracle.json')
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

async function main() {
  const cfx = new Conflux({
    // url: 'http://main.confluxrpc.org',
    url: 'http://test.confluxrpc.org',
    // logger: console,
  });

  // ================================ Account =================================
  const account = cfx.wallet.addPrivateKey(PRIVATE_KEY); // create account instance
  console.log("Address: ", account.address); // 0x1bd9e9be525ab967e633bcdaeac8bd5723ed4d6b

  // ================================ Contract ================================
  // create contract instance
  const contract = cfx.Contract({
    abi,
    address: process.env.ORACLE,
  });

  // // get current number
  // const output = await contract.getNum();
  // console.log("On-chain state: ", Number(output));

  const epochNum = await cfx.getEpochNumber();
  console.log("Current epoch: ", epochNum);

  const logs = await cfx.getLogs({
    address: contract.address,
    fromEpoch: epochNum-10000,
    toEpoch: "latest_state",
    limit: 1,
    topics: [],
  });
  console.log(logs[0]);
  console.log(contract.abi.decodeLog(logs[0]));
}

main().catch((e) => console.error(e));
