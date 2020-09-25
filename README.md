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
1. Set up job specs in Chainlink node
1. Trigger transaction in Example contract

### Testnet Deployment
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
> Network id:      10001
> Block gas limit: 30000000 (0x1c9c380)


1_initial_migration.js
======================

   Deploying 'Migrations'
   ----------------------
   > transaction hash:    0x2a347d5497c9c98ec753cda755e32b9e281357d6f80ad6eeb3ad21eed531b54b
   > Blocks: 5            Seconds: 101
   > contract address:    0x8aD3aeED7A2cc5e290179ba717fE4826FeE4bB95
   > block number:        2139062
   > block timestamp:     1600983086
   > account:             0x15fd1E4F13502b1a8BE110F100EC001d0270552d
   > balance:             195.851318796718182188
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
   > transaction hash:    0x05b3825bed5095dad56ee934f7e636b30cff01660f8398253f229146fd2a5b03
   > Blocks: 3            Seconds: 61
   > contract address:    0x85d5d16a1418bcd4456F5842F9720dBb009104c6
   > block number:        2139074
   > block timestamp:     1600983227
   > account:             0x15fd1E4F13502b1a8BE110F100EC001d0270552d
   > balance:             189.599854829218182188
   > gas used:            1681003 (0x19a66b)
   > gas price:           20 GDrip
   > value sent:          0 CFX
   > total cost:          0.03362006 CFX

Link Token:  0x85d5d16a1418bcd4456F5842F9720dBb009104c6

   Deploying 'Oracle'
   ------------------
   > transaction hash:    0x3c616aa2244fa9ba35f58867d8659e191167e99e861fa1f5f42202832ff9fe76
   > Blocks: 5            Seconds: 97
   > contract address:    0x87B883d578646d820762670615B74CEF1506d26C
   > block number:        2139080
   > block timestamp:     1600983305
   > account:             0x15fd1E4F13502b1a8BE110F100EC001d0270552d
   > balance:             182.038087689218182188
   > gas used:            2039664 (0x1f1f70)
   > gas price:           20 GDrip
   > value sent:          0 CFX
   > total cost:          0.04079328 CFX


   Deploying 'ChainlinkExample'
   ----------------------------
   > transaction hash:    0x596b87f6eb9323024037772487fde94735673a7377efa45e501a8e49973482f9
   > Blocks: 4            Seconds: 97
   > contract address:    0x84806D7e51A716112dF70eBD737E4448644bb943
   > block number:        2139085
   > block timestamp:     1600983428
   > account:             0x15fd1E4F13502b1a8BE110F100EC001d0270552d
   > balance:             176.671633049218182188
   > gas used:            1459621 (0x1645a5)
   > gas price:           20 GDrip
   > value sent:          0 CFX
   > total cost:          0.02919242 CFX


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.10360576 CFX


Summary
=======
> Total deployments:   4
> Final cost:          0.10708078 CFX
```

### Startup commands
External Initiator:
```
./external-initiator "{\"name\":\"cfx-testnet\",\"type\":\"conflux\",\"url\":\"http://testnet-jsonrpc.conflux-chain.org:12537\"}" --chainlinkurl "http://localhost:6688/"
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
          "endpoint": "cfx-testnet",
          "addresses": ["0x87B883d578646d820762670615B74CEF1506d26C"]
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
