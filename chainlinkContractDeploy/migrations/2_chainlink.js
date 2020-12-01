const LinkToken = artifacts.require("LinkToken");
const Oracle = artifacts.require("Oracle");
const ChainlinkExample = artifacts.require("ChainlinkExample");
const FluxAggregator = artifacts.require("FluxAggregator");

module.exports = async function(deployer) {
  await deployer.deploy(LinkToken);
  console.log("Link Token: ", LinkToken.address);
  await deployer.deploy(Oracle, LinkToken.address);
  await deployer.deploy(ChainlinkExample, LinkToken.address);
  await deployer.deploy(
    FluxAggregator,
    LinkToken.address,
    "100",
    "30",
    "0x0000000000000000000000000000000000000000",
    "0",
    "10000000000",
    "2",
    "testFeed"
  );
};
