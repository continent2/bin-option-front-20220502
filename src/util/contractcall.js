import Web3 from "web3";
import sha256 from "js-sha256";
import { abi as abi_erc20 } from "../contracts-abi/IERC20";

const jcontracts = {};
const web3 = new Web3(window.ethereum);

const MAP_STR_ABI = {
  ERC20: abi_erc20,
};

const query_noarg = (jargs) => {
  let { contractaddress, abikind, methodname } = jargs;
  let contract;
  contractaddress = contractaddress.toLowerCase();
  let sig = sha256(contractaddress + methodname);
  if (jcontracts[sig]) {
    contract = jcontracts[sig];
  } else {
    contract = new web3.eth.Contract(MAP_STR_ABI[abikind], contractaddress);
    jcontracts[sig] = contract;
  }
  return new Promise((resolve, reject) => {
    contract.methods[methodname]()
      .call((err, resp) => {
        console.log("", err, resp);
        if (err) {
          resolve(null);
          return;
        }
        resolve(resp);
      })
      .catch((err) => {
        resolve(null);
      });
  });
};

const query_with_arg = (jargs) => {
  let { contractaddress, abikind, methodname, aargs } = jargs;
  let contract;
  contractaddress = contractaddress.toLowerCase();
  let sig = sha256(contractaddress + methodname);
  if (jcontracts[sig]) contract = jcontracts[sig];
  else {
    contract = new web3.eth.Contract(MAP_STR_ABI[abikind], contractaddress);
    jcontracts[sig] = contract;
  }
  return new Promise((resolve, reject) => {
    contract.methods[methodname](...aargs)
      .call((err, resp) => {
        console.log("", err, resp);
        if (err) {
          resolve(null);
          return;
        }
        resolve(resp);
      })
      .catch((err) => {
        resolve(null);
      });
  });
};

const getabistr_forfunction = (jargs) => {
  let { contractaddress, abikind, methodname, aargs } = jargs;
  contractaddress = contractaddress.toLowerCase();

  let contract;
  let sig = sha256(contractaddress + methodname);

  if (jcontracts[sig]) contract = jcontracts[sig];
  else {
    console.log(
      "JtypWUVHIP",
      sig,
      jcontracts[sig],
      abikind,
      MAP_STR_ABI[abikind],
      contractaddress,
      methodname
    );
    contract = new web3.eth.Contract(MAP_STR_ABI[abikind], contractaddress);
    console.log("aof8kNLp31", contract);
    jcontracts[sig] = contract;
  }

  return contract.methods[methodname](...aargs).encodeABI();
};

const requesttransaction = async (jdata) => {
  if (!web3) {
    console.log("Wallet not found");
    return null;
  }
  let { from, to, data, value, gas } = jdata;

  // const signedTx = await web3.eth.personal.signTransaction(jdata)

  // web3.eth.sendSignedTransaction(signedTx.rawTransaction, (err, hash)=>{
  //   console.log(hash)
  //   if(!err){
  //     return hash
  //   }else{
  //     console.log(err)
  //     return;
  //   }
  // })

  let resp = await web3.eth
    .sendTransaction({
      from, //wallet address
      to, //contract address
      data, //abi
      value, //'0x00'
      gas: gas || "250000", //250000
    })
    .catch((e) => {
      console.log(e);
    });
  return resp;
};

const reqTx = async (jdata, post, catchFunc) => {
  if (!web3) {
    console.log("Wallet not found");
    return null;
  }
  let { from, to, data, value, gas } = jdata;

  console.log(jdata);

  let resp = await web3.eth
    .sendTransaction({
      from, //wallet address
      to, //contract address
      data, //abi
      value, //'0x00'
      gas: gas || "250000", //250000
    })
    .on("transactionHash", function (hash) {
      post(hash);
    })
    .catch((e) => {
      console.error(e);
      if (catchFunc) catchFunc();
    });
  return resp;
};

// const reqTx = async (jdata, post, finallyFunc) => {
//   if (!web3) {
//     console.log("Wallet not found");
//     return null;
//   }
//   let { from, to, data, value, gas } = jdata;

//   console.log(jdata);

//   let resp = await web3.eth
//     .sendTransaction({
//       from, //wallet address
//       to, //contract address
//       data, //abi
//       value, //'0x00'
//       gas: gas || "250000", //250000
//     })
//     .on("transactionHash", function (hash) {
//       post(hash);
//     })
//     .catch((e) => {
//       console.log(e);
//     })
//     .finally(() => finallyFunc());
//   return resp;
// };

const query_eth_balance = (useraddress) => {
  console.log("179라인 web3입니다", web3);
  console.log("180라인 윈도우 이더리움입니다", window.ethereum);
  return new Promise((resolve, reject) => {
    web3.eth
      .getBalance(useraddress)
      .then((resp) => {
        console.log("183번라인 resp입니다", resp);
        resolve(resp);
      })
      .catch((err) => {
        resolve(null);
      });
  });
};

export { getabistr_forfunction, requesttransaction, reqTx, query_eth_balance };
export { query_with_arg, query_noarg };
