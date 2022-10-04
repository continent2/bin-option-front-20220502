const Web3 = require("web3");
const urltestnet =
  "https://eth-goerli.g.alchemy.com/v2/GpYKX0hISz5jDmvnPsCaWFrQVxr_gDG7";
let web3 = new Web3(new Web3.providers.HttpProvider(urltestnet));

module.exports = { web3 };
