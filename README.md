# chainlink-integration
Repo for testing chainlink integration with Conflux Network.

External Initiator: https://github.com/smartcontractkit/external-initiator

External Adapter: https://github.com/Conflux-Network-Global/conflux-network-adapter

Contracts:
* Link Token: https://github.com/smartcontractkit/LinkToken
* Chainlink Example: https://gist.github.com/samsondav/4a0ca9a20afcd2d3e670eeb87780f23a
* Oracle Contract: https://gist.github.com/samsondav/4cc6c6a54c341daf3f9a50957a241a9e
* FluxAggregator: https://github.com/smartcontractkit/chainlink/blob/develop/evm-contracts/src/v0.6/FluxAggregator.sol

### Folders
* `testTriggerContract`: simple contract that emits an event to trigger oracle
* `chainlinkContractDeploy`: deploying contracts to local docker image using conflux-truffle
* `interactScripts`: scripts for interacting with deployed contracts on conflux network testnet

## Deployment Order

### Contract Deployment Order (Fulfill/Request Model)
1. Deploy LINK token
1. Deploy Oracle (needs LINK token address)
1. Deploy Example (needs LINK token address)
1. Deploy FluxAggregator (needs LINK token address + price feed parameters)

### Deploying the Fulfill/Request Model
1. Set up the Chainlink node, external initiator, and external adapter
1. Provision Example contract with LINK tokens (`provisionRequestContract.js`)
1. Set up fulfillment permissions (`provisionOracleContract.js`)
1. Set up job specs in Chainlink node [Link](./jobSpecs/oracleRequestFulfill.json)
1. Trigger transaction in Example contract (`requestOracle.js`)

### Deploying the Price Feed Model
1. Set up the Chainlink node, ETH to CFX relay, Coingecko adapter, and external adapter
1. Provision the Flux Aggregator with the corresponding addresses (`provisionFluxAggregator.js`)
   * Requires giving permission to Chainlink node address + adapter address (to allow checking + submitting)
1. Set up job specs in Chainlink node [Link](./jobSpecs/fluxAggregator.json)
1. Trigger a round using `triggerFluxAggregator.js` (**still working on automatically triggering new rounds**)

### Testnet Deployment
```
Starting migrations...
======================
> Network name:    'testnet'
> Network id:      10001
> Block gas limit: 30000000 (0x1c9c380)


1_initial_migration.js
======================

   Replacing 'Migrations'
   ----------------------
   > transaction hash:    0x9a1b2cea908eb39c135bf7cdb7caf64e9767ac2707df3cb276f2ee0729af7913
   > Blocks: 16           Seconds: 8
   > contract address:    0x8a241B50A4e3445f76E187e89c3cAaD7BB9B2943
   > block number:        4133052
   > block timestamp:     1606861681
   > account:             0x15fd1E4F13502b1a8BE110F100EC001d0270552d
   > balance:             347.114640405570783506
   > gas used:            173751 (0x2a6b7)
   > gas price:           20 GDrip
   > value sent:          0 CFX
   > total cost:          0.00347502 CFX


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.00347502 CFX


2_chainlink.js
==============

   Deploying 'LinkToken'
   ---------------------
   > transaction hash:    0x6ac5f3a60f3d4b8cb39ffd26cd33b6cd52b62a2e81cb487126805868596ef791
   > Blocks: 10           Seconds: 8
   > contract address:    0x803204BCA4fB5a0aE45bfce47D86C9353752b703
   > block number:        4133088
   > block timestamp:     1606861705
   > account:             0x15fd1E4F13502b1a8BE110F100EC001d0270552d
   > balance:             343.499640405570783506
   > gas used:            1681003 (0x19a66b)
   > gas price:           20 GDrip
   > value sent:          0 CFX
   > total cost:          0.03362006 CFX

Link Token:  0x803204BCA4fB5a0aE45bfce47D86C9353752b703

   Deploying 'Oracle'
   ------------------
   > transaction hash:    0xaacfa2f71ceacb20c016dec0b32b25abcc24d97fc0841c1904065583ed2f5e23
   > Blocks: 11           Seconds: 8
   > contract address:    0x8e98c9E82E1956fa132360F48E1c75a2DaB9a439
   > block number:        4133107
   > block timestamp:     1606861716
   > account:             0x15fd1E4F13502b1a8BE110F100EC001d0270552d
   > balance:             339.192140405570783506
   > gas used:            2039728 (0x1f1fb0)
   > gas price:           20 GDrip
   > value sent:          0 CFX
   > total cost:          0.04079456 CFX


   Deploying 'ChainlinkExample'
   ----------------------------
   > transaction hash:    0x067a084833b4f11a98fe024bdac3932f455c6a8daacb7c9af2a91d69b3ac43da
   > Blocks: 10           Seconds: 8
   > contract address:    0x8D4931C7a274452d1E0aCA0BcB3886178dc379B2
   > block number:        4133125
   > block timestamp:     1606861729
   > account:             0x15fd1E4F13502b1a8BE110F100EC001d0270552d
   > balance:             335.884640405570783506
   > gas used:            1459685 (0x1645e5)
   > gas price:           20 GDrip
   > value sent:          0 CFX
   > total cost:          0.0291937 CFX


   Deploying 'FluxAggregator'
   --------------------------
   > transaction hash:    0xb5a3e8b3f9d8409ae9cd6aa190e5f0bec3688ffc8057198558c805b37edeb544
   > Blocks: 11           Seconds: 8
   > contract address:    0x841042eb024008e7A8Ae5277331d2858df4a9368
   > block number:        4133142
   > block timestamp:     1606861742
   > account:             0x15fd1E4F13502b1a8BE110F100EC001d0270552d
   > balance:             320.851035765570783506
   > gas used:            7930232 (0x790178)
   > gas price:           20 GDrip
   > value sent:          0 CFX
   > total cost:          0.15860464 CFX


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.26221296 CFX


Summary
=======
> Total deployments:   5
> Final cost:          0.26568798 CFX
```

