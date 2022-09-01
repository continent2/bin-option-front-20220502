import { useEffect, useState } from "react";
import styled from "styled-components";
import I_dnPolWhite from "../../img/icon/I_dnPolWhite.svg";
import L_loader from "../../img/loader/L_loader.png";
import { useSelector } from "react-redux";
import DefaultHeader from "../../components/header/DefaultHeader";
import PopupBg from "../../components/common/PopupBg";
import { API, URL } from "../../configs/api";
import axios from "axios";
import SecurityVerifiPopup from "../../components/market/deposit/SecurityVerifiPopup";
import CashInPersonPopup from "../../components/market/deposit/CashInPersonPopup";
import ConfirmCny from "../../components/market/deposit/ConfirmCny";
import { reqTx, getabistr_forfunction } from "../../util/contractcall";
import TokenSelectPopup from "../../components/common/TokenSelectPopup";
import contractaddr from "../../configs/contractaddr";
import { setToast } from "../../util/Util";
import { metaMaskLink } from "../../configs/metaMask";
import PreDepositWarningPopup from "../../components/market/deposit/PreDepositWarningPopup";
import io from "socket.io-client";
import MinimumDepositPopup from "../../components/market/deposit/MinimumDepositPopup";
import {
  D_branchTokenList,
  D_paymentList,
  D_unBranchTokenList,
} from "../../data/D_market";
import { useTranslation } from "react-i18next";
import SelectPopup from "../../components/common/SelectPopup";
import ConfirmUsdt from "../../components/market/deposit/ConfirmUsdt";

