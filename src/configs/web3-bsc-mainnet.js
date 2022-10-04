const Web3 = require("web3");
const rpcurl = "https://bsc-dataseed4.defibit.io";

let web3 = new Web3(new Web3.providers.HttpProvider(rpcurl));

module.exports = { web3 };
