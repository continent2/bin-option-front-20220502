import { useSelector } from "react-redux";
import styled from "styled-components";
import DefaultHeader from "../../components/header/DefaultHeader";
import T_dia from "../../img/tier/T_dia.svg";
import I_upPolGreen from "../../img/icon/I_upPolGreen.svg";
import { useTranslation } from "react-i18next";
import { getBigCount } from "../../util/Util";
import axios from "axios";
import { API } from "../../configs/api";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

export default function MyPosition() {
  const { t } = useTranslation();

  const isMobile = useSelector((state) => state.common.isMobile);

  const [data, setData] = useState("");
  const [chartData, setChartData] = useState([]);

  function getData() {
    axios
      .get(API.MY_POSITION)
      .then(({ data }) => {
        console.log(data.result);
        setData(data.result);
      })
      .catch(console.error);

    axios
      .get(API.USER_DAILY_SUMMARY)
      .then(({ data }) => {
        let _chartData = [];
        console.log(data.list);

        data.list.map((e, i) => {
          _chartData.push({
            x: new Date(e.date),
            y: e.sumbetamount / 10 ** 6,
          });
        });

        setChartData([..._chartData]);
      })
      .catch(console.error);
  }

  useEffect(() => {
    getData();
  }, []);

  if (isMobile)
    return (
      <>
        <DefaultHeader title="My Positions" />

        <MmyPositionBox>
          <section className="innerBox">
            <article className="posArea">
              <span className="posBox">
                <img src={data.level_img} alt="" />

                <div className="textBox">
                  <strong className="pos">{t(data.level_str)}</strong>

                  <p className="cashBack">{`Cashback ${data.cashback}%`}</p>
                </div>
              </span>

              <ul className="balanceList">
                <li>
                  <p className="key">{t("Total")}</p>
                  <strong className="value">{data.total} USDT</strong>
                </li>
                <li>
                  <p className="key">{t("Safe Balance")}</p>
                  <strong className="value">{data.safeBalance} USDT</strong>
                </li>
              </ul>
            </article>

            <article className="detArea">
              <div className="detBox">
                <div className="posBox">
                  <p className="key">{t("Positions")}</p>

                  <div className="value">
                    <strong className="price">
                      ${data.today_betamount && data.today_betamount.toFixed(2)}
                    </strong>

                    <div className="changeBox">
                      <img src={I_upPolGreen} alt="" />

                      <span className="text">
                        <p className="change">
                          $
                          {data.today_win_amount &&
                            data.today_win_amount.toFixed(2)}{" "}
                          ({data.profit_today}%)
                        </p>
                        <p className="time">{t("Today")}</p>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="detPriceList">
                  <li>
                    <p className="key">{t("Deals")}</p>
                    <p className="value">{getBigCount(data.deal)}</p>
                  </li>
                  <li>
                    <p className="key">{t("Trading profit")}</p>
                    <p className="value">
                      ${getBigCount(data.total_win_amount)}
                    </p>
                  </li>
                  <li>
                    <p className="key">{t("Profitable deals")}</p>
                    <p className="value">{data.total_profit}%</p>
                  </li>

                  <li>
                    <p className="key">{t("Average profit")}</p>
                    <p className="value">${getBigCount(data.average_profit)}</p>
                  </li>
                  <li>
                    <p className="key">{t("Net turnover")}</p>
                    <p className="value">${getBigCount(data.net_turnover)}</p>
                  </li>
                  <li>
                    <p className="key">{t("Hedged trades")}</p>
                    <p className="value">${getBigCount(data.hedged_trades)}</p>
                  </li>

                  <li>
                    <p className="key">{t("Min trade amount")}</p>
                    <p className="value">
                      ${getBigCount(data.min_trade_amount)}
                    </p>
                  </li>
                  <li>
                    <p className="key">{t("Max trade amount")}</p>
                    <p className="value">
                      ${getBigCount(data.max_trade_amount)}
                    </p>
                  </li>
                  <li>
                    <p className="key">{t("Max trade profit")}</p>
                    <p className="value">${getBigCount(data.max_profit)}</p>
                  </li>
                </div>
              </div>
              <div className="chartBox"></div>
            </article>
          </section>
        </MmyPositionBox>
      </>
    );
  else
    return (
      <PmyPositionBox>
        <section className="innerBox">
          <article className="posArea">
            <span className="posBox">
              <img src={data.level_img} alt="" />

              <div className="textBox">
                <strong className="pos">{t(data.level_str)}</strong>

                <p className="cashBack">{`Cashback ${data.cashback}%`}</p>
              </div>
            </span>

            <ul className="balanceList">
              <li>
                <p className="key">{t("Total")}</p>
                <strong className="value">{data.total} USDT</strong>
              </li>
              <li>
                <p className="key">{t("Safe Balance")}</p>
                <strong className="value">{data.safeBalance} USDT</strong>
              </li>
            </ul>
          </article>

          <article className="detArea">
            <div className="detBox">
              <div className="posBox">
                <p className="key">{t("Positions")}</p>

                <div className="value">
                  <strong className="price">
                    ${data.today_betamount && data.today_betamount.toFixed(2)}
                  </strong>

                  <div className="changeBox">
                    <img src={I_upPolGreen} alt="" />

                    <span className="text">
                      <p className="change">
                        $
                        {data.today_win_amount &&
                          data.today_win_amount.toFixed(2)}{" "}
                        ({data.profit_today}%)
                      </p>
                      &nbsp;
                      <p className="time">{t("Today")}</p>
                    </span>
                  </div>
                </div>
              </div>

              <div className="detPriceList">
                <li>
                  <div>
                    <p className="key">{t("Deals")}</p>
                    <p className="value">{getBigCount(data.deal)}</p>
                  </div>
                  <div>
                    <p className="key">{t("Trading profit")}</p>
                    <p className="value">
                      ${getBigCount(data.total_win_amount)}
                    </p>
                  </div>
                  <div>
                    <p className="key">{t("Profitable deals")}</p>
                    <p className="value">{data.total_profit}%</p>
                  </div>
                </li>
                <li>
                  <div>
                    <p className="key">{t("Average profit")}</p>
                    <p className="value">${getBigCount(data.average_profit)}</p>
                  </div>
                  <div>
                    <p className="key">{t("Net turnover")}</p>
                    <p className="value">${getBigCount(data.net_turnover)}</p>
                  </div>
                  <div>
                    <p className="key">{t("Hedged trades")}</p>
                    <p className="value">${getBigCount(data.hedged_trades)}</p>
                  </div>
                </li>
                <li>
                  <div>
                    <p className="key">{t("Min trade amount")}</p>
                    <p className="value">
                      ${getBigCount(data.min_trade_amount)}
                    </p>
                  </div>
                  <div>
                    <p className="key">{t("Max trade amount")}</p>
                    <p className="value">
                      ${getBigCount(data.max_trade_amount)}
                    </p>
                  </div>
                  <div>
                    <p className="key">{t("Max trade profit")}</p>
                    <p className="value">${getBigCount(data.max_profit)}</p>
                  </div>
                </li>
              </div>
            </div>
            <div className="chartBox">
              <ReactApexChart
                options={chartOpt}
                series={[{ data: [...chartData] }]}
                type="line"
                height={"100%"}
              />
            </div>
          </article>
        </section>
      </PmyPositionBox>
    );
}

