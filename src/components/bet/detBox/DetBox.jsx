import { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { D_detCategoryList } from "../../../data/D_bet";
import Closed from "./Closed";
import Opened from "./Opened";
import I_xWhite from "../../../img/icon/I_xWhite.svg";
import { useTranslation } from "react-i18next";

export default function DetBox({ off, mode, page, socket }) {
  const { t } = useTranslation();
  const isMobile = useSelector((state) => state.common.isMobile);

  const [detCategory, setDetCategory] = useState(D_detCategoryList[0]);

  console.log("page", page.toUpperCase());

  if (isMobile)
    return (
      <MdetBoxCont>
        {detCategory === "Opened" && <Opened page={page} socket={socket} />}
        {detCategory === "Closed" && <Closed page={page} />}

        <ul className="detCategoryList">
          {D_detCategoryList.map((v, i) => (
            <li
              key={i}
              className={`${detCategory === v && "on"}`}
              onClick={() => setDetCategory(v)}
            >
              {t(v)}
            </li>
          ))}
        </ul>

        <footer>
          <button className="exitBtn" onClick={() => off()}>
            <img src={I_xWhite} alt="" />
          </button>

          <strong className="explain">{t("Trading history")}</strong>
        </footer>
      </MdetBoxCont>
    );
  else
    return (
      <PdetBoxCont className={`${mode && "on"}`}>
        <ul className="detCategoryList">
          {D_detCategoryList.map((v, i) => (
            <li
              key={i}
              className={`${detCategory === v && "on"}`}
              onClick={() => setDetCategory(v)}
            >
              {t(v)}
            </li>
          ))}
        </ul>

        {detCategory === "Opened" && <Opened page={page} socket={socket} />}
        {detCategory === "Closed" && <Closed page={page} />}
      </PdetBoxCont>
    );
}

const MdetBoxCont = styled.div`
  display: flex;
  flex-direction: column;
  color: #fff;
  background: #0a0e17;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  position: fixed;
  z-index: 6;

  .detCategoryList {
    display: flex;
    border-top: 1px solid rgba(255, 255, 255, 0.2);

    li {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 56px;
      font-size: 18px;
      color: rgba(255, 255, 255, 0.2);
      cursor: pointer;

      &.on {
        color: #fff;
        background: #111722;
      }
    }
  }

  .detContList {
    flex: 1;
    padding: 14px 20px;
    background: #111722;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }

  footer {
    display: flex;
    align-items: center;
    height: 56px;
    border-top: 1px solid rgba(255, 255, 255, 0.2);

    .exitBtn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 62px;
      height: 100%;

      img {
        width: 16px;
      }
    }

    .explain {
      padding: 0 20px;
      margin: 12px 0;
      font-size: 16px;
      color: rgba(255, 255, 255, 0.6);
      border-left: 1px solid rgba(255, 255, 255, 0.2);
    }
  }
`;

const PdetBoxCont = styled.div`
  display: flex;
  flex-direction: column;
  width: 0;
  height: 100%;
  color: #fff;
  transition: all 0.3s;
  overflow: hidden;

  &.on {
    width: 300px;
    margin: 0 0 0 10px;
  }

  .detCategoryList {
    display: flex;

    li {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 38px;
      font-size: 16px;
      color: rgba(255, 255, 255, 0.2);
      border-radius: 12px 12px 0px 0px;
      cursor: pointer;

      &.on {
        color: #fff;
        background: #181c25;
      }
    }
  }

  .detContList {
    flex: 1;
    padding: 14px 20px;
    background: #181c25;
    border-radius: 0 0 12px 12px;
  }
`;
