import styled from "styled-components";
import DatePicker from "react-datepicker";
import "../../../util/react-datepicker.css";
import { forwardRef, useEffect, useState } from "react";
import I_calender from "../../../img/icon/I_calender.svg";
import I_exportWhite from "../../../img/icon/I_exportWhite.svg";
import I_ltArwWhite from "../../../img/icon/I_ltArwWhite.svg";
import I_rtArwWhite from "../../../img/icon/I_rtArwWhite.svg";
import I_rtArwYellow from "../../../img/icon/I_rtArwYellow.svg";
import {
  D_profitHistoryListHeader,
  D_profitHistoryList,
} from "../../../data/D_finance";
import moment from "moment";
import { useSelector } from "react-redux";
import { getExcelFile, getTier } from "../../../util/Util";
import axios from "axios";
import { API } from "../../../configs/api";

export default function ProfitHistory() {
  const isMobile = useSelector((state) => state.common.isMobile);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [listData, setListData] = useState([]);

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <button className="dateBtn" onClick={onClick} ref={ref}>
      <img src={I_calender} alt="" />
      <p>{value}</p>
    </button>
  ));

  function onClickExcelBtn() {
    getExcelFile(listData, "Finance");
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

  function getData() {
    axios
      .get(`${API.USER_BRANCH_FEE_LOG}/${(page - 1) * 10}/10/id/DESC`)
      .then(({ data }) => {
        console.log(data);
        setTotal(data.resp.count);
        setListData(data.resp.rows);
      })
      .catch(console.error);
  }

  useEffect(() => {
    getData();
  }, [page]);

  if (isMobile)
    return (
      <>
        <MprofitHistory>
          <ul className="list">
            {listData.map((v, i) => (
              <li key={i}>
                <div>
                  <p className="key">{D_profitHistoryListHeader[0]}</p>

                  <span className="value">
                    <p>{v.referral_user.email}</p>
                  </span>
                </div>

                <div>
                  <p className="key">{D_profitHistoryListHeader[1]}</p>

                  <span className="value">
                    <p>{getTier(v.referral_user.level)}</p>
                  </span>
                </div>

                <div>
                  <p className="key">{D_profitHistoryListHeader[2]}</p>

                  <span className="value">
                    <p>{moment(v.createdat).format("YYYY-MM-DD")}</p>
                  </span>
                </div>

                <div>
                  <p className="key">{D_profitHistoryListHeader[3]}</p>

                  <span className="value">
                    <p>{v.betamount / 10 ** 6}</p>
                  </span>
                </div>

                <div>
                  <p className="key">{D_profitHistoryListHeader[4]}</p>

                  <span className="value">
                    <p>
                      <span className="price">${v.received_amount}</span>
                      &nbsp;
                      {`(${v.received_percent}%)`}
                    </p>
                  </span>
                </div>

                <div>
                  <p className="key">{D_profitHistoryListHeader[5]}</p>

                  <span className="value">
                    <p>{v.received_amount}USDT</p>
                  </span>
                </div>

                <div>
                  <p className="key">{D_profitHistoryListHeader[6]}</p>

                  <span className="value">
                    <p>{v.using}USDT</p>
                  </span>
                </div>
              </li>
            ))}
          </ul>

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
        </MprofitHistory>
      </>
    );
  else
    return (
      <>
        <PprofitHistory>
          <div className="filterBar">
            <div className="filterBox">
              <span className="dateBox filterOpt">
                <DatePicker
                  selected={startDate}
                  onChange={dateChange}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  customInput={<ExampleCustomInput />}
                />
              </span>

              <span className="searchBox filterOpt">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Order"
                />
              </span>

              <button className="applyBtn" onClick={() => {}}>
                Apply
              </button>
            </div>

            <button className="exportBtn" onClick={onClickExcelBtn}>
              <img src={I_exportWhite} alt="" />
            </button>
          </div>

          <div className="listBox">
            <ul className="listHeader">
              {D_profitHistoryListHeader.map((v, i) => (
                <li key={i}>
                  <p>{v}</p>
                </li>
              ))}
            </ul>

            <ul className="list">
              {listData.map((v, i) => (
                <li key={i}>
                  <span>
                    <p>{v.referral_user.email}</p>
                  </span>

                  <span>
                    <p>{getTier(v.referral_user.level)}</p>
                  </span>

                  <span>
                    <p>{moment(v.createdat).format("YYYY-MM-DD")}</p>
                  </span>

                  <span>
                    <p>{v.betamount / 10 ** 6}</p>
                  </span>

                  <span>
                    <p>
                      <span className="price">${v.received_amount}</span>
                      &nbsp;
                      {`(${v.received_percent}%)`}
                    </p>
                  </span>

                  <span>
                    <p>{v.received_amount}USDT</p>
                  </span>

                  <span>
                    <p>{v.using}USDT</p>
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
        </PprofitHistory>
      </>
    );
}

const MprofitHistory = styled.div`
  .list {
    display: flex;
    flex-direction: column;

    li {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 24px 0;

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

        &.order {
          .value {
            gap: 6px;
          }
        }

        .key {
          flex: 1;
          color: rgba(255, 255, 255, 0.6);
        }

        .value {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          overflow: hidden;

          p {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }

          .price {
            color: #3fb68b;
          }
        }
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
`;

const PprofitHistory = styled.div`
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

        &.searchBox {
          input {
            flex: 1;

            &::placeholder {
              color: rgba(255, 255, 255, 0.4);
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
      align-items: center;
      width: 40px;
      height: 40px;
      border: 1px solid #3b3e45;
      border-radius: 50%;

      img {
        width: 20px;
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

          .price {
            color: #3fb68b;
          }
        }
      }
    }

    .listHeader li,
    .list li > span {
      display: flex;

      align-items: center;
      font-size: 14px;

      p {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      &:first-of-type {
        padding: 0 0 0 20px;
      }

      &:last-of-type {
        padding: 0 20px 0 0;
      }

      &:nth-of-type(1) {
        width: 236px;
        min-width: 236px;
      }

      &:nth-of-type(2) {
        width: 164px;
        min-width: 164px;
      }

      &:nth-of-type(3) {
        width: 188px;
        min-width: 188px;
      }

      &:nth-of-type(4) {
        width: 166px;
        min-width: 166px;
      }

      &:nth-of-type(5) {
        width: 156px;
        min-width: 156px;
      }

      &:nth-of-type(6) {
        width: 194px;
        min-width: 194px;
      }

      &:nth-of-type(7) {
        width: 146px;
        min-width: 146px;
        flex: 1;
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
`;