const MmyPositionBox = styled.main`
  height: 100%;

  .innerBox {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: scroll;

    .posArea {
      .posBox {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 20px;

        img {
          height: 74px;
        }

        .textBox {
          display: flex;
          flex-direction: column;
          gap: 4px;

          .pos {
            font-size: 20px;
          }

          .cashBack {
            font-size: 14px;
            opacity: 0.4;
          }
        }
      }

      .balanceList {
        display: flex;
        padding: 12px 0;
        border-top: 1px solid rgba(255, 255, 255, 0.2);

        li {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 4px 20px;

          &:nth-of-type(n + 2) {
            border-left: 1px solid rgba(255, 255, 255, 0.2);
          }

          .key {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.4);
          }

          .value {
            font-size: 16px;
          }
        }
      }
    }

    .detArea {
      .detBox {
        .posBox {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 16px 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.2);

          .key {
            font-size: 14px;
            opacity: 0.4;
          }

          .value {
            display: flex;
            flex-direction: column;
            gap: 4px;

            .price {
              font-size: 24px;
            }

            .changeBox {
              display: flex;
              align-items: center;
              gap: 4px;

              img {
                width: 10px;
              }

              .text {
                display: flex;
                font-size: 14px;

                .change {
                  color: #3fb68b;
                }

                .time {
                  opacity: 0.4;
                }
              }
            }
          }
        }

        .detPriceList {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 16px 20px;
          font-size: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.2);

          li {
            display: flex;
            justify-content: space-between;

            .key {
              white-space: nowrap;
              opacity: 0.4;
            }
          }
        }
      }

      .chartBox {
        min-width: 730px;
        width: 730px;
        border-left: 1px solid rgba(255, 255, 255, 0.2);
      }
    }
  }
`;

