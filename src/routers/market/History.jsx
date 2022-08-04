import { forwardRef, useEffect, useState } from "react";
import styled from "styled-components";
import DatePicker, { registerLocale } from "react-datepicker";
import ko from "date-fns/locale/ko";
import "../../util/react-datepicker.css";
import I_calender from "../../img/icon/I_calender.svg";
import I_exportWhite from "../../img/icon/I_exportWhite.svg";
import I_ltArwWhite from "../../img/icon/I_ltArwWhite.svg";
import I_rtArwWhite from "../../img/icon/I_rtArwWhite.svg";
import moment from "moment";
import {
  D_historyListHeader,
  D_historyCategoryList,
} from "../../data/D_market";
import renderCustomHeader from "../../util/DatePickerHeader";
import { useSelector } from "react-redux";
import DefaultHeader from "../../components/header/DefaultHeader";
import axios from "axios";
import { API } from "../../configs/api";
import { getExcelFile } from "../../util/Util";

export default function History() {
  const statusSTR = {
    0: "Pending",
    1: "Confirmed",
    2: "Rejected",
  };
  registerLocale("ko", ko);

  const isMobile = useSelector((state) => state.common.isMobile);

  const [category, setCategory] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [page, setPage] = useState(1);
  const [tblData, setTblData] = useState([]);
  const [total, setTotal] = useState(0);

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <button className="dateBtn" onClick={onClick} ref={ref}>
      <img src={I_calender} alt="" />
      <p>{value}</p>
    </button>
  ));

  function getData(arg) {
    let params = {
      key: "typestr",
      val: category == 0 ? "DEPOSIT" : "WITHDRAW",
    };

    console.log(arg?.filter);

    if (arg?.filter) {
      params.startDate = startDate;
      params.endDate = endDate;
    }

    axios
      .get(`${API.USER_QUERY}/transactions/${(page - 1) * 10}/10`, {
        params,
      })
      .then(({ data }) => {
        let { respdata } = data;
        console.log(respdata);
        setTblData(respdata.rows);
        setTotal(respdata.count);
      });
  }

  function onClickExcelBtn() {
    let filename;
    if (category === 0) filename = "DEPOSIT";
    else filename = "WITHDRAW";

    getExcelFile(tblData, filename);
  }

  function dateChange(dates) {
    const [start, end] = dates;

    setStartDate(start);
    setEndDate(end);
  }

  function onClickPrePageBtn() {
    setPage(page - 1);
  }

  function onClickNextPageBtn() {
    setPage(page + 1);
  }

  useEffect(() => {
    getData();
  }, [category, page]);

  if (isMobile)
    return (
      <>
        <DefaultHeader title="History" />

        <MhistoryBox>
          <section className="innerBox">
            <ul className="categoryList">
              {D_historyCategoryList.map((v, i) => (
                <li
                  key={i}
                  className={`${category === i && "on"}`}
                  onClick={() => setCategory(i)}
                >
                  {v}
                </li>
              ))}
            </ul>

            <article className="contArea">
              <div className="filterBar">
                <div className="filterBox">
                  <span className="dateBox filterOpt">
                    <DatePicker
                      calendarClassName="moDatePicker"
                      locale="ko"
                      selected={startDate}
                      onChange={dateChange}
                      startDate={startDate}
                      endDate={endDate}
                      selectsRange
                      renderCustomHeader={renderCustomHeader}
                      customInput={<ExampleCustomInput />}
                    />
                  </span>

                  <button
                    className="applyBtn"
                    onClick={() => getData({ filter: true })}
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div className="listBox">
                <ul className="list">
                  {tblData[0] ? (
                    tblData.map((v, i) => (
                      <li key={i}>
                        <div>
                          <p className="key">{D_historyListHeader[0]}</p>
                          <div className="value">
                            <p>{v.id}</p>
                          </div>
                        </div>

                        <div>
                          <p className="key">{D_historyListHeader[1]}</p>
                          <div className="value">
                            <p>
                              {moment(v.createdat).format(
                                "YYYY-MM-DD HH:mm:ss"
                              )}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="key">{D_historyListHeader[2]}</p>
                          <div className="value">
                            <p>{`${
                              v?.amount
                                ? v?.amount?.toLocaleString("eu", "US")
                                : v?.localeAmount?.toLocaleString("cn", "CN")
                            } ${v.localeUnit || v.unit}`}</p>
                          </div>
                        </div>

                        <div>
                          <p className="key">{D_historyListHeader[3]}</p>
                          <div className="value">
                            <p>
                              {v.type == 2 ? "Bank Transfer" : "Blockchain"}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="key">{D_historyListHeader[4]}</p>
                          <div className="value">
                            <p>{v.typestr}</p>
                          </div>
                        </div>

                        <div>
                          <p className="key">{D_historyListHeader[5]}</p>
                          <div className="value">
                            <p>{statusSTR[v.status]}</p>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <p className="notFound">
                      Nothing found or not yet calculated
                    </p>
                  )}
                </ul>
              </div>

              <div className="pageBox">
                <button
                  className="arwBtn"
                  disabled={page <= 1}
                  onClick={onClickPrePageBtn}
                >
                  <img src={I_ltArwWhite} alt="" />
                </button>

                <ul className="pageList">
                  {new Array(Math.ceil(total / 10)).fill("").map(
                    (v, i) =>
                      i > page - 6 &&
                      i < page + 4 && (
                        <li
                          key={i}
                          className={`${i + 1 === page && "on"}`}
                          onClick={() => setPage(i + 1)}
                        >
                          <strong>{i + 1}</strong>
                          <span className="onBar" />
                        </li>
                      )
                  )}
                </ul>

                <button
                  className="arwBtn"
                  disabled={page >= Math.ceil(total / 10)}
                  onClick={onClickNextPageBtn}
                >
                  <img src={I_rtArwWhite} alt="" />
                </button>
              </div>
            </article>
          </section>
        </MhistoryBox>
      </>
    );
  else
    return (
      <PhistoryBox>
        <section className="innerBox">
          <ul className="categoryList">
            {D_historyCategoryList.map((v, i) => (
              <li
                key={i}
                className={`${category === i && "on"}`}
                onClick={() => setCategory(i)}
              >
                {v}
              </li>
            ))}
          </ul>

          <article className="contArea">
            <div className="filterBar">
              <div className="filterBox">
                <span className="dateBox filterOpt">
                  <DatePicker
                    locale="ko"
                    selected={startDate}
                    onChange={dateChange}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    renderCustomHeader={renderCustomHeader}
                    customInput={<ExampleCustomInput />}
                  />
                </span>

                <button
                  className="applyBtn"
                  onClick={() => getData({ filter: true })}
                >
                  Apply
                </button>
              </div>

              <button className="exportBtn" onClick={onClickExcelBtn}>
                <img src={I_exportWhite} alt="" />
              </button>
            </div>

            <div className="listBox">
              <ul className="listHeader">
                {D_historyListHeader.map((v, i) => (
                  <li key={i}>
                    <p>{v}</p>
                  </li>
                ))}
              </ul>

              <ul className="list">
                {tblData.map((v, i) => (
                  <li key={i}>
                    <span>{v.id}</span>

                    <span>
                      <p>{moment(v.createdat).format("YYYY-MM-DD HH:mm:ss")}</p>
                    </span>

                    <span>
                      <p>{`${
                        v?.amount
                          ? v?.amount?.toLocaleString("eu", "US")
                          : v?.localeAmount?.toLocaleString("cn", "CN")
                      } ${v.localeUnit || v.unit}`}</p>
                    </span>

                    <span>
                      <p>{v.type == 2 ? "Bank Transfer" : "Blockchain"}</p>
                    </span>

                    <span>
                      <p>{v.typestr}</p>
                    </span>

                    <span className={statusSTR[v.status]}>
                      <p>{statusSTR[v.status]}</p>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pageBox">
              <button
                className="arwBtn"
                disabled={page <= 1}
                onClick={onClickPrePageBtn}
              >
                <img src={I_ltArwWhite} alt="" />
              </button>

              <ul className="pageList">
                {new Array(Math.ceil(total / 10)).fill("").map(
                  (v, i) =>
                    i > page - 6 &&
                    i < page + 4 && (
                      <li
                        key={i}
                        className={`${i + 1 === page && "on"}`}
                        onClick={() => setPage(i + 1)}
                      >
                        <strong>{i + 1}</strong>
                        <span className="onBar" />
                      </li>
                    )
                )}
              </ul>

              <button
                className="arwBtn"
                disabled={page >= Math.ceil(total / 10)}
                onClick={onClickNextPageBtn}
              >
                <img src={I_rtArwWhite} alt="" />
              </button>
            </div>
          </article>
        </section>
      </PhistoryBox>
    );
}

const MhistoryBox = styled.main`
  height: 100%;

  .innerBox {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: scroll;

    .categoryList {
      display: flex;

      li {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 44px;
        font-size: 16px;
        font-weight: 700;
        border-bottom: 4px solid transparent;
        opacity: 0.4;
        cursor: pointer;

        &.on {
          border-color: #fff;
          opacity: 1;
        }
      }
    }

    .contArea {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .filterBar {
        padding: 20px;

        .filterBox {
          display: flex;
          flex-direction: column;
          gap: 8px;

          .filterOpt {
            display: flex;
            align-items: center;
            width: 100%;
            height: 40px;
            padding: 0 24px;
            color: rgba(255, 255, 255, 0.4);
            border: 1px solid #3b3e45;
            border-radius: 20px;

            &:focus-within {
              border-color: #fff;
              color: #fff;
            }

            &.dateBox {
              position: relative;

              .dateBtn {
                display: flex;
                align-items: center;
                gap: 12px;
                font-size: 14px;

                img {
                  width: 16px;
                }
              }

              .react-datepicker-popper {
                top: 40px !important;
                left: 50% !important;
                transform: translate(-50%, 0) !important;
              }
            }
          }

          .applyBtn {
            width: 100%;
            height: 40px;
            font-size: 14px;
            font-weight: 700;
            border: 1px solid #3b3e45;
            border-radius: 20px;

            &:focus-within {
              border-color: #fff;
            }
          }
        }
      }

      .listBox {
        padding: 0 20px;

        .list {
          li {
            display: flex;
            flex-direction: column;
            gap: 4px;
            padding: 24px 0;

            &:first-of-type {
              padding: 0 0 24px;
            }

            &:last-of-type {
              padding: 24px 0 0;
            }

            &:nth-of-type(n + 2) {
              border-top: 1px solid rgba(255, 255, 255, 0.14);
            }

            div {
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 14px;

              .key {
                color: rgba(255, 255, 255, 0.6);
              }
            }
          }

          .notFound {
            margin: 0 0 34px;
            font-size: 14px;
            text-align: center;
            opacity: 0.4;
          }
        }
      }

      .pageBox {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        margin: 30px 0 0 0;

        .arwBtn {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 40px;
          height: 40px;
          border: 2px solid #fff;
          border-radius: 50%;

          &:disabled {
            opacity: 0.2;
          }
        }

        .pageList {
          display: flex;
          align-items: center;

          li {
            display: flex;
            justify-content: center;
            padding: 0 5px;
            font-size: 18px;
            position: relative;
            cursor: pointer;

            &.on {
              .onBar {
                background: #f7ab1f;
              }
            }

            .onBar {
              width: 100%;
              height: 6px;
              border-radius: 4px;
              bottom: -6px;
              position: absolute;
            }
          }
        }
      }
    }
  }
`;

const PhistoryBox = styled.main`
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
    gap: 40px;
    height: 100%;

    .categoryList {
      display: flex;
      gap: 20px;

      li {
        height: 36px;
        font-size: 18px;
        font-weight: 700;
        border-bottom: 4px solid transparent;
        opacity: 0.4;
        cursor: pointer;

        &.on {
          border-color: #fff;
          opacity: 1;
        }
      }
    }

    .contArea {
      display: flex;
      flex-direction: column;
      gap: 20px;

      .filterBar {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .filterBox {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;

          .filterOpt {
            display: flex;
            align-items: center;
            width: 280px;
            height: 40px;
            padding: 0 22px;
            color: rgba(255, 255, 255, 0.4);
            border: 1px solid #3b3e45;
            border-radius: 20px;

            &:focus-within {
              border-color: #fff;
              color: #fff;
            }

            &.dateBox {
              .dateBtn {
                display: flex;
                align-items: center;
                gap: 8px;

                img {
                  width: 16px;
                  height: 17px;
                }
              }
            }
          }

          .applyBtn {
            width: 120px;
            height: 40px;
            font-size: 14px;
            font-weight: 700;
            border: 1px solid #3b3e45;
            border-radius: 20px;

            &:focus-within {
              border-color: #fff;
            }
          }
        }

        .exportBtn {
          display: flex;
          justify-content: center;
          width: 40px;
          height: 40px;
          padding: 10px 13px 13px;
          border: 1px solid #3b3e45;
          border-radius: 50%;

          img {
            width: 14px;
          }
        }
      }

      .listBox {
        border: 1px solid #3b3e45;
        border-radius: 14px;
        overflow-x: scroll;

        .listHeader {
          display: flex;
          align-items: center;
          height: 46px;
          color: rgba(255, 255, 255, 0.6);
        }

        .list {
          display: flex;
          flex-direction: column;

          li {
            display: flex;

            span {
              height: 60px;
              border-top: 1px solid #3b3e45;

              &.Pending {
                color: #ffbf00;
              }
              &.Confirmed {
                color: #32a869;
              }
              &.Rejected {
                color: #ff5353;
              }
            }
          }
        }

        .listHeader li,
        .list li span {
          display: flex;
          align-items: center;
          font-size: 14px;

          p {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }

          &:first-of-type {
          }

          &:last-of-type {
            padding: 0 20px 0 0;
          }

          &:nth-of-type(1) {
            justify-content: center;
            width: 90px;
            min-width: 90px;
          }

          &:nth-of-type(2) {
            width: 170px;
            min-width: 170px;
          }

          &:nth-of-type(3) {
            flex: 1;
            width: 168px;
            min-width: 168px;
          }

          &:nth-of-type(4) {
            width: 238px;
            min-width: 238px;
          }

          &:nth-of-type(5) {
            width: 158px;
            min-width: 158px;
          }

          &:nth-of-type(6) {
            width: 196px;
            min-width: 196px;
          }
        }
      }

      .pageBox {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        margin: 30px 0 0 0;

        .arwBtn {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 40px;
          height: 40px;
          border: 2px solid #fff;
          border-radius: 50%;

          &:disabled {
            opacity: 0.2;
          }
        }

        .pageList {
          display: flex;
          align-items: center;

          li {
            display: flex;
            justify-content: center;
            padding: 0 5px;
            font-size: 18px;
            position: relative;
            cursor: pointer;

            &.on {
              .onBar {
                background: #f7ab1f;
              }
            }

            .onBar {
              width: 100%;
              height: 6px;
              border-radius: 4px;
              bottom: -6px;
              position: absolute;
            }
          }
        }
      }
    }
  }
`;
