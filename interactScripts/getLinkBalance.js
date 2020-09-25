/* eslint-disable */

const { Conflux, util } = require('js-conflux-sdk');
const { abi } = require('../chainlinkContractDeploy/build/contracts/LinkToken.json')
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
    address: "0x85d5d16a1418bcd4456F5842F9720dBb009104c6"
  });

  const balance = await contract.balanceOf(account.address);
  console.log("LINK Owner balance: ", balance.toString());

  const balanceContract = await contract.balanceOf("0x84806D7e51A716112dF70eBD737E4448644bb943");
  console.log("Trigger Contract balance: ", balanceContract.toString());
}

main().catch(e => console.error(e));
