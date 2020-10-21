/* eslint-disable */

const { Conflux } = require('js-conflux-sdk');
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

async function main() {
  const cfx = new Conflux({
    // url: 'http://main.confluxrpc.org',
    url: 'http://main.confluxrpc.org',
    defaultGasPrice: 100,
    defaultGas: 1000000,
    logger: console,
  });

  // console.log(cfx.defaultGasPrice); // 100
  // console.log(cfx.defaultGas); // 1000000

  // ================================ Account =================================
  const account = cfx.Account({privateKey: PRIVATE_KEY}); // create account instance
  console.log("Account Address: ", account.address); // 0x1bd9e9be525ab967e633bcdaeac8bd5723ed4d6b

  // ================================ Contract ================================
  // create contract instance
  const contract = cfx.Contract({
    abi: require('./contract/abi.json'), //can be copied from remix
    address: "0x86077ad2716906dcd81f0cc9c128e336b8ef264e",
  });

  // interact with contract
  const data = "63676574783f68747470733a2f2f6d696e2d6170692e63727970746f636f6d706172652e636f6d2f646174612f70726963653f6673796d3d455448267473796d733d5553446470617468635553446574696d65731864"
  const input = new Buffer.from(data, "hex")
  // console.log(String(input));
  const tx = contract.emitEvent(Buffer.from('7ea29ba4ede241828e3bb9a2bda465a9'), String(input));
  const receipt = await account.sendTransaction(tx).executed();

  console.log("Transaction Receipt: ", receipt);
}

main().catch(e => console.error(e));