## Components
### Conflux External Initiator
Used in the Fulfill/Request model
```
./external-initiator "{\"name\":\"cfx-testnet\",\"type\":\"conflux\",\"url\":\"http://test.confluxrpc.org\"}" --chainlinkurl "http://localhost:6688/"
```

### Chainlink Node
```
cd ~/.chainlink-ropsten && docker run -p 6688:6688 -v ~/.chainlink-ropsten:/chainlink -it --env-file=.env smartcontract/chainlink:0.9.6 local n
```

`.env` file for fulfill/request
```
ROOT=/chainlink
LOG_LEVEL=debug
ETH_CHAIN_ID=3
MIN_OUTGOING_CONFIRMATIONS=2
LINK_CONTRACT_ADDRESS=0x803204BCA4fB5a0aE45bfce47D86C9353752b703
CHAINLINK_TLS_PORT=0
SECURE_COOKIES=false
ALLOW_ORIGINS=*
DATABASE_TIMEOUT=0
DATABASE_URL=<insert db url>
ETH_DISABLED=true
FEATURE_EXTERNAL_INITIATORS=true
CHAINLINK_DEV=true
```


`.env` file for price feeds
```
ROOT=/chainlink
LOG_LEVEL=debug
ETH_CHAIN_ID=3
MIN_OUTGOING_CONFIRMATIONS=2
LINK_CONTRACT_ADDRESS=0x803204BCA4fB5a0aE45bfce47D86C9353752b703
CHAINLINK_TLS_PORT=0
SECURE_COOKIES=false
ALLOW_ORIGINS=*
DATABASE_TIMEOUT=0
DATABASE_URL=<insert db url>
ETH_DISABLED=false
FEATURE_EXTERNAL_INITIATORS=true
CHAINLINK_DEV=true
ETH_URL=ws://172.17.0.1:3000
MINIMUM_CONTRACT_PAYMENT=1
```

### Conflux External Adapter
```
node -e "require(\"dotenv\").config() && require(\"./index.js\").server()"
```
Name: cfxTx  
Address: http://172.17.0.1:5000

### [ETH => CFX Relay](https://github.com/Conflux-Network-Global/eth2cfx-relay)
Relay used to convert ETH API calls to CFX API calls (used in the price feed configuration)

### [Coingecko Adapter](https://github.com/smartcontractkit/external-adapters-js/tree/master/coingecko)
Used in the FluxAggregator + Price Feed Configuration
```
yarn server
```
Adapter: https://github.com/smartcontractkit/external-adapters-js/tree/master/coingecko
Address: http://172.17.0.1:8080
