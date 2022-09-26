import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import I_x from "../../img/icon/I_x.svg";
import I_langGray from "../../img/icon/I_langGray.svg";
import L_yellow from "../../img/logo/L_yellow.svg";
import PopupBg from "../common/PopupBg";
import SelLngPopup from "./SelLngPopup";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function AuthPopup({ off }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [lngPopup, setLngPopup] = useState(false);

  function onclickNavBtn(url) {
    navigate(url);
    off();
  }

  return (
    <>
      <AuthPopupBox>
        <article className="topArea">
          <button className="logoBtn" onClick={() => navigate("/")}>
            <img src={L_yellow} alt="" />
          </button>

          <button className="exitBtn" onClick={() => off()}>
            <img src={I_x} alt="" />
          </button>
        </article>

        <article className="contArea">
          <div className="btnBox">
            <button
              className="loginBtn"
              onClick={() => onclickNavBtn("/auth/login")}
            >
              {t("Login")}
            </button>

            <button
              className="registerBtn"
              onClick={() => onclickNavBtn("/auth/signup")}
            >
              {t("Register")}
            </button>
          </div>

          <span className="lngBox">
            <button className="lngBtn" onClick={() => setLngPopup(true)}>
              <img src={I_langGray} alt="" />
            </button>
          </span>
        </article>
      </AuthPopupBox>

      {lngPopup && (
        <>
          <SelLngPopup white off={setLngPopup} />
          <PopupBg off={setLngPopup} />
        </>
      )}
    </>
  );
}

const AuthPopupBox = styled.section`
  display: flex;
  flex-direction: column;
  background: #fff;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  position: fixed;
  z-index: 6;

  .topArea {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 56px;
    padding: 0 20px;

    .logoBtn {
      display: flex;
      align-items: center;

      img {
        height: 18px;
      }
    }

    .exitBtn {
      img {
        width: 18px;
      }
    }
  }

  .contArea {
    flex: 1;
    padding: 40px 16px 0;

    .btnBox {
      display: flex;
      flex-direction: column;
      gap: 12px;

      button {
        height: 50px;
        font-size: 16px;
        font-weight: 700;
        border-radius: 8px;

        &.loginBtn {
          color: #f7ab1f;
          border: 1px solid #f7ab1f;
        }

        &.registerBtn {
          color: #4e3200;
          background: linear-gradient(98.13deg, #604719 -9.29%, #f7ab1f 45.07%);
        }
      }
    }

    .lngBox {
      bottom: 20px;
      right: 20px;
      position: fixed;

      .lngBtn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 36px;
        aspect-ratio: 1;
        background: #e6e6e6;
        border-radius: 50%;

        img {
          width: 20px;
        }
      }
    }
  }
`;
