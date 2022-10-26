import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { API } from "../../../configs/api";
import I_alarmYellow from "../../../img/icon/I_alarmYellow.svg";
import I_xCircleYellow from "../../../img/icon/I_xCircleYellow.svg";
import PopupBg from "../../common/PopupBg";
import ConfirmationPopup from "./ConfirmationPopup";
import TimeOutPopup from "./TimeOutPopup";
import { CURRENCY_DEF, CURRENCY_DISP_DEF } from "../../../configs/setting";

export default function ConfirmCny({
  setConfirm,
  amount,
  token,
  setOk,
  asset,
}) {
  const { t } = useTranslation();
  const isMobile = useSelector((state) => state.common.isMobile);
  let time = 1800;

  const [limit, setLimit] = useState(time);
  const [confirmationPopup, setConfirmationPopup] = useState(false);
  const [rate, setRate] = useState(0);
  const [timeOutPopup, setTimeOutPopup] = useState(false);
  let [jforexrates, setjforexrates] = useState({});
  const LOGGER = console.log;
  const KEYS = Object.keys;
  const cleardisp = (_) => {
    //    set
  };
  const getforexrates = (_) => {
    axios
      .get(`${API.GET_QUERIES_FOREX}`)
      .then(({ data }) => {
        console.log(`@GET_QUERIES_FOREX`, data);
        let { list } = data;
        if (list) {
          setjforexrates(list);
        }
      })
      .catch((err) => {
        LOGGER(err);
      });
  };
  function getRate() {
    axios
      .get(`${API.QUERIES_FOREX}`, { params: { type: `${token.text}/USD` } })
      .then(({ data }) => {
        console.log("@QUERIES_FOREX", data);
        setRate(Number(data.price));
      })
      .catch((err) => console.error(err));
  }

  useEffect(
    (_) => {
      let rate;
      if (KEYS(jforexrates).length) {
      } else {
        return;
      }
      if ((rate = jforexrates[`${asset?.symbol}/USD`])) {
      } else {
        return;
      }
      setRate(rate);
    },
    [jforexrates]
  );
  useEffect(() => {
    getforexrates();
    //    getRate();
    let intervalId = setInterval(() => {
      time--;
      setLimit(time);
      if (time <= 0) {
        setTimeOutPopup(true);
        clearInterval(intervalId);
      }
    }, [1000]);

    return () => clearInterval(intervalId);
  }, []);

  if (isMobile)
    return (
      <>
        <MconfirmCnyBox className="value on">
          <div className="headArea">
            <strong className="head">
              {t("Complete Your Payment Within")} asdfasdfasdfweweafw
            </strong>

            {limit > 0 && (
              <div className="timerBox">
                <span className="hour">{Math.floor(limit / 60)}</span>:
                <span className="minute">
                  {`${limit % 60}`.padStart(2, "0")}
                </span>
              </div>
            )}
          </div>

          <div className="contArea">
            <div className="listCont">
              <div className="listBox">
                <strong className="title">{t("Order Info")}</strong>

                <ul>
                  <li>
                    <p className="key">{t("Pay")}</p>
                    <p className="value">
                      {amount} {asset?.symbol}
                    </p>
                  </li>

                  <li>
                    <p className="key">{t("Receive")}</p>
                    <p className="value">
                      {(amount * rate).toFixed(4)} {CURRENCY_DEF}
                    </p>
                  </li>
                </ul>
              </div>

              <div className="listBox">
                <strong className="title">{t("Bank details")}</strong>

                {limit > 0 ? (
                  <ul>
                    <li>
                      <p className="key">{t("Bank Name")}</p>
                      <p className="value">{asset?.bankname}</p>
                    </li>

                    <li>
                      <p className="key">{t("Bank Account")}</p>
                      <p className="value">{asset?.account}</p>
                    </li>

                    <li>
                      <p className="key">{t("Bank Account Owner")}</p>
                      <p className="value">{asset?.owner}</p>
                    </li>
                  </ul>
                ) : (
                  <p className="cancel">{t("Your order has been canceled.")}</p>
                )}
              </div>
            </div>

            {limit > 0 ? (
              <div className="confirmBox">
                <div className="explain">
                  <img src={I_alarmYellow} alt="" />

                  <p>
                    {t(
                      `Please complete the payment within ${
                        time / 60
                      } minute(s). The coins you've bought will be credited to your Funding Account.`
                    )}
                  </p>
                </div>

                <button
                  className="confirmBtn"
                  onClick={() => setConfirmationPopup(true)}
                >
                  {t("Confirm")}
                </button>
              </div>
            ) : (
              <div className="canceledBox">
                <button className="cancelBtn" onClick={() => setConfirm(false)}>
                  <img src={I_xCircleYellow} alt="" />
                </button>

                <p>
                  {t(
                    "Unable to retrieve the payment method! The order has already been canceled."
                  )}
                </p>
              </div>
            )}
          </div>
        </MconfirmCnyBox>

        {confirmationPopup && (
          <>
            <ConfirmationPopup
              off={() => {
                setConfirmationPopup();
                setOk(true);
              }}
              amount={amount}
              asset={asset}
              cleardisp={(_) => {
                cleardisp();
              }}
            />
            <PopupBg off={setConfirmationPopup} />
          </>
        )}

        {timeOutPopup && (
          <>
            <TimeOutPopup off={setTimeOutPopup} />
            <PopupBg off={setTimeOutPopup} />
          </>
        )}
      </>
    );
  else
    return (
      <>
        <PconfirmCnyBox className="value on">
          <div className="headArea">
            <strong className="head">
              {t("Complete Your Payment Within")}
            </strong>

            {limit > 0 && (
              <div className="timerBox">
                <span className="hour">{Math.floor(limit / 60)}</span>:
                <span className="minute">
                  {`${limit % 60}`.padStart(2, "0")}
                </span>
              </div>
            )}
          </div>

          <div className="contArea">
            <div className="listCont">
              <div className="listBox">
                <strong className="title">{t("Order Info")}</strong>

                <ul>
                  <li>
                    <p className="key">{t("Pay")}</p>
                    <p className="value">
                      {amount} {asset?.symbol}
                    </p>
                  </li>

                  <li>
                    <p className="key">{t("Receive")}</p>
                    {/* <p className="value">{(amount * rate).toFixed(4)} USDT</p> */}
                    <p className="value">
                      {(amount * rate).toFixed(4)} {CURRENCY_DEF}
                    </p>
                  </li>
                </ul>
              </div>

              <div className="listBox">
                <strong className="title">{t("Bank details")}</strong>

                {limit > 0 ? (
                  <ul>
                    <li>
                      <p className="key">{t("Bank Name")}</p>
                      {/* <p className="value">CLJUGB21</p> */}
                      <p className="value">{asset?.bankname}</p>
                    </li>

                    <li>
                      <p className="key">{t("Bank Account")}</p>
                      <p className="value">{asset?.account}</p>
                    </li>

                    <li>
                      <p className="key">{t("Bank Account Owner")}</p>
                      <p className="value">{asset?.owner}</p>
                    </li>
                  </ul>
                ) : (
                  <p className="cancel">{t("Your order has been canceled.")}</p>
                )}
              </div>
            </div>

            {limit > 0 ? (
              <div className="confirmBox">
                <div className="explain">
                  <img src={I_alarmYellow} alt="" />

                  <p>
                    {t(
                      `Please complete the payment within ${
                        time / 60
                      } minute(s). The coins you've bought will be credited to your Funding Account.`
                    )}
                  </p>
                </div>

                <button
                  className="confirmBtn"
                  onClick={() => setConfirmationPopup(true)}
                >
                  {t("Confirm")}
                </button>
              </div>
            ) : (
              <div className="canceledBox">
                <button className="cancelBtn" onClick={() => setConfirm(false)}>
                  <img src={I_xCircleYellow} alt="" />
                </button>

                <p>
                  {t(
                    "Unable to retrieve the payment method! The order has already been canceled."
                  )}
                </p>
              </div>
            )}
          </div>
        </PconfirmCnyBox>

        {confirmationPopup && (
          <>
            <ConfirmationPopup
              off={() => {
                setConfirmationPopup();
                setOk(true);
              }}
              amount={amount}
              asset={asset}
              cleardisp={(_) => {
                cleardisp();
              }}
            />
            <PopupBg off={setConfirmationPopup} />
          </>
        )}

        {timeOutPopup && (
          <>
            <TimeOutPopup off={setTimeOutPopup} />
            <PopupBg off={setTimeOutPopup} />
          </>
        )}
      </>
    );
}

const MconfirmCnyBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  overflow-y: scroll;

  .headArea {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 16px;

    .timerBox {
      display: flex;
      align-items: center;
      gap: 3px;

      span {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 24px;
        aspect-ratio: 1;
        font-size: 14px;
        font-weight: 700;
        color: #000;
        background: #fff;
        border-radius: 2px;
      }
    }
  }

  .contArea {
    display: flex;
    flex-direction: column;
    gap: 18px;

    .listCont {
      display: flex;
      flex-direction: column;

      .listBox {
        display: flex;
        flex-direction: column;
        gap: 14px;
        font-size: 14px;

        &:nth-of-type(1) {
          padding: 0 0 14px;
        }

        &:nth-of-type(2) {
          padding: 14px 0 0;
          border-top: 1px solid rgba(255, 255, 255, 0.14);
        }

        .title {
        }

        ul {
          display: flex;
          flex-direction: column;
          gap: 4px;

          li {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .key {
              opacity: 0.6;
            }

            .value {
            }
          }
        }

        .cancel {
          opacity: 0.6;
        }
      }
    }

    .confirmBox {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;

      .explain {
        display: flex;
        align-items: flex-start;
        gap: 6px;
        font-size: 14px;
        line-height: 18px;
        color: #f7ab1f;

        img {
          height: 14px;
          margin: 2px 0;
          aspect-ratio: 1;
        }
      }

      .confirmBtn {
        width: 100%;
        height: 50px;
        font-size: 18px;
        font-weight: 700;
        color: #f7ab1f;
        border: 2px solid #f7ab1f;
        border-radius: 10px;
      }
    }

    .canceledBox {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;

      .cancelBtn {
        display: flex;
        align-items: center;

        img {
          width: 30px;
          aspect-ratio: 1;
        }
      }

      p {
        font-size: 14px;
        color: #f7ab1f;
        text-align: center;
      }
    }
  }