export default function Deposit({ userData }) {
  const { t } = useTranslation();
  const walletAddress = localStorage.getItem("walletAddress");
  const isMobile = useSelector((state) => state.common.isMobile);

  const [isBranch, setIsBranch] = useState(false);
  const [amount, setAmount] = useState("");
  const [branchData, setBranchData] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [securityVerifiPopup, setSecurityVerifiPopup] = useState(false);
  const [cashInPersonPopup, setCashInPersonPopupPopup] = useState(false);
  const [tokenPopup, setTokenPopup] = useState(false);
  const [token, setToken] = useState(D_unBranchTokenList[0]);
  const [paymentPopup, setPaymentPopup] = useState(false);
  const [payment, setPayment] = useState(D_paymentList[0]);
  const [loader, setLoader] = useState("");
  const [preDepositWarningPopup, setPreDepositWarningPopup] = useState(false);
  const [minDepositPopup, setMinDepositPopup] = useState(false);
  const [enableMeta, setEnableMeta] = useState(true);

  function getPreDepositReq() {
    axios
      .get(API.USER_PREDEPOSIT)
      .then(({ data }) => {
        console.log(data);

        if (data.message === "NOT-FOUND") reqDeposit();
        else setPreDepositWarningPopup(true);
      })
      .catch((err) => console.error(err));
  }

  async function moDirectPayment() {
    setLoader("depositBtn");

    window.open(
      `${metaMaskLink}/${
        contractaddr[token.type]
      }/transfer?address=${walletAddress}&uint256=${amount}e6`
    );

    const socket = io(URL, {
      query: {
        token: localStorage.getItem("token"),
      },
    });

    socket.on("transactions", (res) => {
      console.log("transactions");
      console.log(res);

      if (res) {
        setToast({ type: "alarm", cont: "Submission Successful" });
        setTimeout(() => {
          window.location.reload(false);
        }, 3000);
      }
    });

    socket.emit("transactions", { type: token.type }, (res) => {
      console.log("emit");
      console.log(res);
    });
  }

  async function directPayment() {
    setLoader("depositBtn");
    let { ethereum } = window;

    let address = await ethereum.enable();

    let abistr = getabistr_forfunction({
      contractaddress: contractaddr[token.type],
      abikind: "ERC20",
      methodname: "transfer",
      aargs: [contractaddr["admin"], amount * 10 ** 6 + ""],
    });

    reqTx(
      {
        from: address[0],
        to: contractaddr[token.type],
        data: abistr,
        gas: 3000000,
      },
      (txHash) => {
        axios
          .patch(`${API.TRANS_DEPOSIT}/${amount}`, {
            tokentype: token.type,
            txhash: txHash,
            senderaddr: address[0],
          })
          .then((resp) => {
            if (resp) {
              //Success

              setToast({ type: "alarm", cont: "Submission Successful" });
              setTimeout(() => {
                window.location.reload(false);
              }, 3000);
            }
          })
          .catch((err) => {
            console.error(err);
          })
          .finally(() => setLoader());
      },
      setLoader
    );
  }

  function postLocale() {
    if (!branchData) return;

    axios
      .patch(`${API.TRANS_DEPOSIT}/${amount}`, {
        tokentype: token.type,
        ...branchData,
      })
      .then((_) => {
        //Posted

        setToast({ type: "alarm", cont: "Submission Successful" });
        setTimeout(() => {
          window.location.reload(false);
        }, 3000);
      });
  }

  function reqDeposit() {
    switch (isBranch) {
      case 0:
        if (isMobile) moDirectPayment();
        else directPayment();
        break;
      case 1:
        setSecurityVerifiPopup(true);
        break;
      case 2:
        if (payment === "wallet") {
          if (isMobile) moDirectPayment();
          else directPayment();
        } else if (payment === "address") {
          setConfirm(true);
        }
        break;
      default:
        break;
    }
  }

  function onClickDepositBtn() {
    if (amount < 5) setMinDepositPopup(true);
    else getPreDepositReq();
  }

  useEffect(() => {
    axios
      .get("https://options1.net:30718/queries/rows/infotokens")
      .then(({ data }) => console.log("res", data.respdata));
  }, []);

  useEffect(() => {
    if (!userData) return;

    let { isbranch } = userData;

    setIsBranch(isbranch);

    if (isbranch === 1) setToken(D_branchTokenList[0]);
  }, [userData]);

  useEffect(() => {
    if (!(window.ethereum || /Mobi|Android/i.test(navigator.userAgent))) {
      alert("Install Metamask");
      window.open(
        "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
      );
      setEnableMeta(false);
    }

    return () => io(URL).disconnect();
  }, []);

  if (isMobile)
    return (
      <>
        <DefaultHeader title="Deposit" />

        <MdepositBox>
          {confirm ? (
            <>
              {isBranch === 1 && (
                <ConfirmCny
                  setConfirm={setConfirm}
                  amount={amount}
                  token={token}
                  setOk={(e) => {
                    e && postLocale();
                  }}
                />
              )}
              {isBranch === 2 && <ConfirmUsdt amount={amount} token={token} />}
            </>
          ) : (
            <section className="innerBox ">
              <ul className="inputList">
                <li className="tokenBox">
                  <p className="key">{t("Asset")}</p>

                  <div className="selectBox">
                    <button
                      className={`${tokenPopup && "on"} selBtn`}
                      onClick={() => setTokenPopup(true)}
                    >
                      <img className="token" src={token.icon} alt="" />
                      <strong className="name">{token.text}</strong>

                      <img className="arw" src={I_dnPolWhite} />
                    </button>

                    {tokenPopup && (
                      <>
                        <TokenSelectPopup
                          off={setTokenPopup}
                          list={
                            isBranch === 1
                              ? D_branchTokenList
                              : D_unBranchTokenList
                          }
                          setCont={setToken}
                        />
                        <PopupBg off={setTokenPopup} index={3} />
                      </>
                    )}
                  </div>
                </li>

                <li className="amountBox">
                  <p className="key">{t("Amount")}</p>

                  <div className="valueBox">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder=""
                    />
                    <strong className="unit">{token.text}</strong>
                  </div>

                  <ul className="optList">
                    <button
                      className={`${amount === 100 && "on"} optBtn`}
                      onClick={() => setAmount(100)}
                    >
                      {isBranch === 1 ? token.unit : "$"}100
                    </button>
                    <button
                      className={`${amount === 200 && "on"} optBtn`}
                      onClick={() => setAmount(200)}
                    >
                      {isBranch === 1 ? token.unit : "$"}200
                    </button>
                    <button
                      className={`${amount === 300 && "on"} optBtn`}
                      onClick={() => setAmount(300)}
                    >
                      {isBranch === 1 ? token.unit : "$"}300
                    </button>
                    <button
                      className={`${amount === 400 && "on"} optBtn`}
                      onClick={() => setAmount(400)}
                    >
                      {isBranch === 1 ? token.unit : "$"}400
                    </button>
                  </ul>
                </li>
              </ul>

              <article className="depositArea">
                <ul className="infoList">
                  <li>
                    <p className="key">{t("Commission")}</p>
                    <p className="value">0%</p>
                  </li>
                  <li>
                    <p className="key">{t("Minimum deposit amount")}</p>
                    <p className="value">5 {token.text}</p>
                  </li>
                  <li>
                    <p className="key">{t("Max amount per transaction")}</p>
                    <p className="value">{t("no limits")}</p>
                  </li>
                </ul>

                <button
                  className={`${
                    loader === "depositBtn" && "loading"
                  } depositBtn`}
                  disabled={!amount}
                  onClick={onClickDepositBtn}
                >
                  <p className="common">{t("Deposit")}</p>
                  <img className="loader" src={L_loader} alt="" />
                </button>
              </article>
            </section>
          )}
        </MdepositBox>

        {securityVerifiPopup && (
          <>
            <SecurityVerifiPopup
              off={setSecurityVerifiPopup}
              setBalancePopup={setCashInPersonPopupPopup}
            />
            <PopupBg off={setSecurityVerifiPopup} />
          </>
        )}

        {cashInPersonPopup && (
          <>
            <CashInPersonPopup
              off={setCashInPersonPopupPopup}
              setConfirm={setConfirm}
              setData={setBranchData}
            />
            <PopupBg off={setCashInPersonPopupPopup} />
          </>
        )}

        {preDepositWarningPopup && (
          <>
            <PreDepositWarningPopup
              off={setPreDepositWarningPopup}
              reqDeposit={reqDeposit}
            />
            <PopupBg off={setPreDepositWarningPopup} />
          </>
        )}

        {minDepositPopup && (
          <>
            <MinimumDepositPopup off={setMinDepositPopup} />
            <PopupBg off={setMinDepositPopup} />
          </>
        )}
      </>
    );
  else
    return (
      <>
        <PdepositBox>
          <article className="deposit">
            <div className="key">
              <span className="count">1</span>

              <strong className="title">{t("Deposit")}</strong>
            </div>

            <div className="value">
              <ul className="inputList">
                <li className="tokenBox">
                  <p className="key">{t("Asset")}</p>

                  <div className="selectBox">
                    <button
                      className={`${tokenPopup && "on"} selBtn`}
                      onClick={() => setTokenPopup(true)}
                    >
                      <img className="token" src={token.icon} alt="" />
                      <strong className="name">{token.text}</strong>

                      <img className="arw" src={I_dnPolWhite} />
                    </button>

                    {tokenPopup && (
                      <>
                        <TokenSelectPopup
                          off={setTokenPopup}
                          list={
                            isBranch === 1
                              ? D_branchTokenList
                              : D_unBranchTokenList
                          }
                          setCont={setToken}
                        />
                        <PopupBg off={setTokenPopup} index={3} />
                      </>
                    )}
                  </div>
                </li>

                {isBranch === 2 && (
                  <li className="paymentBox">
                    <p className="key">{t("Payment")}</p>

                    <div className="selectBox">
                      <button
                        className={`${paymentPopup && "on"} selBtn`}
                        onClick={() => setPaymentPopup(true)}
                      >
                        <strong className="name">{payment}</strong>

                        <img className="arw" src={I_dnPolWhite} />
                      </button>

                      {paymentPopup && (
                        <>
                          <SelectPopup
                            off={setPaymentPopup}
                            list={D_paymentList}
                            setCont={setPayment}
                          />
                          <PopupBg off={setPaymentPopup} />
                        </>
                      )}
                    </div>
                  </li>
                )}

                <li className="amountBox">
                  <p className="key">{t("Amount")}</p>

                  <div className="valueBox">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder=""
                    />
                    <strong className="unit">{token.text}</strong>
                  </div>

                  <ul className="optList">
                    <button
                      className={`${amount === 100 && "on"} optBtn`}
                      onClick={() => setAmount(100)}
                    >
                      {isBranch === 1 ? token.unit : "$"}100
                    </button>
                    <button
                      className={`${amount === 200 && "on"} optBtn`}
                      onClick={() => setAmount(200)}
                    >
                      {isBranch === 1 ? token.unit : "$"}200
                    </button>
                    <button
                      className={`${amount === 300 && "on"} optBtn`}
                      onClick={() => setAmount(300)}
                    >
                      {isBranch === 1 ? token.unit : "$"}300
                    </button>
                    <button
                      className={`${amount === 400 && "on"} optBtn`}
                      onClick={() => setAmount(400)}
                    >
                      {isBranch === 1 ? token.unit : "$"}400
                    </button>
                  </ul>
                </li>
              </ul>

              <div className="depositBox">
                <ul className="infoList">
                  <li>
                    <p className="key">{t("Commission")}</p>
                    <p className="value">0%</p>
                  </li>
                  <li>
                    <p className="key">{t("Minimum deposit amount")}</p>
                    <p className="value">5 {token.text}</p>
                  </li>
                  <li>
                    <p className="key">{t("Max amount per transaction")}</p>
                    <p className="value">{t("no limits")}</p>
                  </li>
                </ul>

                <button
                  className={`${
                    loader === "depositBtn" && "loading"
                  } depositBtn`}
                  disabled={!(amount && enableMeta)}
                  onClick={onClickDepositBtn}
                >
                  <p className="common">{t("Deposit")}</p>
                  <img className="loader" src={L_loader} alt="" />
                </button>
              </div>
            </div>
          </article>

          <article className="detailArea">
            <div className="key">
              <span className="count">2</span>

              <strong className="title">{t("Confirm deposit details")}</strong>
            </div>

            {confirm ? (
              <>
                {isBranch === 1 && (
                  <ConfirmCny
                    setConfirm={setConfirm}
                    amount={amount}
                    token={token}
                    setOk={(e) => {
                      e && postLocale();
                    }}
                  />
                )}
                {isBranch === 2 && (
                  <ConfirmUsdt amount={amount} token={token} />
                )}
              </>
            ) : (
              <div className="value">
                <p className="head">{t("Important")} :</p>

                {isBranch ? (
                  <ul className="bodyList">
                    <li>
                      {t(
                        `Please make sure that only ${token.text} deposit is made via this address. Otherwise, your deposited funds will not be added to your available balance — nor will it be refunded.`
                      )}
                    </li>
                    <li>
                      {t(
                        'Please make sure to complete the payment within 15 minutes, and click on the "Payment Completed" button to confirm your payment. If you fail to click on the button within the timeout period, your order will be automatically canceled and your payment may not be retrievable.'
                      )}
                    </li>
                    <li>
                      {t(
                        "Please note that the current asset does not support deposit via the smart contract."
                      )}
                    </li>
                  </ul>
                ) : (
                  <ul className="bodyList">
                    <li>
                      {t(
                        "Attention! Please note that the address the system gave you for this payment is unique and can only be used once. Each payment needs to be initiated anew."
                      )}
                    </li>
                    <li>
                      {t(
                        "The funds will be credited as soon as we get 18 confirmations from the Polygon network."
                      )}
                    </li>
                    <li>
                      {t(
                        "Coin deposits are monitored according to our AML program."
                      )}
                    </li>
                  </ul>
                )}
              </div>
            )}
          </article>
        </PdepositBox>

        {securityVerifiPopup && (
          <>
            <SecurityVerifiPopup
              off={setSecurityVerifiPopup}
              setBalancePopup={setCashInPersonPopupPopup}
            />
            <PopupBg off={setSecurityVerifiPopup} />
          </>
        )}

        {cashInPersonPopup && (
          <>
            <CashInPersonPopup
              off={setCashInPersonPopupPopup}
              setConfirm={setConfirm}
              setData={setBranchData}
            />
            <PopupBg off={setCashInPersonPopupPopup} />
          </>
        )}

        {preDepositWarningPopup && (
          <>
            <PreDepositWarningPopup
              off={setPreDepositWarningPopup}
              reqDeposit={reqDeposit}
            />
            <PopupBg off={setPreDepositWarningPopup} />
          </>
        )}

        {minDepositPopup && (
          <>
            <MinimumDepositPopup off={setMinDepositPopup} />
            <PopupBg off={setMinDepositPopup} />
          </>
        )}
      </>
    );
}

