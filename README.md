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
* `interactScripts`: scripts for interacting with deployed contracts on conflux network testnet

### Deployment Order
1. Deploy LINK token
1. Deploy Oracle (needs LINK token address)
1. Deploy Example (needs LINK token address)
1. Provision Example contract with LINK tokens
1. Set up fulfillment permissions
1. Set up job specs in Chainlink node
1. Trigger transaction in Example contract

### Oceanus Deployment
```
Compiling your contracts...
===========================
> Compiling ./contracts/Oracle.sol
> Everything is up to date, there is nothing to compile.
> Artifacts written to /home/conflux/Documents/chainlink-integration/chainlinkContractDeploy/build/contracts
> Compiled successfully using:
   - solc: 0.6.6+commit.6c089d02.Emscripten.clang



Starting migrations...
======================
> Network name:    'development'
> Network id:      10002
> Block gas limit: 30000000 (0x1c9c380)


1_initial_migration.js
======================

   Deploying 'Migrations'
   ----------------------
   > transaction hash:    0x0e4b50625db255c5db8a7a35b14ecd61c2f439e589b28075f16ccc803e04d440
   > Blocks: 14           Seconds: 13
   > contract address:    0x837CbE135dA3eE5C66d66A660E998412048647Ae
   > block number:        7964490
   > block timestamp:     1601414553
   > account:             0x15fd1E4F13502b1a8BE110F100EC001d0270552d
   > balance:             299.43335004749970516
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
   > transaction hash:    0x3ff7efa19d740782506cc6c6551f57a08ade25cdc24a5433fe5ae6cc3b577d18
   > Blocks: 10           Seconds: 9
   > contract address:    0x86b147e80957A5f96D587a8b0ff0BAd59f7dEA53
   > block number:        7964525
   > block timestamp:     1601414600
   > account:             0x15fd1E4F13502b1a8BE110F100EC001d0270552d
   > balance:             293.18188607999970516
   > gas used:            1681003 (0x19a66b)
   > gas price:           20 GDrip
   > value sent:          0 CFX
   > total cost:          0.03362006 CFX

Link Token:  0x86b147e80957A5f96D587a8b0ff0BAd59f7dEA53

   Deploying 'Oracle'
   ------------------
   > transaction hash:    0x87ecf79352cf4a7a5ea162f3bbbbbf6045b5b0e2f0a40e21989dd5a9df46a5b1
   > Blocks: 16           Seconds: 13
   > contract address:    0x8A9da32715742d23DE89CA7125d1DFB8414eE015
   > block number:        7964546
   > block timestamp:     1601414603
   > account:             0x15fd1E4F13502b1a8BE110F100EC001d0270552d
   > balance:             285.62011893999970516
   > gas used:            2039728 (0x1f1fb0)
   > gas price:           20 GDrip
   > value sent:          0 CFX
   > total cost:          0.04079456 CFX


   Deploying 'ChainlinkExample'
   ----------------------------
   > transaction hash:    0x25e9dc207bb8205b4d95404c622a5dc81060dd07b43b6cba8746085df29e3fa1
   > Blocks: 13           Seconds: 9
   > contract address:    0x8627F9Ae0e8BAFcf9714365047fDf4f897290536
   > block number:        7964566
   > block timestamp:     1601414621
   > account:             0x15fd1E4F13502b1a8BE110F100EC001d0270552d
   > balance:             280.25366429999970516
   > gas used:            1459685 (0x1645e5)
   > gas price:           20 GDrip
   > value sent:          0 CFX
   > total cost:          0.0291937 CFX


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.10360832 CFX


Summary
=======
> Total deployments:   4
> Final cost:          0.10708334 CFX
```

### Startup commands
External Initiator:
```
./external-initiator "{\"name\":\"cfx-oceanus\",\"type\":\"conflux\",\"url\":\"http://mainnet-jsonrpc.conflux-chain.org:12537\"}" --chainlinkurl "http://localhost:6688/"
```

Chainlink Node:
```
cd ~/.chainlink-ropsten && docker run -p 6688:6688 -v ~/.chainlink-ropsten:/chainlink -it --env-file=.env smartcontract/chainlink local n
```

External Adapter:
```
node -e "require(\"dotenv\").config() && require(\"./index.js\").server()"
```

### Job Spec
```
{
  "initiators": [
    {
      "type": "external",
      "params": {
        "name": "cfx",
        "body": {
          "endpoint": "cfx-oceanus",
          "addresses": ["0x8A9da32715742d23DE89CA7125d1DFB8414eE015"]
        }
      }
    }
  ],
  "tasks": [
    {"type": "httpGet"},
    {"type": "jsonParse"},
    {"type": "multiply"},
    {"type": "cfxTx"}
  ]
}
```

### Bridge Config
Name: cfxTx  
Address: http://172.17.0.1:3000
