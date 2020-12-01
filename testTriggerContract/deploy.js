/* eslint-disable */

const { Conflux, util } = require("js-conflux-sdk");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

async function main() {
  // const defaultGasPrice = util.unit("GDrip", "Drip")(10)

  const cfx = new Conflux({
    url: "http://test.confluxrpc.org",
    defaultGasPrice: 100,
    defaultGas: 1000000,
    logger: console
  });

  console.log(cfx.defaultGasPrice); // 100
  console.log(cfx.defaultGas); // 1000000

  // ================================ Account =================================
  const account = cfx.wallet.addPrivateKey(PRIVATE_KEY); // create account instance
  console.log(account.address); // 0x1bd9e9be525ab967e633bcdaeac8bd5723ed4d6b

  // ================================ Contract ================================
  // create contract instance
  const contract = cfx.Contract({
    abi: require("./contract/abi.json"), //can be copied from remix
    bytecode: require("./contract/bytecode.json") //on remix, found in compilation details => web3deploy => data (should be a hex string)
    // address is empty and wait for deploy
  });

  // deploy the contract, and get `contractCreated`
  const receipt = await contract
    .constructor()
    .sendTransaction({ from: account })
    .executed();
  console.log(receipt);
}

main().catch(e => console.error(e));
