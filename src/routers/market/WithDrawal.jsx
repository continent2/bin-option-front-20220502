import axios from "axios";
import { useState } from "react";
import styled from "styled-components";
import { API } from "../../configs/api";
import L_loader from "../../img/loader/L_loader.png";
import I_alarmYellow from "../../img/icon/I_alarmYellow.svg";
import T_usdt from "../../img/token/T_usdt.png";
import TokenSelectPopup from "../../components/common/TokenSelectPopup";
import { setToast, strDot } from "../../util/Util";
import I_dnPolWhite from "../../img/icon/I_dnPolWhite.svg";
import PopupBg from "../../components/common/PopupBg";
import { useSelector } from "react-redux";
import DefaultHeader from "../../components/header/DefaultHeader";
import { useNavigate } from "react-router-dom";
import MinimumWithdrawalPopup from "../../components/market/withdrawal/MinimumWithdrawalPopup";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import ConfirmPopup from "../../components/market/withdrawal/ConfirmPopup";
import { nettype } from "../../configs/nettype";

export default function WithDrawal() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useSelector((state) => state.common.isMobile);

  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [tokenPopup, setTokenPopup] = useState(false);
  const [settings, setSettings] = useState({
    commision: 1,
    minWithdraw: 5,
    maxTransactions: -1,
  });
  const [token, setToken] = useState({
    icon: T_usdt,
    type: "USDT_BINOPT",
    text: "USDT",
  });
  const [tokenList, setTokenList] = useState([
    { icon: T_usdt, type: "USDT_BINOPT", text: "USDT" },
  ]);
  const [process, setProcess] = useState(false);
  const [loader, setLoader] = useState("");
  const [minWithdrawalPopup, setMinWithdrawalPopup] = useState(false);
  const [validAddress, setValidAddress] = useState(false);
  const [confirmPopup, setConfirmPopup] = useState(false);
  const [commission, setCommission] = useState(1);
  const [minimumAmount, setMinimumAmount] = useState(5);
  const [amountErrorMessage, setAmountErrorMessage] = useState("");
  const [asset, setAsset] = useState({});
  const [ethAmount, setEthAmount] = useState("");
  const [chargeError, SetChargeError] = useState(false);
  const [ethCount, setEthCount] = useState(0);
  const [assetList, setAssetList] = useState([]);
  const [networkname, setNetworkName] = useState("");
  const [logonetwork, setLogonetwork] = useState("");

  const onChangeAmount = (val) => {
    if (val > 500000) {
      setAmount(val);
      setAmountErrorMessage("The maximum amount is 500,000.");
      return;
    } else {
      setAmountErrorMessage("");
    }

    if (val >= 500) {
      setAmount(val);
      setSettings((prev) => {
        return { ...prev, commision: 10 };
      });
    } else {
      setAmount(val);
      setSettings((prev) => {
        return { ...prev, commision: 1 };
      });
    }
  };

  async function onClickConfirmBtn() {
    if (amount < 5) {
      setMinWithdrawalPopup(true);
      return;
    }

    setLoader("drawalBtn");
    setProcess(true);
    const jtoken = localStorage.getItem("token");

    if (jtoken) {
      axios
        .patch(API.TRANS_WITHDRAW(amount), {
          rxaddr: address,
          tokentype: token.type,
        })
        .then(async ({ data }) => {
          console.log(data.payload.resp);
          if (data.payload.resp.status == "OK") {
            if (data.payload.resp.message) {
              //Transaction Success
              setToast({ type: "alarm", cont: "Submission Successful" });
              setProcess(true);
              // setTimeout(() => {
              //   window.location.reload(false);
              // }, 3000);
            }
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoader());
    } else setLoader();
  }

  const getReceiveDepost = () => {
    console.log("안녕");
    try {
      axios
        .get(`${API.GET_RECEIVE_DEPOSIT_ASSET}?nettype=${nettype}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })
        .then(({ data }) => {
          console.log(data);

          const asset = data.respdata.listtokens.filter((v, i) => {
            return v.nettype === nettype;
          });
          console.log(asset);
          setNetworkName(asset[0].networkname);
          setLogonetwork(asset[0].logonetwork);
          axios
            .get(`${API.GET_RECEIVE_AGENTS}`, {
              headers: {
                Authorization: localStorage.getItem("token"),
              },
            })
            .then(({ data }) => {
              console.log(data);
              console.log(data.list);
              setAsset(asset[0]);
              if (data.list) {
                setAssetList((prev) => [...prev, asset[0], ...data?.list]);
              } else {
                if (assetList.length === 1) {
                  return;
                } else {
                  setAssetList((prev) => [...prev, asset[0]]);
                }
              }
            });
        });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getReceiveDepost();
  }, []);

  useEffect(() => {
    try {
      axios.get(API.GET_FEE_RANGE).then(({ data }) => {
        console.log(data);
        setSettings({
          commision: data.respdata.feeamount,
          minWithdraw: data.respdata.minimumamount,
          maxTransactions: -1,
        });
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    const re = /^(0x)[0-9A-Fa-f]{40}$/;
    setValidAddress(re.test(address));
  }, [address]);

  // useEffect(() => {
  //   try {
  //     axios.get(API.GET_WITHDRAW_FEE).then(({ data }) => {
  //       console.log(data);
  //       setSettings({
  //         commision: data.respdata.feeamount,
  //         minDeposit: data.respdata.minimumamount,
  //         maxTransactions: -1,
  //       });
  //     });
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }, []);

  if (isMobile)
    return (
      <>
        <DefaultHeader title="Withdrawal" />

        <MwithDrawalBox amountError={amountErrorMessage}>
          <section className="innerBox">
            {process ? (
              <article className="onProcess">
                <div className="titleBox">
                  <strong className="key">{t("You will get")}</strong>
                  <strong className="value">
                    {amount} {token.text}
                  </strong>
                </div>

                <ul className="infoList">
                  <li>
                    <p className="key">{t("Withdrawal to")}</p>
                    <strong className="value">{strDot(address, 5, 4)}</strong>
                  </li>

                  <li>
                    <p className="key">{t("Fee")}</p>
                    <strong className="value">0 {token.text}</strong>
                  </li>

                  <li>
                    <p className="key">{t("Withdrawal Amount")}</p>
                    <strong className="value">
                      {amount} {token.text}
                    </strong>
                  </li>

                  <li>
                    <p className="key">{t("Funds will arrive")}</p>
                    <strong className="value">{t("Within 30 mins")}</strong>
                  </li>
                </ul>

                <div className="explainBox">
                  <p className="explain">
                    {t(
                      "Transfer usually take under 30minutes. Depends on the speed of your transaction. a delay may occur."
                    )}
                  </p>

                  <button
                    className="viewBtn"
                    onClick={() => navigate("/market/history")}
                  >
                    {t("View history")}
                  </button>
                </div>
              </article>
            ) : (
              <article className="unProcess">
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
                            list={tokenList}
                            setCont={setToken}
                          />
                          <PopupBg off={setTokenPopup} />
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
                        // onChange={(e) => setAmount(e.target.value)}
                        onChange={(e) => onChangeAmount(e.target.value)}
                        placeholder=""
                      />
                      <strong className="unit">{asset.symbol}</strong>
                    </div>
                  </li>
                  <p className="errorText">{amountErrorMessage}</p>

                  <li className="addressBox">
                    <p className="key">{t("Withdrawal address")}</p>

                    <div className="valueBox">
                      <input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder=""
                      />
                    </div>
                  </li>
                </ul>

                <div className="drawalBox">
                  <ul className="infoList">
                    <li>
                      <p className="key">{t("Commission")}</p>
                      <p className="value">{settings.commision} Tether</p>
                    </li>
                    <li>
                      <p className="key">{t("Minimum withdraw amount")}</p>
                      <p className="value">
                        {settings.minWithdraw} {asset.symbol}
                      </p>
                    </li>
                    <li>
                      <p className="key">{t("Max amount per transaction")}</p>
                      <p className="value">
                        {settings.maxTransactions == -1
                          ? "no limits"
                          : settings.maxTransactions}
                      </p>
                    </li>
                  </ul>

                  <button
                    className={`${
                      loader === "drawalBtn" && "loading"
                    } drawalBtn`}
                    disabled={
                      !(
                        amount &&
                        address &&
                        validAddress &&
                        !amountErrorMessage
                      )
                    }
                    onClick={() => setConfirmPopup(true)}
                  >
                    <p className="common">{t("Withdrawal")}</p>
                    <img className="loader" src={L_loader} alt="" />
                  </button>
                </div>
              </article>
            )}
          </section>
        </MwithDrawalBox>

        {minWithdrawalPopup && (
          <>
            <MinimumWithdrawalPopup off={setMinWithdrawalPopup} />
            <PopupBg bg off={setMinWithdrawalPopup} />
          </>
        )}

        {confirmPopup && (
          <>
            <ConfirmPopup
              confirmFunc={onClickConfirmBtn}
              off={setConfirmPopup}
              amount={amount}
              unit={token.text}
            />
            <PopupBg bg off={setConfirmPopup} />
          </>
        )}
      </>
    );
  else
    return (
      <>
        <PwithDrawalBox amountError={amountErrorMessage}>
          <article className="contArea">
            <div className="key">
              <span className="count">1</span>

              <strong className="title">{t("Withdraw")}</strong>
              {asset && (
                <div className="mainet">
                  {networkname && <span className="key">{networkname}</span>}

                  {logonetwork && (
                    <div className="mainetLogoCont">
                      <img src={logonetwork} alt="" />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="value">
              <ul className="inputList">
                <li className="tokenBox">
                  <p className="key">{t("Asset")}</p>

                  <div className="selectBox">
                    {/* <button
                      className={`${tokenPopup && "on"} selBtn`}
                      onClick={() => setTokenPopup(true)}
                    >
                      <img className="token" src={token.icon} alt="" />
                      <strong className="name">{token.text}</strong>

                      <img className="arw" src={I_dnPolWhite} />
                    </button> */}

                    <button
                      className={`${tokenPopup && "on"} selBtn`}
                      onClick={() => setTokenPopup(true)}
                    >
                      <img className="token" src={asset.logourl} alt="" />
                      <strong className="name">{asset.symbol}</strong>

                      <img className="arw" src={I_dnPolWhite} />
                    </button>

                    {tokenPopup && (
                      <>
                        {/* <TokenSelectPopup
                          off={setTokenPopup}
                          list={tokenList}
                          setCont={setToken}
                        /> */}
                        <TokenSelectPopup
                          off={setTokenPopup}
                          list={
                            assetList
                            // isBranch === 1
                            //   ? D_branchTokenList
                            //   : D_unBranchTokenList
                          }
                          asset={asset}
                          setCont={setToken}
                          setAsset={setAsset}
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
                      // onChange={(e) => setAmount(e.target.value)}
                      onChange={(e) => onChangeAmount(e.target.value)}
                      placeholder=""
                    />
                    <strong className="unit">{asset.symbol}</strong>
                  </div>
                </li>
                <p className="errorText">{amountErrorMessage}</p>
                <li className="addressBox">
                  <p className="key">{t("Withdrawal address")}</p>

                  <div className="valueBox">
                    <input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder=""
                    />
                  </div>
                </li>
              </ul>

              <div className="drawalBox">
                <ul className="infoList">
                  <li>
                    <p className="key">{t("Commission")}</p>
                    <p className="value">{settings.commision} Tether</p>
                  </li>
                  <li>
                    <p className="key">{t("Minimum withdraw amount")}</p>
                    <p className="value">
                      {settings.minWithdraw} {asset.symbol}
                    </p>
                  </li>
                  <li>
                    <p className="key">{t("Max amount per transaction")}</p>
                    <p className="value">
                      {settings.maxTransactions == -1
                        ? "no limits"
                        : settings.maxTransactions}
                    </p>
                  </li>
                </ul>

                <button
                  className={`${loader === "drawalBtn" && "loading"} drawalBtn`}
                  disabled={
                    !(amount && address && validAddress && !amountErrorMessage)
                  }
                  onClick={() => setConfirmPopup(true)}
                >
                  <p className="common">{t("Withdrawal")}</p>
                  <img className="loader" src={L_loader} alt="" />
                </button>
              </div>
            </div>
          </article>

          <article className="detailArea">
            <div className="key">
              <span className="count">2</span>

              <strong className="title">{t("Withdrawal Confrimation")}</strong>
            </div>

            {process ? (
              <div className={`onProcess value`}>
                <div className="titleBox">
                  <strong className="key">{t("You will get")}</strong>
                  <strong className="value">
                    {amount} {token.text}
                  </strong>
                </div>

                <ul className="infoList">
                  <li>
                    <p className="key">{t("Withdrawal to")}</p>
                    <strong className="value">{strDot(address, 5, 4)}</strong>
                  </li>

                  <li>
                    <p className="key">{t("Fee")}</p>
                    <strong className="value">0 {token.text}</strong>
                  </li>

                  <li>
                    <p className="key">{t("Withdrawal Amount")}</p>
                    <strong className="value">
                      {amount} {token.text}
                    </strong>
                  </li>

                  <li>
                    <p className="key">{t("Funds will arrive")}</p>
                    <strong className="value">{t("Within 30 mins")}</strong>
                  </li>
                </ul>

                <div className="explainBox">
                  <img src={I_alarmYellow} alt="" />

                  <p>
                    {t(
                      "Transfer usually take under 30minutes. Depends on the speed of your transaction. a delay may occur."
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <div className={`unProcess value`}>
                <p className="head">{t("Important")} :</p>

                <ul className="bodyList">
                  <li>
                    {t(
                      "Attention! Please note that the address the system gave you for this payment is unique and can only be used once. Each payment needs to be initiated anew."
                    )}
                  </li>
                  <li>
                    {t(
                      `The funds will be credited as soon as we get 18 confirmations from the ${networkname} network.`
                    )}
                  </li>
                  <li>
                    {t(
                      "Coin deposits are monitored according to our AML program."
                    )}
                  </li>
                </ul>
              </div>
            )}
          </article>
        </PwithDrawalBox>

        {minWithdrawalPopup && (
          <>
            <MinimumWithdrawalPopup off={setMinWithdrawalPopup} />
            <PopupBg bg off={setMinWithdrawalPopup} />
          </>
        )}

        {confirmPopup && (
          <>
            <ConfirmPopup
              confirmFunc={onClickConfirmBtn}
              off={setConfirmPopup}
              amount={amount}
              unit={token.text}
            />
            <PopupBg bg off={setConfirmPopup} />
          </>
        )}
      </>
    );
}

const MwithDrawalBox = styled.main`
  padding: 20px;
  height: 100%;

  .errorText {
    display: ${(props) => (props.amountError ? "block" : "none")};
    color: red;
  }
  .innerBox {
    height: 100%;
    overflow-y: scroll;

    .onProcess {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 14px 0 0;

      .titleBox {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;

        .key {
          font-size: 16px;
        }

        .value {
          font-size: 26px;
        }
      }

      .infoList {
        display: flex;
        flex-direction: column;
        gap: 6px;
        width: 100%;
        padding: 20px;
        margin: 20px 0 0;
        font-size: 14px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 10px;

        li {
          display: flex;
          justify-content: space-between;

          .key {
            opacity: 0.6;
          }
        }
      }

      .explainBox {
        display: flex;
        flex-direction: column;
        gap: 20px;
        margin: 40px 0 0;
        color: #f7ab1f;

        .explain {
          padding: 0 24px;
          font-size: 14px;
          text-align: center;
        }

        .viewBtn {
          height: 50px;
          font-size: 16px;
          border: 2px solid rgba(247, 171, 31, 0.8);
          border-radius: 10px;
        }
      }
    }

    .unProcess {
      display: flex;
      flex-direction: column;
      gap: 54px;

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

      .drawalBox {
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

        .drawalBtn {
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
  }
`;

const PwithDrawalBox = styled.main`
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 100px;
  padding: 70px 140px;

  .errorText {
    display: ${(props) => (props.amountError ? "block" : "none")};
    color: red;
  }

  @media (max-width: 1440px) {
    max-width: 1020px;
    min-width: 1020px;
    padding: 70px 40px 70px 80px;
  }

  article {
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

    &.contArea {
      width: 454px;
      min-width: 392px;

      .mainet {
        display: flex;
        align-items: flex-end;
        margin-left: auto;
        .key {
          margin-right: 9px;
        }

        .mainetLogoCont {
          width: 20px;
          height: 20px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }

      & > .value {
        display: flex;
        flex-direction: column;
        gap: 40px;

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
                  z-index: 7;

                  &.on {
                    .arw {
                      opacity: 1;
                      transform: rotate(180deg);
                    }
                  }

                  .token {
                    width: 38px;
                    aspect-ratio: 1;
                    filter: drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.4));
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
            }

            &.addressBox {
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
              background: #22262e;
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

        .drawalBox {
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

          .drawalBtn {
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
        height: 510px;
        padding: 70px 34px 0;
        background: rgba(255, 255, 255, 0.2);
        border: 2px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        box-shadow: inset 0px 3px 3px rgba(255, 255, 255, 0.4),
          0px 10px 40px rgba(255, 255, 255, 0.2);

        &.onProcess {
          display: flex;
          flex-direction: column;
          align-items: center;

          .titleBox {
            display: flex;
            flex-direction: column;
            gap: 8px;
            text-align: center;

            .key {
              font-size: 16px;
              opacity: 0.6;
            }

            .value {
              font-size: 26px;
            }
          }

          .infoList {
            display: flex;
            flex-direction: column;
            gap: 6px;
            width: 100%;
            padding: 22px 20px 24px;
            margin: 34px 0 0;
            font-size: 14px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 10px;

            li {
              display: flex;
              justify-content: space-between;
              align-items: center;

              .key {
                opacity: 0.6;
              }
            }
          }

          .explainBox {
            display: flex;
            gap: 6px;
            margin: 44px 0 0;
            font-size: 14px;
            line-height: 18px;
            color: #f7ab1f;

            img {
              margin: 2px 0;
              height: 14px;
            }
          }
        }

        &.unProcess {
          padding: 40px 28px;

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
  }
`;
