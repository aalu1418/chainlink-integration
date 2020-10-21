/* eslint-disable */

const { Conflux } = require("js-conflux-sdk");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

async function main() {
  const cfx = new Conflux({
    // url: 'http://main.confluxrpc.org',
    url: 'http://testnet-jsonrpc.conflux-chain.org:12537',
    defaultGasPrice: 100,
    defaultGas: 1000000,
    // logger: console,
  });

  // console.log(cfx.defaultGasPrice); // 100
  // console.log(cfx.defaultGas); // 1000000

  // ================================ Account =================================
  const account = cfx.Account({privateKey: PRIVATE_KEY}); // create account instance
  console.log("Address: ", account.address); // 0x1bd9e9be525ab967e633bcdaeac8bd5723ed4d6b

  // ================================ Contract ================================
  // create contract instance
  const contract = cfx.Contract({
    abi: require("./contract/abi.json"), //can be copied from remix
    address: "0x86077ad2716906dcd81f0cc9c128e336b8ef264e",
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
