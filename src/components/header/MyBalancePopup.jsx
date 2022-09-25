import { useEffect, useState } from "react";
import styled from "styled-components";
import I_xWhite from "../../img/icon/I_xWhite.svg";
import I_chkOrange from "../../img/icon/I_chkOrange.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { API } from "../../configs/api";
import { useTranslation } from "react-i18next";
import { setBalanceType } from "../../reducers/common";

export default function MyBalancePopup({ off, setAddPopup }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const isMobile = useSelector((state) => state.common.isMobile);
  const balanceType = localStorage.getItem("balanceType");
  const demoToken = localStorage.getItem("demoToken");

  const [stateBalanceType, setStateBalanceType] = useState(
    balanceType || "Demo"
  );
  const [balanceData, setBalanceData] = useState("");

  function onClickConfirmBtn({ nextProc, isNotNavigate }) {
    off();

    // if (demoToken) {
    //   navigate("/auth");
    //   return;
    // }

    if (isNotNavigate) nextProc(true);
    else navigate("/market/deposit");
  }

  function getBalance() {
    axios
      .get(`${API.USER_BALANCE}`)
      .then(({ data }) => {
        console.log(data.respdata);
        setBalanceData(data.respdata);
      })
      .catch((err) => console.error(err));
  }

  function onClickBalanceType(type) {
    setStateBalanceType(type);
    localStorage.setItem("balanceType", type);

    if (location.pathname.split("/")[1] === "bet") navigate(`/bet/${type}`);
  }

  useEffect(() => {
    getBalance();
  }, []);

  if (isMobile)
    return (
      <MmyBalancePopup className="defaultPopup">
        <article className="topArea">
          <span className="blank" />

          <p className="title">{t("My balance")}</p>

          <button className="exitBtn" onClick={() => off()}>
            <img src={I_xWhite} alt="" />
          </button>
        </article>

        <article className="contArea">
          <div className="targetBox">
            <div className="leftBox">
              <p className="type">{t(`${stateBalanceType} balance`)}</p>
              <p className="balance">
                {stateBalanceType === "Live" &&
                  (balanceData?.LIVE?.avail / 10 ** 6 || "0")}
                {stateBalanceType === "Demo" &&
                  (balanceData?.DEMO?.avail / 10 ** 6 || "0")}{" "}
                USDT
              </p>
              <p className="type"></p>
            </div>

            {stateBalanceType === "Live" && (
              <button
                className="actionBtn"
                onClick={() =>
                  onClickConfirmBtn({
                    nextProc: navigate("/market/deposit"),
                    isNotNavigate: false,
                  })
                }
              >
                {t("Deposit")}
              </button>
            )}

            {stateBalanceType === "Demo" && (
              <button
                className="actionBtn"
                onClick={() =>
                  onClickConfirmBtn({
                    nextProc: setAddPopup,
                    isNotNavigate: true,
                  })
                }
              >
                {t("Add")}
              </button>
            )}
          </div>

          <ul className="typeList">
            <li
              className={`${stateBalanceType === "Live" && "on"}`}
              onClick={() => onClickBalanceType("Live")}
            >
              <img src={I_chkOrange} alt="" />
              <p className="key">{t("Live balance")}</p>

              <strong className="value">{`${
                balanceData?.LIVE?.avail / 10 ** 6 || "0"
              } USDT`}</strong>
            </li>

            <li
              className={`${stateBalanceType === "Demo" && "on"}`}
              onClick={() => onClickBalanceType("Demo")}
            >
              <img src={I_chkOrange} alt="" />
              <p className="key">{t("Demo balance")}</p>

              <strong className="value">{`${
                balanceData?.DEMO?.avail / 10 ** 6 || "0"
              } USDT`}</strong>
            </li>
          </ul>
        </article>
      </MmyBalancePopup>
    );
  else
    return (
      <PmyBalancePopup className="defaultPopup">
        <article className="topArea">
          <span className="blank" />

          <p className="title">{t("My balance")}</p>

          <button className="exitBtn" onClick={() => off()}>
            <img src={I_xWhite} alt="" />
          </button>
        </article>

        <article className="contArea">
          <div className="targetBox">
            <div className="leftBox">
              <p className="type">{t(`${stateBalanceType} balance`)}</p>
              <p className="balance">
                {stateBalanceType === "Live" &&
                  (balanceData?.LIVE?.avail / 10 ** 6 || "0")}
                {stateBalanceType === "Demo" &&
                  (balanceData?.DEMO?.avail / 10 ** 6 || "0")}{" "}
                USDT
              </p>
              <p className="type"></p>
            </div>

            {stateBalanceType === "Live" && (
              <button
                className="actionBtn"
                onClick={() =>
                  onClickConfirmBtn({
                    nextProc: navigate("/market/deposit"),
                    isNotNavigate: false,
                  })
                }
              >
                {t("Deposit")}
              </button>
            )}

            {stateBalanceType === "Demo" && (
              <button
                className="actionBtn"
                onClick={() =>
                  onClickConfirmBtn({
                    nextProc: setAddPopup,
                    isNotNavigate: true,
                  })
                }
              >
                {t("Add")}
              </button>
            )}
          </div>

          <ul className="typeList">
            <li
              className={`${stateBalanceType === "Live" && "on"}`}
              onClick={() => onClickBalanceType("Live")}
            >
              <img src={I_chkOrange} alt="" />
              <p className="key">{t("Live balance")}</p>

              <strong className="value">{`${
                balanceData?.LIVE?.avail / 10 ** 6 || "0"
              } USDT`}</strong>
            </li>

            <li
              className={`${stateBalanceType === "Demo" && "on"}`}
              onClick={() => onClickBalanceType("Demo")}
            >
              <img src={I_chkOrange} alt="" />
              <p className="key">{t("Demo balance")}</p>

              <strong className="value">{`${
                balanceData?.DEMO?.avail / 10 ** 6 || "0"
              } USDT`}</strong>
            </li>
          </ul>
        </article>
      </PmyBalancePopup>
    );
}

