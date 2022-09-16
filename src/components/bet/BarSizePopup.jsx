import styled from "styled-components";
import { D_timeList } from "../../data/D_bet";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

export default function BarSizePopup({ off, chartOpt, setChartOpt }) {
  const { t } = useTranslation();
  const isMobile = useSelector((state) => state.common.isMobile);

  function onClickTimeBtn(v) {
    let _chartOpt = chartOpt;

    _chartOpt.barSizeStr = v.key;
    _chartOpt.barSize = v.value;
    setChartOpt({ ..._chartOpt });
  }

  if (isMobile)
    return (
      <MbarSizePopupBox>
        <p className="key">{t("Time frames")}</p>

        <ul className="value">
          {D_timeList.map((v, i) => (
            <li
              key={i}
              className={`${chartOpt.barSize === v.value && "on"}`}
              onClick={() => onClickTimeBtn(v)}
            >
              <strong>{v.key}</strong>
            </li>
          ))}
        </ul>
      </MbarSizePopupBox>
    );
  else
    return (
      <PbarSizePopupBox>
        <p className="key">{t("Time frames")}</p>

        <ul className="value">
          {D_timeList.map((v, i) => (
            <li
              key={i}
              className={`${chartOpt.barSize === v.value && "on"}`}
              onClick={() => onClickTimeBtn(v)}
            >
              <strong>{v.key}</strong>
            </li>
          ))}
        </ul>
      </PbarSizePopupBox>
    );
}

const MbarSizePopupBox = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 146px;
  padding: 20px;
  color: rgba(255, 255, 255, 0.4);
  background: #22262e;
  border-radius: 20px;
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  box-shadow: drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.8));
  top: 46px;
  position: absolute;
  z-index: 6;

  .key {
    font-size: 14px;
  }

  .value {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    li {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 48px;
      height: 34px;
      font-size: 16px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      cursor: pointer;

      &.on {
        color: #fff;
        background: rgba(255, 255, 255, 0.1);
        border-color: #fff;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.4);
      }
    }
  }
`;

const PbarSizePopupBox = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 146px;
  padding: 20px;
  color: rgba(255, 255, 255, 0.4);
  background: #22262e;
  border-radius: 20px;
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  box-shadow: drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.8));
  top: 46px;
  position: absolute;
  z-index: 6;

  .key {
    font-size: 14px;
  }

  .value {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    li {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 48px;
      height: 34px;
      font-size: 16px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      cursor: pointer;

      &.on {
        color: #fff;
        background: rgba(255, 255, 255, 0.1);
        border-color: #fff;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.4);
      }
    }
  }
`;