const MdepositBox = styled.main`
  height: 100%;
  padding: 20px;

  .innerBox {
    display: flex;
    flex-direction: column;
    gap: 54px;
    height: 100%;
    overflow-y: scroll;

    .inputList {
      display: flex;
      flex-direction: column;
      gap: 14px;

      li {
        &.tokenBox {
          .selectBox {
            margin: 10px 0 0 0;
            background: rgba(255, 255, 255, 0.1);
            border: 1.4px solid rgba(0, 0, 0, 0);
            border-radius: 10px;
            position: relative;

            .selBtn {
              display: flex;
              align-items: center;
              gap: 8px;
              width: 100%;
              height: 50px;
              padding: 0 22px;
              font-size: 18px;
              font-weight: 700;

              &.on {
                .arw {
                  opacity: 1;
                  transform: rotate(180deg);
                }
              }

              .token {
                width: 30px;
                aspect-ratio: 1;
              }

              .name {
                text-align: start;
                flex: 1;
              }

              .arw {
                height: 8px;
                opacity: 0.4;
              }
            }
          }
        }

        &.amountBox {
          .optList {
            display: flex;
            gap: 10px;
            margin: 10px 0 0 0;
            font-size: 16px;
            overflow-x: scroll;

            .optBtn {
              flex: 1;
              height: 34px;
              background: rgba(255, 255, 255, 0.1);
              border-radius: 8px;
              color: rgba(255, 255, 255, 0.6);
              border: 1px solid rgba(255, 255, 255, 0.4);

              &.on {
                color: #fff;
                border: 1px solid #fff;
              }
            }
          }
        }

        .key {
          font-size: 14px;
        }

        .valueBox {
          display: flex;
          align-items: center;
          gap: 8px;
          height: 50px;
          padding: 0 22px;
          margin: 10px 0 0 0;
          font-size: 18px;
          font-weight: 700;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          border: 1.4px solid rgba(0, 0, 0, 0);
          cursor: pointer;
          position: relative;

          input {
            flex: 1;
            height: 100%;
          }

          &:focus-within {
            border-color: #f7ab1f;
          }
        }
      }
    }

    .depositArea {
      .infoList {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 12px 14px 14px;
        background: rgba(0, 0, 0, 0.6);

        li {
          display: flex;
          justify-content: space-between;
          font-size: 14px;

          .key {
            opacity: 0.6;
          }

          .value {
          }
        }
      }

      .depositBtn {
        width: 100%;
        height: 50px;
        font-size: 16px;
        font-weight: 700;
        color: #4e3200;
        background: linear-gradient(99.16deg, #604719 3.95%, #f7ab1f 52.09%);
        border-radius: 10px;

        &:disabled {
          color: #f7ab1f;
          background: #fff;
        }
      }
    }
  }
`;

