const Web3 = require("web3");
const rpcurl =
  "https://2EvdkPjZByjOR3yoJgVv8QGdXx3:c8651fe05ee16a71c836bc2eb34f3102@eth2-beacon-mainnet.infura.io";

let web3 = new Web3(new Web3.providers.HttpProvider(rpcurl));

module.exports = { web3 };
