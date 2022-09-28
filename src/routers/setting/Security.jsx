import { useEffect, useState } from "react";
import styled from "styled-components";
import { D_securityListHeader } from "../../data/D_setting";
import moment from "moment";
import I_ltArwWhite from "../../img/icon/I_ltArwWhite.svg";
import I_rtArwWhite from "../../img/icon/I_rtArwWhite.svg";
import { useSelector } from "react-redux";
import DefaultHeader from "../../components/header/DefaultHeader";
import axios from "axios";
import { API } from "../../configs/api";
import { useTranslation } from "react-i18next";

export default function Security() {
  const { t } = useTranslation();
  const isMobile = useSelector((state) => state.common.isMobile);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [tblData, setTblData] = useState([]);

  function getData() {
    axios
      .get(`${API.USER_QUERY}/loginhistories/${(page - 1) * 10}/10`)
      .then(({ data }) => {
        console.log(data.respdata);
        setTblData(data.respdata.rows);
        setTotal(data.respdata.count);
      });
  }

  function onClickPrePageBtn() {
    setPage(page - 1);
  }

  function onClickNextPageBtn() {
    setPage(page + 1);
  }

  useEffect(() => {
    getData();
  }, [page]);

  if (isMobile)
    return (
      <>
        <DefaultHeader title="Login History" />

        <MsecurityBox>
          <section className="innerBox">
            <article className="contArea">
              <div className="listBox">
                <ul className="list">
                  {tblData.map((v, i) => (
                    <li key={i}>
                      <div>
                        <p className="key">{t(D_securityListHeader[0])}</p>

                        <span className="value">
                          <p>
                            {moment(v.createdat).format("YYYY-MM-DD HH:mm:ss")}
                          </p>
                        </span>
                      </div>

                      <div>
                        <p className="key">{t(D_securityListHeader[1])}</p>

                        <span className="value">
                          <p>{v.ipaddress}</p>
                        </span>
                      </div>

                      <div>
                        <p className="key">{t(D_securityListHeader[2])}</p>

                        <span className="value">
                          <p>{v.deviceos}</p>
                        </span>
                      </div>

                      <div>
                        <p className="key">{t(D_securityListHeader[3])}</p>

                        <span className="value">
                          <p>{v.browser}</p>
                        </span>
                      </div>

                      <div>
                        <p className="key">{t(D_securityListHeader[4])}</p>

                        <span className="value">
                          <p>
                            {v.country} / {v.status}
                          </p>
                        </span>
                      </div>
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
        </MsecurityBox>
      </>
    );
  else
    return (
      <>
        <PsecurityBox>
          <section className="innerBox">
            <article className="titleArea">
              <strong className="title">{t("Login History")}</strong>
            </article>

            <article className="contArea">
              <div className="listBox">
                <ul className="listHeader">
                  {D_securityListHeader.map((v, i) => (
                    <li key={i}>{t(v)}</li>
                  ))}
                </ul>
                <ul className="list">
                  {tblData.map((v, i) => (
                    <li key={i}>
                      <span>
                        <p>
                          {moment(v.createdat).format("YYYY-MM-DD HH:mm:ss")}
                        </p>
                      </span>

                      <span>
                        <p>{v.ipaddress}</p>
                      </span>

                      <span>
                        <p>{v.deviceos}</p>
                      </span>

                      <span>
                        <p>{v.browser}</p>
                      </span>

                      <span>
                        <p>
                          {v.country} / {v.status}
                        </p>
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
        </PsecurityBox>
      </>
    );
}

const MsecurityBox = styled.main`
  height: 100%;

  .innerBox {
    display: flex;
    flex-direction: column;
    gap: 40px;
    height: 100%;
    padding: 0 0 20px;
    overflow-y: scroll;

    .contArea {
      .listBox {
        padding: 0 20px;
        overflow-x: scroll;

        .list {
          display: flex;
          flex-direction: column;

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

                img {
                  width: 12px;
                }

                .price {
                  color: #3fb68b;
                }
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
    }
  }
`;

const PsecurityBox = styled.main`
  flex: 1;
  padding: 70px 140px;

  @media (max-width: 1440px) {
    max-width: 1020px;
    padding: 70px 40px 70px 80px;
  }

  .innerBox {
    display: flex;
    flex-direction: column;
    gap: 40px;
    height: 100%;
    overflow-y: scroll;

    .titleArea {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 618px;

      .title {
        font-size: 24px;
      }

      .explain {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.6);
      }
    }

    .contArea {
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
            width: 284px;
            min-width: 284px;
          }

          &:nth-of-type(2) {
            width: 192px;
            min-width: 192px;
          }

          &:nth-of-type(3) {
            width: 300px;
            min-width: 226px;
          }

          &:nth-of-type(4) {
            width: 210px;
            min-width: 168px;
          }

          &:nth-of-type(5) {
            width: 190px;
            min-width: 190px;
            flex: 1;
          }

          &:nth-of-type(6) {
            width: 200px;
            min-width: 200px;
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
