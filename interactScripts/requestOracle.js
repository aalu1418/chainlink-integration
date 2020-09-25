/* eslint-disable */

const { Conflux, util } = require('js-conflux-sdk');
const { abi } = require('../chainlinkContractDeploy/build/contracts/ChainlinkExample.json')
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

async function main() {
  // const defaultGasPrice = util.unit("GDrip", "Drip")(10)

  const cfx = new Conflux({
    url: 'http://testnet-jsonrpc.conflux-chain.org:12537',
    logger: console,
  });

  // ================================ Account =================================
  const account = cfx.Account({privateKey: PRIVATE_KEY}); // create account instance

  // ================================ Contract ================================
  // create contract instance
  const contract = cfx.Contract({
    abi,
    address: "0x84806D7e51A716112dF70eBD737E4448644bb943"
  });

  const tx = contract.requestEthereumPrice("0x87B883d578646d820762670615B74CEF1506d26C", Buffer.from('7ea29ba4ede241828e3bb9a2bda465a9'), 1);
  const receipt = await account.sendTransaction(tx).executed();
  console.log(receipt);
}

main().catch(e => console.error(e));
