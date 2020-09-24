# chainlink-integration
Repo for testing chainlink integration with Conflux Network.

External Initiator: https://github.com/smartcontractkit/external-initiator

External Adapter: https://github.com/Conflux-Network-Global/conflux-network-adapter

Contracts:
* Link Token: https://github.com/smartcontractkit/LinkToken
* Chainlink Example: https://gist.github.com/samsondav/4a0ca9a20afcd2d3e670eeb87780f23a
* Oracle Contract: https://gist.github.com/samsondav/4cc6c6a54c341daf3f9a50957a241a9e

### Folders
* `testTriggerContract`: simple contract that emits an event to trigger oracle
* `chainlinkContractDeploy`: deploying contracts to local docker image using conflux-truffle (need to wait a few minutes for accounts to unlock)
