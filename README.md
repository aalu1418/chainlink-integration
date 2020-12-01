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
* `chainlinkContractDeploy`: deploying contracts to local docker image using conflux-truffle
* `interactScripts`: scripts for interacting with deployed contracts on conflux network testnet

### Deployment Order
1. Deploy LINK token
1. Deploy Oracle (needs LINK token address)
1. Deploy Example (needs LINK token address)
1. Provision Example contract with LINK tokens
1. Set up fulfillment permissions
1. Set up job specs in Chainlink node
1. Trigger transaction in Example contract

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

### Startup commands
External Initiator:
```
./external-initiator "{\"name\":\"cfx-testnet\",\"type\":\"conflux\",\"url\":\"http://test.confluxrpc.org\"}" --chainlinkurl "http://localhost:6688/"
```

Chainlink Node:
```
cd ~/.chainlink-ropsten && docker run -p 6688:6688 -v ~/.chainlink-ropsten:/chainlink -it --env-file=.env smartcontract/chainlink local n
```

External Adapter:
```
node -e "require(\"dotenv\").config() && require(\"./index.js\").server()"
```

### Job Spec (Request + Fulfill Model)
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
