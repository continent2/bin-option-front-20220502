import { forwardRef, useEffect, useState } from "react";
import styled from "styled-components";
import DatePicker, { registerLocale } from "react-datepicker";
import ko from "date-fns/locale/ko";
import "../../util/react-datepicker.css";
import I_calender from "../../img/icon/I_calender.svg";
import I_downloadWhite from "../../img/icon/I_downloadWhite.svg";
import I_ltArwWhite from "../../img/icon/I_ltArwWhite.svg";
import I_rtArwWhite from "../../img/icon/I_rtArwWhite.svg";
import moment from "moment";
import renderCustomHeader from "../../util/DatePickerHeader";
import { useSelector } from "react-redux";
import DefaultHeader from "../../components/header/DefaultHeader";
import axios from "axios";
import { API, URL } from "../../configs/api";
import { getExcelFile, setToast } from "../../util/Util";
import { D_ordersListHeader } from "../../data/D_finance";
import L_loader from "../../img/loader/L_loader.png";
import { getabistr_forfunction, reqTx } from "../../util/contractcall";
import contractaddr from "../../configs/contractaddr";
import { metaMaskLink } from "../../configs/metaMask";
import { io } from "socket.io-client";
import { useTranslation } from "react-i18next";
import ReactTooltip from "react-tooltip";
import AddPopup from "../../components/header/AddPopup";
import PopupBg from "../../components/common/PopupBg";
import OrderPopup from "../../components/finance/data/OrderPopup";

