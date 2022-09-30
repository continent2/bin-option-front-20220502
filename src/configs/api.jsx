//export const URL = "http://options1.net:30708";
// export const URL = "http://litriggy.com:30708";
// export const URL = "https://options1.net:30718";
// export const URL = "https://options1.net:30718";
let { nettype } = require("../configs/nettype");
export const URL = "https://options1.net:34861";
const _URL = (args) => `https://options1.net:34861${args}?nettype=${nettype}`;

export const API = {
  SIGNUP: URL + "/users/signup", //:type
  LOGIN: URL + "/users/login", //:type
  AUTH: URL + "/users/auth",

  RESET_PW: URL + "/users/reset/password", //:type
  RESET_VERIFY: URL + "/users/reset/verify", //:type/:code
  CHANGE_PW: URL + "/users/change/password", //:type
  REFRESH: URL + "/users/refresh",
  EDIT_REF: URL + "/users/edit/ref",
  MY_POSITION: URL + "/users/my/position",
  USER_PROFILE: URL + "/users/profile",
  USER_DAILY_SUMMARY: URL + "/users02/daily-summary",
  USER_SEND_CERTIFICATION: URL + "/users/send/verification", //:type
  USER_VERIFY: URL + "/users/verify", //:type/:code
  USER_QUERY: URL + "/users/query", //tablename/offset/limit
  USER_BALANCE: URL + "/users/balance",
  USER_BRANCH: URL + "/users/branch", //:offset/:limit/:orderkey/:orderval
  USER_BRANCH_FEE_LOG: URL + "/users/branch/fee/log", //:offset/:limit/:orderkey/:orderval
  USER_PREDEPOSIT: URL + "/users/predeposit",
  USER_BETLOGS: URL + "/users/betlogs", //:type/:offset/:limit
  USER_DEMO_TOKEN: URL + "/users/demo/token",
  USER_REFERRAL: URL + "/users/myreferrals", //:offset/:limit/id/DESC
  NOTI: URL + "/users/notice/setting",
  USER_REFERRAL_HISTORY: URL + "/users/myreferrals/fee/log", //:offset/:limit/id/DESC
  INQUIRY_ENROLL: URL + "/inquiry/enroll",
  NOTI_SET: URL + "/users/notice/set",
  GET_TICKERS: URL + "/tickers",

  GET_DEPOSIT_FEE: URL + "/transactions/info/deposit",
  GET_FEE_RANGE: URL + "/transactions/info/withdraw",

  GET_ASSETS: URL + "/assets/list",
  GET_ASSETS_GROUP: URL + "/assets/groups",
  GET_ASSETS_TICKER_PRICE: URL + "/assets/ticker/price", //:symbol

  PHONE_COUNTRY_CODE: URL + "/queries/v1/rows/country_code", //:offset/:limit

  BETS: URL + "/bets/join", // /:type/:assetId/:amount/:dur/:side
  MY_BETS: URL + "/bets/my", // type

  TRANSACTION_BRANCH_LIST: (offset, limit) =>
    _URL(`/transactions/branch/list/${offset}/${limit}`),
  TRANSACTION_BRANCH_TRANSFER: _URL("/transactions/branch/transfer"),
  TRANS_DEPOSIT: URL + `/transactions/live/DEPOSIT`, //:amount
  LISTEN_TRANSACTION: (type) => _URL(`/transactions/listen/${type}`),

  TRANS_DEMO_FUND: (amount) => _URL(`/transactions/demo/fund/${amount}`), //:amount

  TRANS_WITHDRAW: (amount) => _URL(`/transactions/live/withdraw/${amount}`), //:amount
  WITHDRAW: URL + "/transactions/withdraw",

  BOOKMARKS: URL + "/bookmarks", //:type/:targetId
  BOOKMARKS_MY: URL + "/bookmarks/my",

  QUERIES_FOREX: URL + "/queries/forex", //:type

  GET_QUERIES_FOREX: URL + "/queries/kvs/FOREX",
  GET_TXREQUEST: URL + "/queries/rows/txrequests/receiver",

  ADMIN_LEVEL_FEE: URL + "/admins/level/fee",
  ADMIN_FEE_SETTING: URL + "/admins/fee/setting", //:level
  ADMIN_QR: URL + "/admins/domain/setting/qr",

  GET_RECEIVE_AGENTS: URL + "/transfers/receiving-agents",

  POST_ORDER_REQUEST: URL + `/transfers/processing-request?nettype=${nettype}`,

  GET_FRONT_VER: URL + "/queries/singlerow/settings/name/FRONT_VER",
};
