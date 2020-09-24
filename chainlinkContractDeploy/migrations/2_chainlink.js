const LinkToken = artifacts.require("LinkToken");
const Oracle = artifacts.require("Oracle");
const ChainlinkExample = artifacts.require("ChainlinkExample");


module.exports = async function(deployer) {
  await deployer.deploy(LinkToken);
  console.log("Link Token: ", LinkToken.address);
  await deployer.deploy(Oracle, LinkToken.address);
  await deployer.deploy(ChainlinkExample, LinkToken.address);
};