export default function Orders() {
  registerLocale("ko", ko);
  const { t } = useTranslation();

  const walletAddress = localStorage.getItem("walletAddress");

  const isMobile = useSelector((state) => state.common.isMobile);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [useDate, setUseDate] = useState(false);
  const [page, setPage] = useState(1);
  const [tblData, setTblData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loader, setLoader] = useState("");
  const [userData, setUserData] = useState({});
  const [orderPopup, setOrderPopup] = useState(false);
  const [kvsForex, setKvsForex] = useState({});
  const [uuids, setUuids] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);

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

  async function moDirectPayment(forex, data, i) {
    setLoader(i);

    window.open(
      `${metaMaskLink}/${
        contractaddr.USDT_BINOPT
      }/transfer?address=${walletAddress}&uint256=${
        data.localeAmount * forex
      }e6`
    );

    const socket = io(URL, {
      query: {
        token: localStorage.getItem("token"),
      },
    });

    socket.on("transactions", (res) => {
      console.log("transactions", res);

      if (res) {
        setToast({ type: "alarm", cont: "Submission Successful" });
        setTimeout(() => {
          window.location.reload(false);
        }, 3000);
      }
    });

    socket.emit(
      "transactions",
      { type: "USDT_BINOPT", txId: data.id },
      (res) => {
        console.log("emit", res);
      }
    );
  }

  async function directPayment(forex, data, i) {
    setLoader(i);

    let { ethereum } = window;
    let address = await ethereum.enable();
    console.log(address[0]);

    if (!ethereum) {
      alert("Install Metamask");
      return;
    }

    let abistr = getabistr_forfunction({
      contractaddress: contractaddr.USDT_BINOPT,
      abikind: "ERC20",
      methodname: "transfer",
      aargs: [walletAddress, data.localeAmount * forex + ""],
    });

    reqTx(
      {
        from: address[0],
        to: contractaddr.USDT_BINOPT,
        data: abistr,
        gas: 3000000,
      },
      (txHash) => {
        axios
          .patch(`${API.TRANSACTION_BRANCH_TRANSFER}`, {
            amount: data.localeAmount * forex * 10 ** 6,
            tokentype: "USDT_BINOPT",
            txhash: txHash,
            txId: data.id,
          })
          .then((resp) => {
            if (resp) {
              setToast({ type: "alarm", cont: "Submission Successful" });
              setTimeout(() => {
                window.location.reload(false);
              }, 3000);
            }
          })
          .catch((err) => {
            console.error(err);
          })
          .finally(() => setLoader(""));
      },
      setLoader("")
    );
  }

  function getForex(type) {
    return axios
      .get(`${API.QUERIES_FOREX}`, { params: { type } })
      .catch((err) => console.error(err));
  }

  async function getKvsForex() {
    try {
      const result = await axios.get(API.GET_QUERIES_FOREX);
      setKvsForex(result.data.list);
      console.log(result);
    } catch (e) {
      console.error(e);
    }
  }

  async function getTxRequests() {
    try {
      const result = await axios.get(
        `${API.GET_TXREQUEST}/${userData.id}/${(page - 1) * 10}/10/id/DESC`
      );
      console.log(result);
      console.log(result.data.list);
      setTotal(result.data.payload.count);
      setTblData(result.data.list);
    } catch (e) {
      console.error(e);
    }
  }

  async function onClickDepositBtn(data, i) {
    let forex;

    console.log(data);
    try {
      const forexRes = await getForex(`${data.localeUnit}/${data.unit}`);
      forex = forexRes.data.price;
      console.log(forex);
    } catch (err) {
      console.error(err);
      return;
    }

    if (isMobile) moDirectPayment(forex, data, i);
    else directPayment(forex, data, i);
  }

  function getData(arg) {
    let params = {};

    if (arg?.filter) {
      if (useDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      }
    }

    axios
      .get(API.TRANSACTION_BRANCH_LIST((page - 1) * 10, 10), {
        params,
      })
      .then(({ data }) => {
        let { respdata } = data;
        console.log(data);
        setTblData(respdata.rows);
        setTotal(respdata.count);
      });
  }

  function dateChange(dates) {
    const [start, end] = dates;
    setUseDate(true);

    setStartDate(start);
    setEndDate(end);
  }

  function onClickPrePageBtn() {
    if (page > 1) setPage(page - 1);
  }

  function onClickNextPageBtn() {
    setPage(page + 1);
  }

  function onClickOrder() {
    setOrderPopup(true);
  }

  function onClickAllCheckbox(e) {
    if (e.target.checked) {
      const newUuids = tblData.map((v, i) => {
        return v.uuid;
      });
      console.log(newUuids);
      setUuids(newUuids);
    } else {
      const newUUids = [];
      setUuids(newUUids);
    }
  }

  function onClickCheckbox(uuid) {
    if (uuids.includes(uuid)) {
      const newUuids = uuids.filter((v, i) => {
        return v !== uuid;
      });
      setUuids(newUuids);
    } else {
      const newUuids = uuids.concat(uuid);
      setUuids(newUuids);
    }
  }

  useEffect(() => {
    axios.get(`${API.AUTH}`).then(({ data }) => {
      console.log(data.result);
      setUserData(data.result);
    });
  }, []);

  useEffect(() => {
    getData();
  }, [page]);

  useEffect(() => {
    getKvsForex();
    getTxRequests();
  }, [userData]);

  useEffect(() => {
    console.log(uuids);
  }, [uuids]);

  useEffect(() => {
    const checkedTblData = tblData.map((v, i) => {
      if (uuids.includes(v.uuid)) {
        return (v.amount / kvsForex[`USD/${v.amountunit}`]).toLocaleString();
      } else {
        return 0;
      }
    });
    const totalQuantity = checkedTblData.reduce((a, b) => a + Number(b), 0);
    console.log(checkedTblData);
    console.log(totalQuantity);
    setTotalQuantity(totalQuantity);
  }, [uuids]);

  if (isMobile)
    return (
      <>
        <DefaultHeader title="Orders" />

        <MordersBox>
          <section className="innerBox">
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
                      customInput={<CustomInput />}
                    />
                  </span>

                  <button
                    className="applyBtn"
                    onClick={() => getData({ filter: true })}
                  >
                    {t("Apply")}
                  </button>
                </div>
              </div>

              <div className="listBox">
                <ul className="list">
                  {tblData[0] ? (
                    tblData.map((v, i) => (
                      <li key={i}>
                        <div>
                          <p className="key">{t(D_ordersListHeader[0])}</p>
                          <div className="value">
                            <p>
                              {v.uid}
                              {/* {v.user.email ||
                                (v.user.phone && `0${v.user.phone}`)} */}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="key">{t(D_ordersListHeader[1])}</p>
                          <div className="value">
                            {/* <p>{`${v.user.level} Level`}</p> */}
                            <p> {v.sendername}</p>
                          </div>
                        </div>

                        <div>
                          <p className="key">{t(D_ordersListHeader[2])}</p>
                          <div className="value">
                            {/* <p>{moment(v.createdat).format("YYYY-MM-DD")}</p> */}
                            <p>{v.useractiontimeunix}</p>
                          </div>
                        </div>

                        <div>
                          <p className="key">{t(D_ordersListHeader[3])}</p>
                          <div className="value">
                            <p>
                              {v.amount}
                              {/* {`¥${(v?.localeAmount / 10 ** 6)?.toLocaleString(
                                "cn",
                                "CN"
                              )}`} */}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="key">{t(D_ordersListHeader[4])}</p>
                          <div className="value">
                            <p>
                              {v.amountunit}
                              {/* {`${v?.cumulAmount?.toLocaleString(
                                "eu",
                                "US"
                              )}USDT`} */}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="key">{t(D_ordersListHeader[5])}</p>
                          <div className="value">
                            <p>
                              {(
                                v.amount / kvsForex[`USD/${v.amountunit}`]
                              ).toLocaleString()}
                              {/* {`${v.name || "-"}/${v.cardNum || "-"}`} */}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="key">{t(D_ordersListHeader[6])}</p>
                          <div className="value">
                            <p>{v.txmemo}</p>
                          </div>
                        </div>

                        <div>
                          <p className="key">{t(D_ordersListHeader[7])}</p>
                          <div className="value">
                            <span>
                              <input
                                type="checkbox"
                                className="m_checkbox"
                                onClick={() => onClickCheckbox(v.uuid)}
                                checked={uuids.includes(v.uuid)}
                              />
                            </span>
                            {/* <button
                              className={`${
                                loader === i && "loading"
                              } depositBtn`}
                              disabled={loader !== "" || v.txhash}
                              onClick={() => onClickDepositBtn(v, i)}
                            >
                              <p className="common">{t("Deposit")}</p>

                              <img className="loader" src={L_loader} alt="" />
                            </button> */}
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <p className="notFound">
                      {t("Nothing found or not yet calculated")}
                    </p>
                  )}
                </ul>
              </div>
              <div className="processBtn_cont">
                <button className="processBtn" onClick={onClickOrder}>
                  {t("처리하기")}
                </button>
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
          {orderPopup && (
            <>
              <OrderPopup
                off={setOrderPopup}
                totalQuantity={totalQuantity}
                uuids={uuids}
              />
              <PopupBg off={setOrderPopup} />
            </>
          )}
        </MordersBox>
      </>
    );
  else
    return (
      <PordersBox>
        <section className="innerBox">
          <strong className="pageTitle">{t("Orders")}</strong>

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
                    customInput={<CustomInput />}
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
                onClick={() => getExcelFile(tblData, "Orders")}
                data-tip="Downloading as an Excel file"
              >
                <img src={I_downloadWhite} alt="" />
                <ReactTooltip />
              </button>
            </div>

            <div className="listBox">
              <ul className="listHeader">
                {D_ordersListHeader.map((v, i) => (
                  <li key={i}>
                    <p>{t(v)}</p>
                  </li>
                ))}
                <li>
                  <input
                    type="checkbox"
                    onClick={(e) => onClickAllCheckbox(e)}
                  />
                </li>
              </ul>

              <ul className="list">
                {tblData.map((v, i) => (
                  <li key={i}>
                    <span>
                      <p>
                        {v.uid}

                        {/* {v.user.email || (v.user.phone && `0${v.user.phone}`)} */}
                      </p>
                    </span>

                    <span>
                      {/* <p>{`${v.user.level} Level`}</p> */}
                      <p> {v.sendername}</p>
                    </span>

                    <span>
                      {/* <p>{moment(v.createdat).format("YYYY-MM-DD")}</p> */}
                      <p>{v.useractiontimeunix}</p>
                    </span>

                    <span>
                      {v.amount}
                      {/* {`¥${(v?.localeAmount / 10 ** 6)?.toLocaleString(
                        "cn",
                        "CN"
                      )}`} */}
                    </span>

                    <span>
                      {/* <p>{`${v?.cumulAmount?.toLocaleString(
                        "eu",
                        "US"
                      )}USDT`}</p> */}
                      {v.amountunit}
                    </span>

                    <span>
                      {/* {(
                        v.amount / kvsForex[`USD/${v.amountunit}`]
                      ).toLocaleString()} */}
                      {(
                        v.amount / kvsForex[`USD/${v.amountunit}`]
                      ).toLocaleString()}
                    </span>
                    <span>
                      {/* <p>{`${v.name || "-"}/${v.cardNum || "-"}`}</p> */}
                      <p>{v.txmemo}</p>
                    </span>
                    {/* 
                    <span>
                      <button
                        className={`${loader === i && "loading"} depositBtn`}
                        disabled={loader !== "" || v.txhash}
                        onClick={() => onClickDepositBtn(v, i)}
                      >
                        <p className="common">{t("Deposit")}</p>

                        <img className="loader" src={L_loader} alt="" />
                      </button>
                    </span> */}
                    <span>
                      <input
                        type="checkbox"
                        onClick={() => onClickCheckbox(v.uuid)}
                        checked={uuids.includes(v.uuid)}
                      />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="caution">
              {t(
                "* 실제 충전 금액은 요청을 접수하시는 시점의 선택하신 화폐와 USD 간환율을 적용하여 반영됩니다"
              )}
            </p>
            <div className="orderBtn" onClick={onClickOrder}>
              <button>{t("처리하기")}</button>
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

        {orderPopup && (
          <>
            <OrderPopup
              off={setOrderPopup}
              totalQuantity={totalQuantity}
              uuids={uuids}
            />
            <PopupBg off={setOrderPopup} />
          </>
        )}
      </PordersBox>
    );
}

const MordersBox = styled.main`
  height: 100%;

  .innerBox {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: scroll;

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

                &.on {
                  color: #fff;
                }

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

            & > div {
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 14px;

              .m_checkbox {
                margin-top: 2px;
                width: 16px;
                height: 16px;
              }

              .key {
                color: rgba(255, 255, 255, 0.6);
              }

              .value {
                .depositBtn {
                  width: 64px;
                  height: 28px;
                  font-size: 12px;
                  font-weight: 700;
                  background: #f7ab1f;
                  border-radius: 6px;

                  &:disabled {
                    filter: brightness(50%);
                  }

                  .loader {
                    height: 20px;
                  }
                }
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

      .processBtn_cont {
        display: flex;
        justify-content: center;
        padding-top: 4px;
        .processBtn {
          width: 90%;
          height: 40px;
          font-size: 14px;
          font-weight: 700;
          border: 1px solid #3b3e45;
          border-radius: 20px;
          background: #f7ab1f;
          &:focus-within {
            border-color: #fff;
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

const PordersBox = styled.main`
  flex: 1;
  padding: 70px 140px 0;
  overflow-y: scroll;

  @media (max-width: 1440px) {
    max-width: 1020px;
    padding: 70px 40px 70px 80px;
  }

  .caution {
    font-size: 12px;
    color: #f7ab1f;
  }

  .innerBox {
    display: flex;
    flex-direction: column;
    gap: 40px;
    height: 100%;

    .pageTitle {
      height: 36px;
      font-size: 18px;
      font-weight: 700;
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
              padding: 0;

              .dateBtn {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 0 22px;

                &.on {
                  color: #fff;
                }

                img {
                  width: 16px;
                  height: 17px;
                }
              }

              .react-datepicker-popper {
                top: 10px !important;
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

              .depositBtn {
                width: 64px;
                height: 28px;
                font-size: 12px;
                font-weight: 700;
                background: #f7ab1f;
                border-radius: 6px;

                &:disabled {
                  filter: brightness(50%);
                }

                .loader {
                  height: 20px;
                }
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
            padding: 0 0 0 20px;
          }

          &:last-of-type {
            padding: 0 20px 0 0;
          }

          &:nth-of-type(1) {
            max-width: 138px;
            width: 100%;
          }

          &:nth-of-type(2) {
            max-width: 188px;
            width: 100%;
          }

          &:nth-of-type(3) {
            max-width: 238px;
            width: 100%;
          }

          &:nth-of-type(4) {
            max-width: 108px;
            width: 100%;
          }

          &:nth-of-type(5) {
            max-width: 168px;
            width: 100%;
          }

          &:nth-of-type(6) {
            max-width: 168px;
            width: 100%;
          }

          &:nth-of-type(7) {
            flex: 1;
          }

          &:nth-of-type(8) {
            width: 48px;
          }
        }

        .listHeader li {
          &:nth-of-type(8) {
            input {
              width: 18px;
              height: 18px;
              margin-left: -3px;
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
    }
  }
  .orderBtn {
    display: flex;
    justify-content: flex-end;
    button {
      width: 120px;
      height: 40px;
      font-size: 14px;
      font-weight: 700;
      border: 1px solid #3b3e45;
      border-radius: 20px;
    }
  }
`;
