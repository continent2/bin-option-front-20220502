import axios from "axios";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { API } from "../../../configs/api";
import { nettype } from "../../../configs/nettype";
import I_xWhite from "../../../img/icon/I_xWhite.svg";

export default function OrderPopup({ off, totalQuantity, uuids }) {
  const { t } = useTranslation();
  const isMobile = useSelector((state) => state.common.isMobile);

  const [txhash, setTxshash] = useState("");
  const [amount, setAmount] = useState("");
  const token = localStorage.getItem("token");

  //   function onClickAddBtn() {
  //     axios
  //       .patch(API.TRANS_DEMO_FUND(amount * 10 ** 6))
  //       .then((res) => {
  //         console.log(res);
  //         window.location.reload();
  //       })
  //       .catch((err) => console.error(err));
  //   }

  async function onClickConfirm() {
    const orderRequest = {
      txhash,
      amount: totalQuantity,
      arrorderuuids: uuids,
    };
    console.log(orderRequest);
    try {
      const result = await axios.post(API.POST_ORDER_REQUEST, orderRequest, {
        headers: {
          Authorization: token,
        },
      });
      console.log(result);
      if (result.data.status === "OK") {
        off();
      }
    } catch (e) {
      console.error(e);
    }
  }

  if (isMobile)
    return (
      <MaddPopupBox className="defaultPopup">
        <article className="topArea">
          <span className="blank" />

          <p className="title">{t("Confirm")}</p>

          <button className="exitBtn" onClick={() => off()}>
            <img src={I_xWhite} alt="" />
          </button>
        </article>

        <article className="contArea">
          <div className="inputCont">
            <p className="key">{t("txhash")}</p>
            <div className="value">
              <input
                type="text"
                value={txhash}
                onChange={(e) => setTxshash(e.target.value)}
                placeholder=""
              />

              <p className="unit"></p>
            </div>
          </div>
          <div className="inputCont">
            <p className="key">{t("Quantity")}</p>
            <div className="value">
              <input
                type={"number"}
                value={totalQuantity}
                onChange={(e) => setAmount(e.target.value)}
                placeholder=""
              />

              <p className="unit">USDT</p>
            </div>
          </div>
          <div className="inputCont">
            <p className="key">{t("nettype")}</p>
            <div className="value">
              <input
                type="text"
                value={nettype}
                // onChange={(e) => setAmount(e.target.value)}
                placeholder=""
              />

              <p className="unit"></p>
            </div>
          </div>

          <button className="addBtn" onClick={onClickConfirm}>
            {t("Make a request")}
          </button>
        </article>
      </MaddPopupBox>
    );
  else
    return (
      <PaddPopupBox className="defaultPopup">
        <article className="topArea">
          <span className="blank" />

          <p className="title">{t("Confirm")}</p>

          <button className="exitBtn" onClick={() => off()}>
            <img src={I_xWhite} alt="" />
          </button>
        </article>

        <article className="contArea">
          <div className="inputCont">
            <p className="key">{t("txhash")}</p>
            <div className="value">
              <input
                type="text"
                value={txhash}
                onChange={(e) => setTxshash(e.target.value)}
                placeholder=""
              />

              <p className="unit"></p>
            </div>
          </div>
          <div className="inputCont">
            <p className="key">{t("Quantity")}</p>
            <div className="value">
              <input
                type={"number"}
                value={totalQuantity}
                onChange={(e) => setAmount(e.target.value)}
                placeholder=""
              />

              <p className="unit">USDT</p>
            </div>
          </div>
          <div className="inputCont">
            <p className="key">{t("nettype")}</p>
            <div className="value">
              <input
                type="text"
                value={nettype}
                // onChange={(e) => setAmount(e.target.value)}
                placeholder=""
              />

              <p className="unit"></p>
            </div>
          </div>

          <button className="addBtn" onClick={onClickConfirm}>
            {t("Make a request")}
          </button>
        </article>
      </PaddPopupBox>
    );
}

const MaddPopupBox = styled.section`
  width: 328px;
  color: #fff;

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
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 10px 24px 30px;

    .inputCont {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;

      .key {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.4);
      }

      .value {
        display: flex;
        align-items: center;
        width: 100%;
        height: 40px;
        padding: 0 20px;
        font-size: 14px;
        background: rgba(0, 0, 0, 0.4);
        border: 1.4px solid transparent;
        border-radius: 6px;

        &:focus-within {
          border-color: rgba(247, 171, 31, 0.4);
        }

        input {
          flex: 1;
        }
      }
    }

    .addBtn {
      height: 50px;
      font-size: 18px;
      font-weight: 700;
      color: #4e3200;
      background: linear-gradient(99.16deg, #604719 3.95%, #f7ab1f 52.09%);
      border-radius: 8px;
    }
  }
`;

const PaddPopupBox = styled.section`
  width: 380px;
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
    display: flex;
    flex-direction: column;
    gap: 40px;
    padding: 14px 30px 40px;

    .inputCont {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;

      .key {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.4);
      }

      .value {
        display: flex;
        align-items: center;
        width: 100%;
        height: 44px;
        padding: 0 20px;
        font-size: 16px;
        background: rgba(0, 0, 0, 0.4);
        border: 1.4px solid transparent;
        border-radius: 10px;

        &:focus-within {
          border-color: rgba(247, 171, 31, 0.4);
        }

        input {
          flex: 1;
        }
      }
    }

    .addBtn {
      height: 56px;
      font-size: 18px;
      font-weight: 700;
      color: #4e3200;
      background: linear-gradient(99.16deg, #604719 3.95%, #f7ab1f 52.09%);
      border-radius: 12px;
    }
  }
`;
