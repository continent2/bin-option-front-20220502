import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import styled from "styled-components";
import I_x from "../../../img/icon/I_x.svg";
import I_xWhite from "../../../img/icon/I_xWhite.svg";

export default function AddressCopyPopup({ off, address, setToastStatus }) {
  const { t } = useTranslation();

  const isMobile = useSelector((state) => state.common.isMobile);

  const onClickCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setToastStatus(true);
      off();
    } catch (e) {
      console.error(e);
    }
  };

  if (isMobile)
    return (
      <MminimumDepositPopupBox className="defaultPopup">
        <article className="topArea">
          <span className="blank" />

          <p className="title">{t("Address Copy")}</p>

          <button className="exitBtn" onClick={() => off()}>
            <img src={I_xWhite} alt="" />
          </button>
        </article>

        <article className="contArea">
          <p className="explain">{address}</p>

          <div className="btnBox">
            <button className="confirmBtn" onClick={onClickCopyAddress}>
              {t("Copy")}
            </button>
          </div>
        </article>
      </MminimumDepositPopupBox>
    );
  else
    return (
      <PminimumDepositPopup className="defaultPopup">
        <article className="topArea">
          <span className="blank" />

          <p className="title">{t("Confirmation")}</p>

          <button className="exitBtn" onClick={() => off()}>
            <img src={I_x} alt="" />
          </button>
        </article>

        <article className="contArea">
          <p className="explain">{t("Minimum deposit is not enough")}</p>

          <div className="btnBox">
            <button className="confirmBtn">{t("Acknowledge")}</button>
          </div>
        </article>
      </PminimumDepositPopup>
    );
}

const MminimumDepositPopupBox = styled.section`
  width: 328px;
  max-height: 80vh;
  overflow-y: scroll;
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

    .exitBtn {
      img {
        width: 16px;
        opacity: 0.4;
      }
    }
  }

  .contArea {
    display: flex;
    flex-direction: column;
    gap: 22px;
    padding: 12px 24px 30px;

    .explain {
      font-size: 14px;
      text-align: center;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .btnBox {
      .confirmBtn {
        width: 100%;
        height: 50px;
        font-size: 16px;
        font-weight: 700;
        color: #4e3200;
        background: linear-gradient(99.16deg, #604719 3.95%, #f7ab1f 52.09%);
        border-radius: 8px;
      }
    }
  }
`;

const PminimumDepositPopup = styled.section`
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

    .exitBtn {
      img {
        width: 16px;
        opacity: 0.4;
      }
    }
  }

  .contArea {
    display: flex;
    flex-direction: column;
    gap: 44px;
    padding: 30px 40px 44px;

    .explain {
      font-size: 14px;
      text-align: center;
    }

    .btnBox {
      display: flex;
      align-items: center;
      gap: 20px;

      button {
        flex: 1;
        height: 56px;
        font-size: 18px;
        font-weight: 700;
        border-radius: 10px;

        &.confirmBtn {
          color: #4e3200;
          background: linear-gradient(99.16deg, #604719 3.95%, #f7ab1f 52.09%);
        }

        &.cancelBtn {
          color: #f7ab1f;
          border: 2px solid #f7ab1f;
        }
      }
    }
  }
`;
