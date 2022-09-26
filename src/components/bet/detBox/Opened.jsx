import moment from "moment";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import I_highArwGreen from "../../../img/icon/I_highArwGreen.svg";
import I_lowArwRed from "../../../img/icon/I_lowArwRed.svg";
import { setOpenedData } from "../../../reducers/bet";

export default function Opened({ page, socket }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isMobile = useSelector((state) => state.common.isMobile);
  const openedData = useSelector((state) => state.bet.openedData);

  const [now, setNow] = useState(new Date());

  function getIcon(type) {
    switch (type) {
      case "HIGH":
        return I_highArwGreen;
      case "LOW":
        return I_lowArwRed;
      default:
        break;
    }
  }

  function getPreResult(v) {
    switch (Math.sign(+v.winamount)) {
      case +1:
        return "plus";
        break;
      case -1:
        return "minus";
        break;
      default:
        return "plus";
    }
  }

  function getForcast(type) {
    switch (type) {
      case "HIGH":
        return "Higher";
      case "LOW":
        return "Lower";
      default:
        break;
    }
  }

  useEffect(() => {
    let timeInterval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  if (isMobile)
    return (
      <MopenedBox className="detContList">
        {openedData &&
          openedData
            .filter((v) => v.type === page.toUpperCase())
            .map((v, i) => (
              <Fragment key={i}>
                {v.expiry > now.getTime() / 1000 && (
                  <li key={i}>
                    <details>
                      <summary>
                        <div className="contBox">
                          <p className="token">{v.asset.name}</p>

                          <p className="price">
                            {Math.floor(v.startingPrice * 100) / 100}
                          </p>

                          <p className="percent">{`${v.diffRate || 0}%`}</p>
                        </div>

                        <div className="contBox">
                          <span className="forecast">
                            <img src={getIcon(v.side)} alt="" />
                            <p>{`$${(v.amount / 10 ** 6).toFixed(2)}`}</p>
                          </span>

                          <p className={`${getPreResult(v)} benefit`}>
                            {v?.winamount
                              ? (v?.winamount / 10 ** 6).toFixed(2)
                              : ""}
                          </p>

                          <p className="time">
                            {`${
                              moment.unix(v.expiry).diff(now, "hours")
                                ? `${moment.unix(v.expiry).diff(now, "hours")}:`
                                : ""
                            }${`${Math.floor(
                              moment.unix(v.expiry).diff(now, "minutes") % 60
                            )}`.padStart(2, "0")}:${`${
                              moment.unix(v.expiry).diff(now, "seconds") % 60
                            }`.padStart(2, "0")}`}
                          </p>
                        </div>
                      </summary>

                      <div className="openBox">
                        <div className="timeBox">
                          <ul className="timeList">
                            <li>
                              <p className="key">{t("Open time")}</p>
                              <p className="value">
                                {moment.unix(v.starting).format("hh:mm:ss")}
                              </p>
                            </li>

                            <li>
                              <p>
                                {t("M")}
                                {moment(
                                  moment
                                    .unix(v.expiry)
                                    .diff(moment.unix(v.starting))
                                ).format("m")}
                              </p>
                            </li>

                            <li>
                              <p className="key">{t("Closing Time")}</p>
                              <p className="value">
                                {moment.unix(v.expiry).format("hh:mm:ss")}
                              </p>
                            </li>
                          </ul>

                          <div className="barBox">
                            <div className="bar">
                              <div />
                            </div>

                            <p className="left">{`${t("Time left")} : ${moment(
                              moment.unix(v.expiry).diff(now)
                            ).format("mm:ss")}`}</p>
                          </div>
                        </div>

                        <div className="resBox">
                          <div className="detResBox">
                            <ul className="forcastList">
                              <li>
                                <p className="key">{t("Your forecast")}</p>
                                <p className="value">{getForcast(v.side)}</p>
                              </li>
                              <li>
                                <p className="key">{t("Payout")}</p>
                                <p className="value">{`$${
                                  v.amount && (v.amount / 10 ** 6).toFixed(2)
                                }`}</p>
                              </li>
                              <li>
                                <p className="key">{t("Profit")}</p>
                                <p className="value">{`$${(
                                  (v.amount * v.diffRate) /
                                  10 ** 8
                                ).toFixed(2)}`}</p>
                              </li>
                            </ul>

                            <ul className="priceList">
                              <li>
                                <p className="key">{t("Open price")}</p>

                                <p className="value">
                                  {v.startingPrice
                                    ? Number(v.startingPrice).toFixed(2)
                                    : "-"}
                                </p>
                              </li>
                              <li>
                                <p className="key">{t("Current price")}</p>

                                <p className="value">
                                  {v.currentPrice
                                    ? Number(v.currentPrice).toFixed(2)
                                    : "-"}
                                </p>
                              </li>
                              <li>
                                <p className="key">{t("Difference")}</p>

                                <p
                                  className={`${
                                    (v.currentPrice - v.startingPrice > 0 &&
                                      "plus") ||
                                    (v.currentPrice - v.startingPrice < 0 &&
                                      "minus")
                                  } value point`}
                                >{`${Number(
                                  v.currentPrice - v.startingPrice
                                ).toFixed(2)} ${t("points")}`}</p>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </details>
                  </li>
                )}
              </Fragment>
            ))}
      </MopenedBox>
    );
  else
    return (
      <PopenedBox className="detContList">
        {openedData &&
          openedData
            .filter((v) => v.type === page.toUpperCase())
            .map((v, i) => (
              <Fragment key={i}>
                {v.expiry > now.getTime() / 1000 && (
                  <li>
                    <details>
                      <summary>
                        <div className="contBox">
                          <p className="token">{v?.asset?.name}</p>

                          <p className="price">
                            {Math.floor(v.startingPrice * 100) / 100}
                          </p>

                          <p className="percent">{`${v.diffRate || 0}%`}</p>
                        </div>

                        <div className="contBox">
                          <span className="forecast">
                            <img src={getIcon(v.side)} alt="" />
                            <p>{`$${(v.amount / 10 ** 6).toFixed(2)}`}</p>
                          </span>

                          <p className={`${getPreResult(v)} benefit`}>
                            {v?.winamount
                              ? (v?.winamount / 10 ** 6).toFixed(2)
                              : ""}
                          </p>

                          <p className="time">
                            {`${
                              moment.unix(v.expiry).diff(now, "hours")
                                ? `${moment.unix(v.expiry).diff(now, "hours")}:`
                                : ""
                            }${`${Math.floor(
                              moment.unix(v.expiry).diff(now, "minutes") % 60
                            )}`.padStart(2, "0")}:${`${
                              moment.unix(v.expiry).diff(now, "seconds") % 60
                            }`.padStart(2, "0")}`}
                          </p>
                        </div>
                      </summary>

                      <div className="openBox">
                        <div className="timeBox">
                          <ul className="timeList">
                            <li>
                              <p className="key">{t("Open time")}</p>
                              <p className="value">
                                {moment.unix(v.starting).format("hh:mm:ss")}
                              </p>
                            </li>

                            <li>
                              <p>
                                {t("M")}
                                {moment(
                                  moment
                                    .unix(v.expiry)
                                    .diff(moment.unix(v.starting))
                                ).format("m")}
                              </p>
                            </li>

                            <li>
                              <p className="key">{t("Closing Time")}</p>
                              <p className="value">
                                {moment.unix(v.expiry).format("hh:mm:ss")}
                              </p>
                            </li>
                          </ul>

                          <div className="barBox">
                            <div className="bar">
                              <div
                                style={{
                                  width: `${
                                    100 -
                                    (moment
                                      .unix(v.expiry)
                                      .diff(now, "seconds") *
                                      100) /
                                      (v.expiry - v.starting)
                                  }%`,
                                }}
                              />
                            </div>

                            <p className="left">{`${t("Time left")} : ${moment(
                              moment.unix(v.expiry).diff(now)
                            ).format("mm:ss")}`}</p>
                          </div>
                        </div>

                        <div className="resBox">
                          <div className="detResBox">
                            <ul className="forcastList">
                              <li>
                                <p className="key">{t("Your forecast")}</p>
                                <p className="value">{t(getForcast(v.side))}</p>
                              </li>
                              <li>
                                <p className="key">{t("Payout")}</p>
                                <p className="value">{`$${
                                  v.amount && (v.amount / 10 ** 6).toFixed(2)
                                }`}</p>
                              </li>
                              <li>
                                <p className="key">{t("Profit")}</p>
                                <p className="value">{`$${(
                                  (v.amount * v.diffRate) /
                                  10 ** 8
                                ).toFixed(2)}`}</p>
                              </li>
                            </ul>

                            <ul className="priceList">
                              <li>
                                <p className="key">{t("Open price")}</p>

                                <p className="value">
                                  {v.startingPrice
                                    ? Number(v.startingPrice).toFixed(2)
                                    : "-"}
                                </p>
                              </li>
                              <li>
                                <p className="key">{t("Current price")}</p>

                                <p className="value">
                                  {v.currentPrice
                                    ? Number(v.currentPrice).toFixed(2)
                                    : "-"}
                                </p>
                              </li>
                              <li>
                                <p className="key">{t("Difference")}</p>

                                <p
                                  className={`${
                                    (v.currentPrice - v.startingPrice > 0 &&
                                      "plus") ||
                                    (v.currentPrice - v.startingPrice < 0 &&
                                      "minus")
                                  } value point`}
                                >{`${Number(
                                  v.currentPrice - v.startingPrice
                                ).toFixed(2)} ${t("points")}`}</p>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </details>
                  </li>
                )}
              </Fragment>
            ))}
      </PopenedBox>
    );
}

const MopenedBox = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: scroll;

  li {
    details {
      padding: 14px 16px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0px 0px 0px rgba(255, 255, 255, 0.2);

      &[open] {
        border-color: transparent;
        box-shadow: unset;
      }

      summary {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 14px;

        .contBox {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;

          & > * {
            flex: 1;
          }

          .percent {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            text-align: end;
          }

          .price {
            text-align: center;
          }

          .forecast {
            display: flex;
            align-items: center;
            gap: 4px;

            img {
              height: 8px;
            }
          }

          .benefit {
            text-align: center;

            &.plus {
              color: #3fb68b;
            }

            &.minus {
              color: #ff5353;
            }
          }

          .time {
            text-align: end;
          }
        }
      }

      .openBox {
        display: flex;
        flex-direction: column;
        gap: 14px;
        margin: 14px 0 0 0;

        .timeBox {
          display: flex;
          flex-direction: column;
          gap: 10px;

          .timeList {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 16px;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.4);
            background: #111722;
            border-radius: 6px;

            li {
              display: flex;
              flex-direction: column;
              align-items: center;
            }
          }

          .barBox {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            font-size: 12px;

            .bar {
              width: 100%;
              height: 4px;
              background: rgba(255, 255, 255, 0.1);
              border-radius: 10px;
              overflow: hidden;

              div {
                height: 100%;
                background: rgba(255, 255, 255, 0.4);
                border-radius: inherit;
              }
            }

            .left {
            }
          }
        }

        .resBox {
          display: flex;
          flex-direction: column;
          gap: 12px;

          .detResBox {
            padding: 14px 16px;
            background: #111722;
            border-radius: 6px;

            .forcastList {
              display: flex;
              flex-direction: column;
              gap: 4px;
              padding: 0 0 12px 0;

              li {
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                color: rgba(255, 255, 255, 0.4);
              }
            }

            .priceList {
              display: flex;
              flex-direction: column;
              gap: 4px;
              padding: 12px 0 0 0;
              border-top: 1px solid rgba(255, 255, 255, 0.4);

              li {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 12px;

                .point {
                  color: #ff5353;
                }
              }
            }
          }
        }
      }
    }
  }
`;

const PopenedBox = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: scroll;

  li {
    details {
      padding: 14px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0px 0px 0px rgba(255, 255, 255, 0.2);

      &[open] {
        border-color: transparent;
        box-shadow: unset;
      }

      summary {
        display: flex;
        flex-direction: column;
        gap: 10px;
        font-size: 14px;

        .contBox {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;

          & > * {
            flex: 1;
          }

          .percent {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            text-align: end;
          }

          .price {
            text-align: center;
          }

          .forecast {
            display: flex;
            align-items: center;
            gap: 4px;

            img {
              height: 10px;
            }
          }

          .benefit {
            text-align: center;

            &.plus {
              color: #3fb68b;
            }

            &.minus {
              color: #ff5353;
            }
          }

          .time {
            text-align: end;
          }
        }
      }

      .openBox {
        display: flex;
        flex-direction: column;
        gap: 14px;
        margin: 14px 0 0 0;

        .timeBox {
          display: flex;
          flex-direction: column;
          gap: 10px;

          .timeList {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.4);
            background: #111722;
            border-radius: 6px;

            li {
              display: flex;
              flex-direction: column;
              align-items: center;
            }
          }

          .barBox {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
            font-size: 12px;

            .bar {
              width: 100%;
              height: 4px;
              background: rgba(255, 255, 255, 0.1);
              border-radius: 10px;
              overflow: hidden;

              div {
                height: 100%;
                background: rgba(255, 255, 255, 0.4);
                border-radius: inherit;
              }
            }

            .left {
            }
          }
        }

        .resBox {
          display: flex;
          flex-direction: column;
          gap: 12px;

          .detResBox {
            padding: 14px;
            background: #111722;
            border-radius: 6px;

            .forcastList {
              display: flex;
              flex-direction: column;
              gap: 4px;
              padding: 0 0 12px 0;

              li {
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                color: rgba(255, 255, 255, 0.4);
              }
            }

            .priceList {
              display: flex;
              flex-direction: column;
              gap: 4px;
              padding: 12px 0 0 0;
              border-top: 1px solid rgba(255, 255, 255, 0.4);

              li {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 12px;

                .point {
                  &.plus {
                    color: #3fb68b;
                  }

                  &.minus {
                    color: #ff5353;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
