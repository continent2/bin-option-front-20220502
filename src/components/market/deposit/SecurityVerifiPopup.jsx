import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import styled from "styled-components";
import I_x from "../../../img/icon/I_x.svg";
import I_xWhite from "../../../img/icon/I_xWhite.svg";

export default function SecurityVerifiPopup({ off, setBalancePopup }) {
  const { t } = useTranslation();

  const isMobile = useSelector((state) => state.common.isMobile);

  function onClickConfirmBtn() {
    setBalancePopup(true);
    off();
  }

  if (isMobile)
    return (
      <MsecurityVerifiPopupBox className="defaultPopup">
        <article className="topArea">
          <p className="title">{t("Security Verification")}</p>

          <button className="exitBtn" onClick={() => off()}>
            <img src={I_xWhite} alt="" />
          </button>
        </article>

        <article className="contArea">
          <p className="explain">
            {t(
              "Please enter the following conditions for this action to verify your account."
            )}
          </p>

          <button className="confirmBtn" onClick={onClickConfirmBtn}>
            {t("Confirm")}
          </button>
        </article>
      </MsecurityVerifiPopupBox>
    );
  else
    return (
      <PsecurityVerifiPopupBox className="defaultPopup">
        <article className="topArea">
          <span className="blank" />

          <p className="title">{t("Security Verification")}</p>

          <button className="exitBtn" onClick={() => off()}>
            <img src={I_x} alt="" />
          </button>
        </article>

        <article className="contArea">
          <p className="explain">
            {t(
              "Please enter the following conditions for this action to verify your account."
            )}
          </p>

          <button className="confirmBtn" onClick={onClickConfirmBtn}>
            {t("Confirm")}
          </button>
        </article>
      </PsecurityVerifiPopupBox>
    );
}

const MsecurityVerifiPopupBox = styled.section`
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
    }

    .confirmBtn {
      height: 50px;
      font-size: 16px;
      font-weight: 700;
      color: #4e3200;
      background: linear-gradient(99.16deg, #604719 3.95%, #f7ab1f 52.09%);
      border-radius: 8px;
    }
  }
`;

const PsecurityVerifiPopupBox = styled.section`
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
      opacity: 0.4;
    }
  }

  .contArea {
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding: 18px 30px 40px;

    .explain {
      font-size: 14px;
      text-align: center;
    }

    .confirmBtn {
      height: 56px;
      font-size: 18px;
      font-weight: 700;
      color: #4e3200;
      background: linear-gradient(99.16deg, #604719 3.95%, #f7ab1f 52.09%);
      border-radius: 12px;
    }
  }
`;
