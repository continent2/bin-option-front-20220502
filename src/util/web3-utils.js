import Web3 from "web3";
export const getweirep = (val) => Web3.utils.toWei(val);

export const getethrep = (val, precision) => {
  let num = Web3.utils.fromWei(val);
  if (precision) {
    return (+num).toFixed(precision);
  } else {
    return num;
  }
};
