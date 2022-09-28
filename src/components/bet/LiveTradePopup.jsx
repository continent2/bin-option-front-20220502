import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

export default function LiveTradePopup({ off }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isMobile = useSelector((state) => state.common.isMobile);

  function onClickDepositBtn() {
    navigate("/market/deposit");
    off();
  }

  function onClickDemoBtn() {
    navigate("/bet/demo");
    off();
  }

  if (isMobile)
    return (
      <MliveTradePopupBox className="defaultPopup">
        <p className="explain">
          {t(
            "Please first top up the balance to start Live Trading. (Minimum investment amount is $5)"
          )}
        </p>

        <div className="buttonBox">
          <button className="depositBtn" onClick={onClickDepositBtn}>
            {t("Deposit now")}
          </button>

          <button className="demoBtn" onClick={onClickDemoBtn}>
            {t("Demo trading")}
          </button>
        </div>
      </MliveTradePopupBox>
    );
  else
    return (
      <PliveTradePopupBox className="defaultPopup">
        <p className="explain">
          {t(
            "Please first top up the balance to start Live Trading. (Minimum investment amount is $5)"
          )}
        </p>

        <div className="buttonBox">
          <button className="depositBtn" onClick={onClickDepositBtn}>
            {t("Deposit now")}
          </button>

          <button className="demoBtn" onClick={onClickDemoBtn}>
            {t("Demo trading")}
          </button>
        </div>
      </PliveTradePopupBox>
    );
}

const MliveTradePopupBox = styled.section`
  width: 300px;
  font-size: 14px;
  color: #fff;
  border-radius: 14px;
  overflow: hidden;

  .explain {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 104px;
    padding: 0 45px;
    text-align: center;
  }

  .buttonBox {
    display: flex;
    border-top: 1px solid rgba(255, 255, 255, 0.2);

    button {
      flex: 1;
      height: 56px;
      font-size: 18px;
      font-weight: 700;
      color: #f7ab1f;

      &:nth-of-type(n + 2) {
        border-left: 1px solid rgba(255, 255, 255, 0.2);
      }
    }
  }
`;

const PliveTradePopupBox = styled.section`
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 440px;
  height: 230px;
  color: #fff;
  padding: 70px 30px 0;

  .explain {
    font-size: 16px;
    text-align: center;
  }

  .buttonBox {
    display: flex;
    gap: 16px;

    button {
      flex: 1;
      height: 56px;
      font-size: 18px;
      font-weight: 700;
      border-radius: 12px;

      &:nth-of-type(1) {
        color: #4e3200;
        background: linear-gradient(99.16deg, #604719 3.95%, #f7ab1f 52.09%);

        &:hover {
          filter: brightness(0.8);
        }
      }

      &:nth-of-type(n + 2) {
        color: #f7ab1f;
        border: 2px solid #f7ab1f;

        &:hover {
          background: rgba(247, 171, 31, 0.14);
        }
      }
    }
  }
`;
