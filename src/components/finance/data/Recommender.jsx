import styled from "styled-components";
import DatePicker from "react-datepicker";
import "../../../util/react-datepicker.css";
import { forwardRef, useEffect, useState } from "react";
import I_calender from "../../../img/icon/I_calender.svg";
import I_downloadWhite from "../../../img/icon/I_downloadWhite.svg";
import I_ltArwWhite from "../../../img/icon/I_ltArwWhite.svg";
import I_rtArwWhite from "../../../img/icon/I_rtArwWhite.svg";
import { D_recommenderListHeader } from "../../../data/D_finance";
import moment from "moment";
import { useSelector } from "react-redux";
import { getExcelFile, GetTierByLevel } from "../../../util/Util";
import axios from "axios";
import { API } from "../../../configs/api";
import { useTranslation } from "react-i18next";
import ReactTooltip from "react-tooltip";

export default function Recommender() {
  const { t } = useTranslation();
  const isMobile = useSelector((state) => state.common.isMobile);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [useDate, setUseDate] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [listData, setListData] = useState([]);

  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <button
      className={`${useDate && "on"} dateBtn`}
      onClick={onClick}
      ref={ref}
    >
      <img src={I_calender} alt="" />
      <p>{value}</p>
    </button>
  ));

  function onClickExcelBtn() {
    getExcelFile(listData, "Finance");
  }

  function dateChange(dates) {
    const [start, end] = dates;
    setUseDate(true);

    setStartDate(start);
    setEndDate(end);
  }

  function onClickPrePageBtn() {
    setPage(page - 1);
  }

  function onClickNextPageBtn() {
    setPage(page + 1);
  }

  function getData(arg) {
    let params = {};

    if (arg?.filter) {
      if (useDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      }
      params.searchkey = search;
    }

    axios
      .get(`${API.USER_BRANCH}/${(page - 1) * 8}/8/id/DESC`, { params })
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
        <MrecommenderBox>
          <ul className="list">
            {listData.map((v, i) => (
              <li key={i}>
                <div>
                  <p className="key">{t(D_recommenderListHeader[0])}</p>

                  <span className="value">
                    <p>{`${v.id}`.padStart(2, "0")}</p>
                  </span>
                </div>

                <div>
                  <p className="key">{t(D_recommenderListHeader[1])}</p>

                  <span className="value">
                    <p>{v.referral_user.email}</p>
                  </span>
                </div>

                <div>
                  <p className="key">{t(D_recommenderListHeader[2])}</p>

                  <span className="value">
                    <p>{v.referral_user.referercode}</p>
                  </span>
                </div>

                <div>
                  <p className="key">{t(D_recommenderListHeader[3])}</p>

                  <span className="value">
                    <p>{t(GetTierByLevel(v.referral_user.level)?.text)}</p>
                  </span>
                </div>

                <div>
                  <p className="key">{t(D_recommenderListHeader[4])}</p>

                  <span className="value">
                    <p>{v.total_deposit_amount}</p>
                  </span>
                </div>

                <div>
                  <p className="key">{t(D_recommenderListHeader[5])}</p>

                  <span className="value">
                    <p>{v.total_withdraw_amount}</p>
                  </span>
                </div>

                <div>
                  <p className="key">{t(D_recommenderListHeader[6])}</p>

                  <span className="value">
                    <p>{v.possess}</p>
                  </span>
                </div>

                <div>
                  <p className="key">{t(D_recommenderListHeader[7])}</p>

                  <span className="value">
                    <p>{v.trade_amount}</p>
                  </span>
                </div>

                <div>
                  <p className="key">{t(D_recommenderListHeader[8])}</p>

                  <span className="value">
                    <p>{moment(v.createdat).format("YYYY-MM-DD")}</p>
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
        </MrecommenderBox>
      </>
    );
  else
    return (
      <>
        <PrecommenderBox>
          <div className="filterBar">
            <div className="filterBox">
              <span className="dateBox filterOpt">
                <DatePicker
                  selected={startDate}
                  onChange={dateChange}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  customInput={<CustomInput />}
                />
              </span>

              <span className="searchBox filterOpt">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("Account, Recommender, Level")}
                />
              </span>

              <button
                className="applyBtn"
                onClick={() => getData({ filter: true })}
              >
                {t("Apply")}
              </button>
            </div>

            <button
              className="exportBtn"
              onClick={onClickExcelBtn}
              data-tip="Downloading as an Excel file"
            >
              <img src={I_downloadWhite} alt="" />
              <ReactTooltip />
            </button>
          </div>

          <div className="listBox">
            <ul className="listHeader">
              {D_recommenderListHeader.map((v, i) => (
                <li key={i}>
                  <p>{t(v)}</p>
                </li>
              ))}
            </ul>

            <ul className="list">
              {listData.map((v, i) => (
                <li key={i}>
                  <span>
                    <p>{`${v.id}`.padStart(2, "0")}</p>
                  </span>

                  <span>
                    <p>{v.referral_user.email}</p>
                  </span>

                  <span>
                    <p>{v.referral_user.referercode}</p>
                  </span>

                  <span>
                    <p>{t(GetTierByLevel(v.referral_user.level)?.text)}</p>
                  </span>

                  <span>
                    <p>{v.total_deposit_amount}</p>
                  </span>

                  <span>
                    <p>{v.total_withdraw_amount}</p>
                  </span>

                  <span>
                    <p>{v.possess}</p>
                  </span>

                  <span>
                    <p>{v.trade_amount}</p>
                  </span>

                  <span>
                    <p>{moment(v.createdat).format("YYYY-MM-DD")}</p>
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
        </PrecommenderBox>
      </>
    );
}

const MrecommenderBox = styled.div`
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

const PrecommenderBox = styled.div`
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

            &.on {
              color: #fff;
            }

            img {
              width: 16px;
              height: 17px;
            }
          }
        }

        &.searchBox {
          input {
            flex: 1;
            color: #fff;

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
        height: 20px;
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
        padding: 0 0 0 20px;
      }

      &:last-of-type {
        padding: 0 20px 0 0;
      }

      &:nth-of-type(1) {
        width: 60px;
        min-width: 60px;
      }

      &:nth-of-type(2) {
        width: 200px;
        min-width: 200px;
      }

      &:nth-of-type(3) {
        width: 130px;
        min-width: 130px;
      }

      &:nth-of-type(4) {
        width: 130px;
        min-width: 130px;
      }

      &:nth-of-type(5) {
        width: 140px;
        min-width: 140px;
      }

      &:nth-of-type(6) {
        width: 140px;
        min-width: 140px;
      }

      &:nth-of-type(7) {
        width: 140px;
        min-width: 140px;
      }

      &:nth-of-type(8) {
        width: 162px;
        min-width: 162px;
      }

      &:nth-of-type(9) {
        flex: 1;
        width: 162px;
        min-width: 162px;
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
