/* eslint-disable */

const { Conflux, util } = require("js-conflux-sdk");
const {
  abi
} = require("../chainlinkContractDeploy/build/contracts/ChainlinkExample.json");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

async function main() {
  // const defaultGasPrice = util.unit("GDrip", "Drip")(10)

  const cfx = new Conflux({
    url: "http://test.confluxrpc.org",
    logger: console
  });

  // ================================ Account =================================
  const account = cfx.wallet.addPrivateKey(PRIVATE_KEY); // create account instance

  // ================================ Contract ================================
  // create contract instance
  const contract = cfx.Contract({
    abi,
    address: process.env.CHAINLINK_EXAMPLE
  });

  const receipt = await contract
    .cancelRequest(
      Buffer.from(
        "57994d2f8f3ad0392b52964eff657d5916eb8fb08e2a55121a90296a93eab4a0",
        "hex"
      ),
      1,
      Buffer.from("4357855e", "hex"),
      "1601406831"
    )
    .sendTransaction({ from: account })
    .executed();
  console.log(receipt);
}

main().catch(e => console.error(e));
