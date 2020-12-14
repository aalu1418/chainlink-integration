# Price Feed Deployment Steps on Conflux Network

The following document details how to deploy Chainlink price feeds on Conflux Network using the latest version of the Chainlink node (v0.9.6).

## Necessary Components

### Off-Chain Components
**[Chainlink Node](https://docs.chain.link/docs/running-a-chainlink-node):** The core of the price feed functionality for monitoring the blockchain, changes in price, and submitting new rounds.

**[CoinGecko Adapter](https://github.com/smartcontractkit/external-adapters-js/tree/master/coingecko):** Allows the Chainlink node to pull data from CoinGecko. Other adapters can be used for price feeds as well.

**[Conflux External Adapter](https://github.com/Conflux-Network-Global/conflux-network-adapter):** Allows the Chainlink node to submit data back to Conflux Network through a transaction.

**[ETH2CFX Relay](https://github.com/Conflux-Network-Global/eth2cfx-relay):** Converts `eth_*` RPC calls to `cfx_*` calls and returns the properly formatted EVM responses. Allows the Chainlink node to communicate with Conflux Network (in a limited manner - not all EVM calls are supported)

### On-Chain Components
**[LINK Token Smart Contract](https://github.com/smartcontractkit/LinkToken/blob/master/flat/v0.6/LinkToken.sol)**

**[FluxAggregator Smart Contract](https://github.com/smartcontractkit/chainlink/blob/develop/evm-contracts/src/v0.6/FluxAggregator.sol)**

**[Conflux Network Websocket](https://developer.conflux-chain.org/docs/conflux-doc/docs/pubsub)**


## Setup the Components

### Deploy Smart Contracts
1. Navigate to the `./chainlinkContractDeploy` folder.
1. Deploying to Conflux Network uses a modified version of `truffle` called `cfxtruffle` (may require installation of the `conflux-truffle` package)
1. Run `yarn` to pull relevant dependencies.
1. Configure a `.env` file in the folder with `PRIVATE_KEY=<private key>`
1. Run `cfxtruffle migrate --network testnet` (or whichever network is preferred)

### Start Up the Adapters
#### CoinGecko
1. `git clone https://github.com/smartcontractkit/external-adapters-js/`
1. `cd external-adapters-js/coingecko`
1. `yarn && yarn server`

This should start the CoinGecko adapter on port 8080.

#### Conflux Network
1. `git clone https://github.com/Conflux-Network-Global/conflux-network-adapter`
1. `cd conflux-network-adapter`
1. `yarn`
1. Create a `.env` file with:
```
PRIVATE_KEY=<private key>
URL=http://test.confluxrpc.org/
EA_PORT=5000
```
1. `node -e "require(\"dotenv\").config() && require(\"./index.js\").server()"`

This should start the Conflux Network adatper on port 5000.

### Start Up the Chainlink Node
1. `git clone https://github.com/Conflux-Network-Global/eth2cfx-relay`
1. Create an `.env` file with (this should start a websocket endpoint on port 3000):
```
ENDPOINT=<insert WS endpoint>
PORT=3000
```
1. `yarn && yarn start`
1. Use the following instructions to set up a Chainlink node: https://docs.chain.link/docs/running-a-chainlink-node with the following `.env` file:
```
ROOT=/chainlink
LOG_LEVEL=debug
ETH_CHAIN_ID=3
MIN_OUTGOING_CONFIRMATIONS=2
LINK_CONTRACT_ADDRESS=<LINK token address from deployed instance>
CHAINLINK_TLS_PORT=0
SECURE_COOKIES=false
ALLOW_ORIGINS=*
DATABASE_TIMEOUT=0
DATABASE_URL=<database URL>
ETH_DISABLED=false
ETH_URL=ws://172.17.0.1:3000
MINIMUM_CONTRACT_PAYMENT=1
```

Note: The minimum contract payment can be set up to the user desired amount. This sample is used for configuration for a demo. The Chainlink node will be running in a docker container that accesses other adapters and endpoints using the docker gateway IP (172.17.0.1 for Linux)

Start up command for Chainlink node:
```
cd ~/.chainlink-ropsten && docker run -p 6688:6688 -v ~/.chainlink-ropsten:/chainlink -it --env-file=.env smartcontract/chainlink:0.9.6 local n
```

## Connect the Components
### Provision the smart contracts
1. Navigate to `./interactScripts`
1. Create a `.env` file with:
```
PRIVATE_KEY=<contract deployer private key>
LINK=<LINK token address>
FLUXAGGREGATOR=<Flux Aggregator address>
```
1. Set up the proper addresses in the `provisionFluxAggregator.js` file (using the `changeOracles` function, these addresses should be the address for the Chainlink node to allow it to check the round status, and the external adapter address to allow round fulfillment)
1. Run `node provisionFluxAggregator` to transfer 1 LINK to the aggregator contract, set round fulfillment permissions, and request permissions.
1. Run `node triggerFluxAggregator` to begin the rounds.

Note: Because 1 Chainlink node requires usage of two addresses (one for checking round status, and one for fulfillment the maximum round submissions should be set low in order to move the round forward quickly)

### Connect the Chainlink Node
1. Log into the Chainlink node at http://localhost:8866
1. Create two bridges:
   1. Name: `cfxTx` with URL: http://172.17.0.1:5000
   1. Name: `coingecko` with URL: http://172.17.0.1:8080
1. Create a new job with the following specs:
```
{
  "initiators": [
    {
      "type": "fluxmonitor",
      "params": {
        "address": "<flux aggregator address here>",
        "requestData": {
          "data": {
            "coin": "ETH",
            "market": "USD"
          }
        },
        "feeds": [{ "bridge": "coingecko" }],
        "precision": 2,
        "threshold": 0.1,
        "absoluteThreshold": 0,
        "idleTimer": {
          "duration": "0h1m0s"
        },
        "pollTimer": {
          "period": "15s"
        }
      }
    }
  ],
  "tasks": [
    {
      "type": "cfxTx",
      "params": {
        "times": 100
      }
    }
  ]
}
```

The node should begin completing rounds approximately every 15 seconds assuming the threshold is met.

## Notes
* If the Chainlink node needs to be restarted, please also restart the ETH2CFX relay. Otherwise it may throw an error.
