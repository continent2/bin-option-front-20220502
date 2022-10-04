let jweb3 = {
  ETH_TESTNET_GOERLI: require("./web3-ethtestnet-goerli").web3,
  BSC_MAINNET: require("./web3-bscmainnet").web3,
  //   POLYGON_TESTNET_MUMBAI: require("./web3mumbai").web3,
  //   BSC_TESTNET: require("./web3-bsctestnet").web3,
};
const supported_net = {
  ETH_TESTNET_GOERLI: 1,
  POLYGON_MAINNET: 1,
  BSC_MAINNET: 1,
};

module.exports = { jweb3, supported_net };
