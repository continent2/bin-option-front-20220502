import moment from "moment";
import styled from "styled-components";
import I_highArwGreen from "../../../img/icon/I_highArwGreen.svg";
import I_lowArwRed from "../../../img/icon/I_lowArwRed.svg";
import { useSelector } from "react-redux";
import axios from "axios";
import { API } from "../../../configs/api";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ClosedChartBox from "./ClosedChart";
import { useTranslation } from "react-i18next";

export default function Closed({ page }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const isMobile = useSelector((state) => state.common.isMobile);
  const closedFlag = useSelector((state) => state.bet.closedFlag);

  const [data, setData] = useState([]);

  function getMyBets() {
    axios
      .get(`${API.MY_BETS}/history`)
      .then(({ data }) => {
        console.log("closed", data.respdata);
        setData(data.respdata);
      })
      .catch((err) => console.error(err));
  }

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
    let result;

    switch (v.side) {
      case "HIGH":
        if (v.endingPrice - v.startingPrice > 0) result = "plus";
        else if (v.endingPrice - v.startingPrice < 0) result = "minus";
        break;

      case "LOW":
        if (v.endingPrice - v.startingPrice > 0) result = "minus";
        else if (v.endingPrice - v.startingPrice < 0) result = "plus";
        break;

      default:
        break;
    }

    if (v.diffRate === 0) result = null;

    return result;
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
    setTimeout(() => getMyBets(), 2000);
  }, [closedFlag]);

  if (isMobile)
    return (
      <MclosedBox className="detContList">
        <button
          className="viewDemoBtn"
          onClick={() => navigate("/position/history")}
        >
          {t(`View history of ${page} trades`)}
        </button>

        <ul className="dataList">
          {data &&
            data.map((v, i) => (
              <li key={i}>
                <p className="date">{v.time}</p>

                <ul className="detListByDate">
                  {v.value
                    .filter((v) => v.type === page.toUpperCase())
                    .map((detV, i) => (
                      <li key={i}>
                        <details>
                          <summary>
                            <div className="contBox">
                              <p className="token">{detV?.asset?.name}</p>

                              <p className="winLose">{detV.outcome}</p>

                              <p className="percent">{`${detV.diffRate}%`}</p>
                            </div>

                            <div className="contBox">
                              <span className="forecast">
                                <img src={getIcon(detV.side)} alt="" />
                                <p>{`$${detV.amount / 10 ** 6}`}</p>
                              </span>

                              <p className={`${getPreResult(detV)} benefit`}>
                                {(+detV.winamount).toFixed(2)}
                                {/** `$${detV.profit_amount? Number(detV.profit_amount).toFixed(2): detV.profit_amount}`}*/}
                              </p>

                              <p className="time">
                                {moment.unix(detV.starting).format("HH:mm:ss")}
                              </p>
                            </div>
                          </summary>

                          <div className="openBox">
                            <div className="timeBox">
                              <ul className="timeList">
                                <li>
                                  <p className="key">{t("Open time")}</p>
                                  <p className="value">
                                    {moment
                                      .unix(detV.starting)
                                      .format("hh:mm:ss")}
                                  </p>
                                </li>

                                <li>
                                  <p>
                                    {t("M")}
                                    {moment(
                                      moment
                                        .unix(detV.expiry)
                                        .diff(moment.unix(detV.starting))
                                    ).format("m")}
                                  </p>
                                </li>

                                <li>
                                  <p className="key">{t("Closing Time")}</p>
                                  <p className="value">
                                    {moment
                                      .unix(detV.expiry)
                                      .format("hh:mm:ss")}
                                  </p>
                                </li>
                              </ul>
                            </div>

                            <div className="chartCont">
                              <ClosedChartBox
                                price={Number(detV.startingPrice)}
                                data={detV.periodData}
                              />
                            </div>

                            <div className="resBox">
                              <div className="detResBox">
                                <ul className="forcastList">
                                  <li>
                                    <p className="key">{t("Your forecast")}</p>
                                    <p className="value">
                                      {getForcast(detV.side)}
                                    </p>
                                  </li>
                                  <li>
                                    <p className="key">{t("Payout")}</p>
                                    <p className="value">{`$${
                                      detV.amount &&
                                      (detV.amount / 10 ** 6).toFixed(2)
                                    }`}</p>
                                  </li>
                                  <li>
                                    <p className="key">{t("Profit")}</p>
                                    <p className="value">{`$${Number(
                                      detV.profit_amount
                                    ).toFixed(2)}`}</p>
                                  </li>
                                </ul>

                                <ul className="priceList">
                                  <li>
                                    <p className="key">{t("Open price")}</p>

                                    <p className="value">
                                      {detV.startingPrice
                                        ? Number(detV.startingPrice).toFixed(2)
                                        : "-"}
                                    </p>
                                  </li>
                                  <li>
                                    <p className="key">{t("Ending price")}</p>

                                    <p className="value">
                                      {detV.endingPrice
                                        ? Number(detV.endingPrice).toFixed(2)
                                        : "-"}
                                    </p>
                                  </li>
                                  <li>
                                    <p className="key">{t("Difference")}</p>

                                    <p
                                      className={`${
                                        (detV.endingPrice - detV.startingPrice >
                                          0 &&
                                          "plus") ||
                                        (detV.endingPrice - detV.startingPrice <
                                          0 &&
                                          "minus")
                                      } value point`}
                                    >{`${Number(
                                      detV.endingPrice - detV.startingPrice
                                    ).toFixed(2)} ${t("points")}`}</p>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </details>
                      </li>
                    ))}
                </ul>
              </li>
            ))}
        </ul>
      </MclosedBox>
    );
  else
    return (
      <PclosedBox className="detContList">
        <button
          className="viewDemoBtn"
          onClick={() => navigate("/position/history")}
        >
          {t(`View history of ${page} trades`)}
        </button>

        <ul className="dataList">
          {data &&
            data.map((v, i) => (
              <li key={i}>
                <p className="date">{v.time}</p>

                <ul className="detListByDate">
                  {v.value
                    .filter((v) => v.type === page.toUpperCase())
                    .map((detV, i) => (
                      <li key={i}>
                        <details>
                          <summary>
                            <div className="contBox">
                              <p className="token">{detV?.asset?.name}</p>

                              <p className="winLose">{detV.outcome}</p>

                              <p className="percent">{`${detV.diffRate}%`}</p>
                            </div>

                            <div className="contBox">
                              <span className="forecast">
                                <img src={getIcon(detV.side)} alt="" />
                                <p>{`$${detV.amount / 10 ** 6}`}</p>
                              </span>

                              <p className={`${getPreResult(detV)} benefit`}>
                                {(+detV.winamount).toFixed(2)}
                                {/**  `$${detV.profit_amount? Number(detV.profit_amount).toFixed(2): detV.profit_amount}`}*/}
                              </p>

                              <p className="time">
                                {moment.unix(detV.starting).format("HH:mm:ss")}
                              </p>
                            </div>
                          </summary>

                          <div className="openBox">
                            <div className="timeBox">
                              <ul className="timeList">
                                <li>
                                  <p className="key">{t("Open time")}</p>
                                  <p className="value">
                                    {moment
                                      .unix(detV.starting)
                                      .format("hh:mm:ss")}
                                  </p>
                                </li>

                                <li>
                                  <p>
                                    {t("M")}
                                    {moment(
                                      moment
                                        .unix(detV.expiry)
                                        .diff(moment.unix(detV.starting))
                                    ).format("m")}
                                  </p>
                                </li>

                                <li>
                                  <p className="key">{t("Closing Time")}</p>
                                  <p className="value">
                                    {moment
                                      .unix(detV.expiry)
                                      .format("hh:mm:ss")}
                                  </p>
                                </li>
                              </ul>
                            </div>

                            <div className="chartCont">
                              <ClosedChartBox
                                price={Number(detV.startingPrice)}
                                data={detV.periodData}
                              />
                            </div>

                            <div className="resBox">
                              <div className="detResBox">
                                <ul className="forcastList">
                                  <li>
                                    <p className="key">{t("Your forecast")}</p>
                                    <p className="value">
                                      {getForcast(detV.side)}
                                    </p>
                                  </li>
                                  <li>
                                    <p className="key">{t("Payout")}</p>
                                    <p className="value">{`$${
                                      detV.amount &&
                                      (detV.amount / 10 ** 6).toFixed(2)
                                    }`}</p>
                                  </li>
                                  <li>
                                    <p className="key">{t("Profit")}</p>
                                    <p className="value">{`$${Number(
                                      detV.profit_amount
                                    ).toFixed(2)}`}</p>
                                  </li>
                                </ul>

                                <ul className="priceList">
                                  <li>
                                    <p className="key">{t("Open price")}</p>

                                    <p className="value">
                                      {detV.startingPrice
                                        ? Number(detV.startingPrice).toFixed(2)
                                        : "-"}
                                    </p>
                                  </li>
                                  <li>
                                    <p className="key">{t("Ending price")}</p>

                                    <p className="value">
                                      {detV.endingPrice
                                        ? Number(detV.endingPrice).toFixed(2)
                                        : "-"}
                                    </p>
                                  </li>
                                  <li>
                                    <p className="key">{t("Difference")}</p>

                                    <p
                                      className={`${
                                        (detV.endingPrice - detV.startingPrice >
                                          0 &&
                                          "plus") ||
                                        (detV.endingPrice - detV.startingPrice <
                                          0 &&
                                          "minus")
                                      } value point`}
                                    >{`${Number(
                                      detV.endingPrice - detV.startingPrice
                                    ).toFixed(2)} ${t("points")}`}</p>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </details>
                      </li>
                    ))}
                </ul>
              </li>
            ))}
        </ul>
      </PclosedBox>
    );
}