const PdepositBox = styled.main`
  flex: 1;
  display: flex;
  gap: 100px;
  padding: 70px 140px;

  @media (max-width: 1440px) {
    max-width: 1020px;
    min-width: 1020px;
    padding: 70px 40px 70px 80px;
  }

  & > article {
    display: flex;
    flex-direction: column;
    gap: 40px;

    & > .key {
      display: flex;
      align-items: center;
      gap: 12px;

      .count {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 20px;
        height: 20px;
        font-size: 14px;
        color: #2a2a2a;
        border-radius: 50%;
        background: #f7ab1f;
      }

      .title {
        font-size: 24px;
      }
    }

    &.deposit {
      width: 454px;
      min-width: 392px;

      & > .value {
        display: flex;
        flex-direction: column;
        gap: 60px;

        .inputList {
          display: flex;
          flex-direction: column;
          gap: 20px;

          li {
            &.tokenBox {
              .selectBox {
                margin: 10px 0 0 0;
                position: relative;

                .selBtn {
                  display: flex;
                  align-items: center;
                  gap: 10px;
                  width: 100%;
                  height: 56px;
                  padding: 0 24px;
                  font-size: 20px;
                  font-weight: 700;
                  background: #22262e;
                  border-radius: 10px;
                  position: relative;
                  z-index: 5;

                  &.on {
                    .arw {
                      opacity: 1;
                      transform: rotate(180deg);
                    }
                  }

                  .token {
                    width: 38px;
                    aspect-ratio: 1;
                  }

                  .name {
                    text-align: start;
                    flex: 1;
                  }

                  .arw {
                    height: 8px;
                    opacity: 0.4;
                  }
                }
              }
            }

            &.paymentBox {
              .selectBox {
                margin: 10px 0 0 0;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                background: #22262e;
                position: relative;

                .selBtn {
                  display: flex;
                  align-items: center;
                  gap: 10px;
                  width: 100%;
                  height: 56px;
                  padding: 0 24px;
                  font-size: 20px;
                  font-weight: 700;
                  z-index: 5;

                  &.on {
                    .arw {
                      opacity: 1;
                      transform: rotate(180deg);
                    }
                  }

                  .name {
                    text-align: start;
                    flex: 1;
                  }

                  .arw {
                    height: 8px;
                    opacity: 0.4;
                  }
                }

                .selectPopup {
                  backdrop-filter: blur(20px);
                  -webkit-backdrop-filter: blur(20px);
                  top: unset;

                  li {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    gap: 10px;
                    height: 50px;
                    padding: 0 24px;
                    font-size: 18px;
                    font-weight: 700;
                    opacity: 0.4;
                    cursor: pointer;

                    &:hover {
                      opacity: 1;
                    }
                  }
                }
              }
            }

            &.amountBox {
              .optList {
                display: flex;
                gap: 12px;
                margin: 14px 0 0 0;
                font-size: 20px;
                overflow-x: scroll;

                .optBtn {
                  flex: 1;
                  height: 42px;
                  background: rgba(255, 255, 255, 0.1);
                  border-radius: 8px;
                  color: rgba(255, 255, 255, 0.6);
                  border: 1px solid rgba(255, 255, 255, 0.4);

                  &.on {
                    color: #fff;
                    border: 1px solid #fff;
                  }
                }
              }
            }

            .key {
              font-size: 16px;
            }

            .valueBox {
              display: flex;
              align-items: center;
              gap: 10px;
              height: 56px;
              padding: 0 24px;
              margin: 10px 0 0 0;
              font-size: 20px;
              font-weight: 700;
              background: rgba(255, 255, 255, 0.1);
              border-radius: 10px;
              border: 1.4px solid rgba(0, 0, 0, 0);
              cursor: pointer;
              position: relative;

              input {
                flex: 1;
                height: 100%;
              }

              &:focus-within {
                border-color: #f7ab1f;
              }
            }
          }
        }

        .depositBox {
          .infoList {
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 16px 18px 20px;
            background: rgba(0, 0, 0, 0.6);

            li {
              display: flex;
              justify-content: space-between;
              font-size: 16px;

              .key {
                opacity: 0.6;
              }

              .value {
              }
            }
          }

          .depositBtn {
            width: 100%;
            height: 56px;
            font-size: 18px;
            font-weight: 700;
            color: #4e3200;
            background: linear-gradient(
              99.16deg,
              #604719 3.95%,
              #f7ab1f 52.09%
            );
            border-radius: 10px;

            &:disabled {
              color: #f7ab1f;
              background: #fff;
            }
          }
        }
      }
    }

    &.detailArea {
      width: 472px;

      & > .value {
        height: 478px;
        padding: 40px 28px;
        background: rgba(255, 255, 255, 0.2);
        border: 2px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        box-shadow: inset 0px 3px 3px rgba(255, 255, 255, 0.4),
          0px 10px 40px rgba(255, 255, 255, 0.2);

        .head {
          font-size: 16px;
        }

        .bodyList {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin: 14px 0 0 0;

          li {
            margin: 0 0 0 20px;
            font-size: 14px;
            opacity: 0.4;
            list-style-type: disc;
          }
        }
      }
    }
  }
`;
