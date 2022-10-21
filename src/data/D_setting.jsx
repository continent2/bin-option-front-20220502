import I_personWhite from "../img/icon/I_personWhite.svg";
import I_divisionWhite from "../img/icon/I_divisionWhite.svg";
import I_bellWhite from "../img/icon/I_bellWhite.svg";
import I_securityWhite from "../img/icon/I_securityWhite.svg";
import I_financeWhite from "../img/icon/I_financeWhite.svg";
import I_orders from "../img/icon/I_orders.svg";

export const D_settingNavList = [
  {
    icon: I_personWhite,
    key: "My Profile",
    url: "prof",
  },
  {
    icon: I_divisionWhite,
    key: "Referral",
    url: "referral",
  },
  {
    icon: I_bellWhite,
    key: "Notifications",
    url: "noti",
  },
  {
    icon: I_securityWhite,
    key: "Security",
    url: "security",
  },
];

export const D_referralCategoryList = ["Referrals", "History"];

export const D_recommenderListHeader = [
  "No",
  "Account",
  "Recommender Level",
  "Date of subscription",
  "Trade amount",
  "Profit",
  "Received",
];

export const D_recommenderList = [
  {
    account: "sdfsf199@gmail.com",
    level: 1,
    subscriptionDate: new Date(),
    amount: 1,
    profit: 1.92,
    received: 1,
  },
  {
    account: "sdfsf199@gmail.com",
    level: 1,
    subscriptionDate: new Date(),
    amount: 1,
    profit: 1.92,
    received: 1,
  },
];

export const D_historyListHeader = [
  "No",
  "Account",
  "Amount",
  "Cashback Percent",
  "Balance",
  "Date",
];

export const D_historyList = [
  {
    account: "0xCF529119C86eFF8d139Ce8CFfaF5941DA94bae5b",
    amount: 1,
    cashBack: 1,
    balance: 1,
    date: new Date(),
  },
  {
    account: "0xCF529119C86eFF8d139Ce8CFfaF5941DA94bae5b",
    amount: 1,
    cashBack: 1,
    balance: 1,
    date: new Date(),
  },
  {
    account: "0xCF529119C86eFF8d139Ce8CFfaF5941DA94bae5b",
    amount: 1,
    cashBack: 1,
    balance: 1,
    date: new Date(),
  },
  {
    account: "0xCF529119C86eFF8d139Ce8CFfaF5941DA94bae5b",
    amount: 1,
    cashBack: 1,
    balance: 1,
    date: new Date(),
  },
  {
    account: "0xCF529119C86eFF8d139Ce8CFfaF5941DA94bae5b",
    amount: 1,
    cashBack: 1,
    balance: 1,
    date: new Date(),
  },
  {
    account: "0xCF529119C86eFF8d139Ce8CFfaF5941DA94bae5b",
    amount: 1,
    cashBack: 1,
    balance: 1,
    date: new Date(),
  },
  {
    account: "0xCF529119C86eFF8d139Ce8CFfaF5941DA94bae5b",
    amount: 1,
    cashBack: 1,
    balance: 1,
    date: new Date(),
  },
  {
    account: "0xCF529119C86eFF8d139Ce8CFfaF5941DA94bae5b",
    amount: 1,
    cashBack: 1,
    balance: 1,
    date: new Date(),
  },
  {
    account: "0xCF529119C86eFF8d139Ce8CFfaF5941DA94bae5b",
    amount: 1,
    cashBack: 1,
    balance: 1,
    date: new Date(),
  },
  {
    account: "0xCF529119C86eFF8d139Ce8CFfaF5941DA94bae5b",
    amount: 1,
    cashBack: 1,
    balance: 1,
    date: new Date(),
  },
];

export const D_securityListHeader = [
  "Date",
  "IP",
  "Device/OS",
  "Browser",
  "Country/Region",
];

export const D_securityList = [
  {
    date: new Date(),
    ip: "121.134.16.118",
    dev_os: "WebKit / Windows",
    browser: "Chrome",
    country: "South Korea",
    status: "Gangnam-gu",
  },
];

export const D_financeNavList = [
  {
    icon: I_financeWhite,
    key: "Finance",
    url: "data",
  },
  {
    icon: I_orders,
    key: "Orders",
    url: "orders",
  },
];