const MclosedBox = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 18px;
  overflow-y: scroll;

  .viewDemoBtn {
    min-height: 34px;
    height: 34px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.4);
    background: #0a0e17;
    border-radius: 8px;

    &:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.1);
    }
  }

  .dataList {
    display: flex;
    flex-direction: column;
    gap: 14px;

    & > li {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .date {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.4);
      }

      .detListByDate {
        display: flex;
        flex-direction: column;
        gap: 10px;

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

                .winLose {
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

                    div {
                      width: 20%;
                      height: 100%;
                      background: rgba(255, 255, 255, 0.4);
                      border-radius: inherit;
                    }
                  }

                  .left {
                  }
                }
              }

              .chartCont {
                display: flex;
                justify-content: center;
                align-items: flex-end;
                height: 116px;
                min-height: 116px;
                background: #111722;
                border-radius: 6px;
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

                .getBtn {
                  height: 40px;
                  font-size: 14px;
                  color: #f7ab1f;
                  background: rgba(247, 171, 31, 0.1);
                  border-radius: 6px;

                  &:hover {
                    color: #4e3200;
                    background: #f7ab1f;
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

const PclosedBox = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-y: scroll;

  .viewDemoBtn {
    min-height: 34px;
    height: 34px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.4);
    background: #0a0e17;
    border-radius: 8px;

    &:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.1);
    }
  }

  .dataList {
    display: flex;
    flex-direction: column;
    gap: 14px;

    & > li {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .date {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.4);
      }
      .detListByDate {
        display: flex;
        flex-direction: column;
        gap: 8px;

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

                .winLose {
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

                    div {
                      width: 20%;
                      height: 100%;
                      background: rgba(255, 255, 255, 0.4);
                      border-radius: inherit;
                    }
                  }

                  .left {
                  }
                }
              }

              .chartCont {
                display: flex;
                justify-content: center;
                align-items: flex-end;
                height: 116px;
                min-height: 116px;
                background: #111722;
                border-radius: 6px;
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

                .getBtn {
                  height: 34px;
                  font-size: 14px;
                  color: #f7ab1f;
                  background: rgba(247, 171, 31, 0.1);
                  border-radius: 6px;

                  &:hover {
                    color: #4e3200;
                    background: #f7ab1f;
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