`;

const PconfirmCnyBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 38px;

  .headArea {
    display: flex;
    align-items: center;
    gap: 10px;

    .timerBox {
      display: flex;
      align-items: center;
      gap: 3px;

      span {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 24px;
        aspect-ratio: 1;
        font-size: 14px;
        font-weight: 700;
        color: #000;
        background: #fff;
        border-radius: 2px;
      }
    }
  }

  .contArea {
    display: flex;
    flex-direction: column;
    gap: 44px;

    .listCont {
      display: flex;
      flex-direction: column;
      gap: 20px;

      .listBox {
        display: flex;
        flex-direction: column;
        gap: 14px;
        font-size: 14px;

        .title {
        }

        ul {
          display: flex;
          flex-direction: column;
          gap: 4px;

          li {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .key {
              opacity: 0.6;
            }

            .value {
            }
          }
        }

        .cancel {
          opacity: 0.6;
        }
      }
    }

    .confirmBox {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;

      .explain {
        display: flex;
        align-items: flex-start;
        gap: 6px;
        font-size: 14px;
        line-height: 18px;
        color: #f7ab1f;

        img {
          height: 14px;
          margin: 2px 0;
          aspect-ratio: 1;
        }
      }

      .confirmBtn {
        width: 200px;
        height: 50px;
        font-size: 18px;
        font-weight: 700;
        color: #f7ab1f;
        border: 2px solid #f7ab1f;
        border-radius: 10px;
      }
    }

    .canceledBox {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;

      .cancelBtn {
        display: flex;
        align-items: center;

        img {
          width: 30px;
          aspect-ratio: 1;
        }
      }

      p {
        font-size: 14px;
        color: #f7ab1f;
        text-align: center;
      }
    }
  }
`;