const MmyBalancePopup = styled.section`
  width: 328px;
  max-height: 80vh;
  overflow-y: scroll;
  color: #fff;
  z-index: 7;

  .topArea {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    padding: 0 30px;

    .title {
      font-size: 16px;
    }

    .blank,
    .exitBtn img {
      width: 16px;
    }
  }

  .contArea {
    padding: 10px 24px 30px;

    .targetBox {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 72px;

      .leftBox {
        display: flex;
        flex-direction: column;
        gap: 2px;

        .type {
          font-size: 12px;
          height: 16px;
        }

        .balance {
          font-size: 18px;
        }
      }

      .actionBtn {
        width: 82px;
        height: 30px;
        font-size: 14px;
        font-weight: 700;
        background: rgba(255, 255, 255, 0.1);
        border: 1.4px solid #fff;
        border-radius: 20px;

        &:hover {
          color: #f7ab1f;
          background: rgba(247, 171, 31, 0.1);
          border-color: #f7ab1f;
          box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.4);
        }
      }
    }

    .typeList {
      display: flex;
      flex-direction: column;
      gap: 8px;

      li {
        display: flex;
        align-items: center;
        gap: 14px;
        height: 40px;
        padding: 0 20px;
        font-size: 14px;
        background: rgba(0, 0, 0, 0.4);
        border: 1.4px solid transparent;
        border-radius: 6px;
        cursor: pointer;

        &.on {
          border-color: rgba(247, 171, 31, 0.4);

          img {
            opacity: 1;
          }
        }

        img {
          opacity: 0;
          width: 18px;
        }

        .key {
        }

        .value {
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
`;

const PmyBalancePopup = styled.section`
  width: 500px;
  color: #fff;

  .topArea {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 70px;
    padding: 0 30px;

    .title {
      font-size: 18px;
    }

    .blank,
    .exitBtn img {
      width: 16px;
    }
  }

  .contArea {
    padding: 30px 40px 60px;

    .targetBox {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100px;

      .leftBox {
        display: flex;
        flex-direction: column;
        gap: 6px;

        .type {
          font-size: 14px;
          height: 18px;
        }

        .balance {
          font-size: 24px;
        }
      }

      .actionBtn {
        height: 40px;
        padding: 0 20px;
        font-size: 16px;
        font-weight: 700;
        background: rgba(255, 255, 255, 0.1);
        border: 1.4px solid #fff;
        border-radius: 20px;

        &:hover {
          color: #f7ab1f;
          background: rgba(247, 171, 31, 0.1);
          border-color: #f7ab1f;
          box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.4);
        }
      }
    }

    .typeList {
      display: flex;
      flex-direction: column;
      gap: 10px;

      li {
        display: flex;
        align-items: center;
        gap: 10px;
        height: 48px;
        padding: 0 24px;
        font-size: 16px;
        background: rgba(0, 0, 0, 0.4);
        border: 1.4px solid transparent;
        border-radius: 10px;
        cursor: pointer;

        &.on {
          border-color: rgba(247, 171, 31, 0.4);

          img {
            opacity: 1;
          }
        }

        img {
          opacity: 0;
          width: 18px;
        }

        .key {
          flex: 1;
        }

        .value {
        }
      }
    }
  }
`;
