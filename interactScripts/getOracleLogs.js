/* eslint-disable */

const { Conflux } = require("js-conflux-sdk");
const { abi } = require('../chainlinkContractDeploy/build/contracts/Oracle.json')
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

async function main() {
  const cfx = new Conflux({
    // url: 'http://mainnet-jsonrpc.conflux-chain.org:12537',
    url: 'http://testnet-jsonrpc.conflux-chain.org:12537',
    // logger: console,
  });

  // ================================ Account =================================
  const account = cfx.Account({privateKey: PRIVATE_KEY}); // create account instance
  console.log("Address: ", account.address); // 0x1bd9e9be525ab967e633bcdaeac8bd5723ed4d6b

  // ================================ Contract ================================
  // create contract instance
  const contract = cfx.Contract({
    abi,
    address: "0x87B883d578646d820762670615B74CEF1506d26C",
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
  console.log(logs);
}

main().catch((e) => console.error(e));
