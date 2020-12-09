/* eslint-disable */

const { Conflux, util } = require('js-conflux-sdk');
const { abi } = require('../chainlinkContractDeploy/build/contracts/LinkToken.json')
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

async function main() {
  // const defaultGasPrice = util.unit("GDrip", "Drip")(10)

  const cfx = new Conflux({
    url: 'http://test.confluxrpc.org',
    // logger: console,
  });

  // ================================ Account =================================
  const account = cfx.wallet.addPrivateKey(PRIVATE_KEY); // create account instance

  // ================================ Contract ================================
  // create contract instance
  const contract = cfx.Contract({
    abi,
    address: process.env.LINK
  });

  const balance = await contract.balanceOf(account.address);
  console.log("LINK Owner balance: ", balance.toString());

  const balanceContract = await contract.balanceOf(process.env.CHAINLINK_EXAMPLE);
  console.log("Trigger Contract balance: ", balanceContract.toString());

  const fluxAggregator = await contract.balanceOf(process.env.FLUXAGGREGATOR);
  console.log("FluxAggregator balance: ", fluxAggregator.toString());
}

main().catch(e => console.error(e));