const PmyPositionBox = styled.main`
  flex: 1;
  padding: 70px 140px;
  overflow-y: scroll;

  @media (max-width: 1440px) {
    max-width: 1020px;
    padding: 70px 40px 70px 80px;
  }

  .innerBox {
    display: flex;
    flex-direction: column;
    gap: 50px;
    height: 100%;

    .posArea {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .posBox {
        display: flex;
        align-items: center;
        gap: 12px;

        img {
          height: 74px;
        }

        .textBox {
          display: flex;
          flex-direction: column;
          gap: 4px;

          .pos {
            font-size: 24px;
          }

          .cashBack {
            font-size: 14px;
            opacity: 0.4;
          }
        }
      }

      .balanceList {
        display: flex;
        height: 42px;

        li {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 6px;
          padding: 0 14px;

          &:nth-of-type(n + 2) {
            border-left: 1px solid rgba(255, 255, 255, 0.2);
          }

          &:last-of-type {
            padding: 0 0 0 14px;
          }

          .key {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.4);
          }

          .value {
            font-size: 16px;
          }
        }
      }
    }

    .detArea {
      display: flex;
      height: 256px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      overflow-x: scroll;

      .detBox {
        display: flex;
        flex-direction: column;
        min-width: 562px;

        .posBox {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 18px 30px;

          .key {
            font-size: 14px;
            opacity: 0.4;
          }

          .value {
            display: flex;
            flex-direction: column;
            gap: 4px;

            .price {
              font-size: 24px;
            }

            .changeBox {
              display: flex;
              align-items: center;
              gap: 4px;

              img {
                width: 10px;
              }

              .text {
                display: flex;
                font-size: 14px;

                .change {
                  color: #3fb68b;
                }

                .time {
                  opacity: 0.4;
                }
              }
            }
          }
        }

        .detPriceList {
          flex: 1;
          display: flex;
          align-items: center;
          border-top: 1px solid rgba(255, 255, 255, 0.2);

          li {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 0 14px;
            font-size: 14px;

            &:nth-of-type(n + 2) {
              border-left: 1px solid rgba(255, 255, 255, 0.2);
            }

            div {
              display: flex;
              justify-content: space-between;

              .key {
                white-space: nowrap;
                opacity: 0.4;
              }
            }
          }
        }
      }

      .chartBox {
        min-width: 730px;
        width: 730px;
        border-left: 1px solid rgba(255, 255, 255, 0.2);
      }
    }
  }
`;

const chartOpt = {
  chart: {
    background: "none",
    zoom: {
      autoScaleYaxis: true,
      enabled: false,
    },
    toolbar: {
      show: false,
    },
  },
  colors: ["#F7AB1F"],
  stroke: {
    colors: "#F7AB1F",
    curve: "smooth",
    width: 2,
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 0,
  },
  xaxis: {
    type: "datetime",
    labels: {
      style: {
        colors: "#aaa",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    opposite: true,
    labels: {
      show: true,
      align: "right",
      style: {
        colors: "#aaa",
      },
      formatter: (val) => {
        return `$${val}`;
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  tooltip: {
    x: {
      format: "dd MMM",
    },
    y: {
      title: {
        formatter: (_, { series, seriesIndex }) => {
          return `Profit `;
        },
      },
    },
  },
  legend: {
    show: false,
  },
  grid: {
    borderColor: "rgba(0,0,0,0)",
  },
  theme: {
    mode: "dark",
  },
};
