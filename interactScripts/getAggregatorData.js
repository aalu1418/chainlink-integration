/* eslint-disable */

const { Conflux, util } = require('js-conflux-sdk');
const { abi } = require('../chainlinkContractDeploy/build/contracts/FluxAggregator.json')
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
    address: process.env.FLUXAGGREGATOR
  });

  let data = await contract.latestRoundData();
  console.log("Latest Round:", data);

  data = await contract.oracleCount();
  console.log("Oracle Count:", data.toString());

  data = await contract.getOracles();
  console.log("Oracles", data);

  data = await contract.oracleRoundState("0x9E3b06e9ACE5AEdf3D17B4CCd0dA57Dd0c811559", 2)
  console.log("Round state", data);

  data = await contract.latestAnswer();
  console.log("Latest answer", data);

  data = await contract.latestTimestamp();
  console.log("Latest timestamp", data);

}

main().catch(e => console.error(e));
