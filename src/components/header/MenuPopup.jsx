import styled from "styled-components";
import MyBalancePopup from "./MyBalancePopup";
import AddPopup from "./AddPopup";
import PopupBg from "../common/PopupBg";
import ProfPopup from "./ProfPopup";
import { Fragment, useState } from "react";
import { D_headerList } from "../../data/D_header";
import I_dnPolWhite from "../../img/icon/I_dnPolWhite.svg";
import I_xWhite from "../../img/icon/I_xWhite.svg";
import L_yellow from "../../img/logo/L_yellow.svg";
import I_langWhite from "../../img/icon/I_langWhite.svg";
import I_quesCircleWhite from "../../img/icon/I_quesCircleWhite.svg";
import I_defaultProfImg from "../../img/icon/I_defaultProfImg.svg";
import { useNavigate } from "react-router-dom";
import SelLngPopup from "./SelLngPopup";
import { useTranslation } from "react-i18next";

export default function MenuPopup({ off, userData, balance }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const balanceType = localStorage.getItem("balanceType");

  console.log(userData);
  console.log("balance", balance);

  const [lngPopup, setLngPopup] = useState(false);
  const [profPopup, setProfPopup] = useState(false);
  const [myBalancePopup, setMyBalancePopup] = useState(false);
  const [addPopup, setAddPopup] = useState(false);

  function onClickLogoBtn() {
    navigate("/");
    off();
  }

  function onClickNav(url) {
    navigate(url);
    off();
  }

  function onClickLogOutBtn() {
    localStorage.removeItem("token");
    window.location.reload();
  }

  function onClickLoginBtn() {
    navigate("/auth");
    off();
  }

  return (
    <>
      <MenuPopupBox>
        <article className="topArea">
          <button className="logoBtn" onClick={onClickLogoBtn}>
            <img src={L_yellow} alt="" />
          </button>

          {token ? (
            <button className="myBtn" onClick={() => setProfPopup(true)}>
              <img src={I_defaultProfImg} alt="" />
            </button>
          ) : (
            <></>
          )}
        </article>

        <article className="contArea">
          <ul className="navList">
            {D_headerList.map((v, i) =>
              v.key === "Finance" &&
              userData.isadmin !== 1 &&
              userData.isadmin !== 3 ? (
                <Fragment key={i} />
              ) : v.det ? (
                <li key={i}>
                  <details>
                    <summary>
                      <strong className="title">{t(v.key)}</strong>
                      <img src={I_dnPolWhite} alt="" />
                    </summary>

                    <ul className="detNavList">
                      {v.det.map((detV, i) => (
                        <li key={i} onClick={() => onClickNav(detV.url)}>
                          {t(detV.key)}
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              ) : (
                <button
                  key={i}
                  className="navBtn"
                  onClick={() => navigate(v.url)}
                >
                  <strong className="title">{t(v.key)}</strong>
                </button>
              )
            )}
          </ul>

          <span className="btnBox">
            <span className="posBox">
              <button className="lngBtn" onClick={() => setLngPopup(true)}>
                <img src={I_langWhite} alt="" />
              </button>
            </span>

            <button className="quesBtn" onClick={() => navigate("/qna")}>
              <img src={I_quesCircleWhite} alt="" />
            </button>
          </span>
        </article>

        <footer>
          <article className="leftArea">
            <button className="exitBtn" onClick={() => off()}>
              <img src={I_xWhite} alt="" />
            </button>

            <strong className="explain">{t("Menu")}</strong>
          </article>

          {token ? (
            <button className="authBtn" onClick={onClickLogOutBtn}>
              Logout
            </button>
          ) : (
            <button className="authBtn" onClick={onClickLoginBtn}>
              Login
            </button>
          )}
        </footer>
      </MenuPopupBox>

      {myBalancePopup && (
        <>
          <MyBalancePopup off={setMyBalancePopup} setAddPopup={setAddPopup} />
          <PopupBg off={setMyBalancePopup} index={6} />
        </>
      )}

      {profPopup && (
        <>
          <ProfPopup off={setProfPopup} offAll={off} userData={userData} />
          <PopupBg off={setProfPopup} />
        </>
      )}

      {addPopup && (
        <>
          <AddPopup off={setAddPopup} />
          <PopupBg off={setAddPopup} />
        </>
      )}

      {lngPopup && (
        <>
          <SelLngPopup off={setLngPopup} />
          <PopupBg off={setLngPopup} index={6} />
        </>
      )}
    </>
  );
}

const MenuPopupBox = styled.section`
  display: flex;
  flex-direction: column;
  color: #fff;
  background: #181c25;
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
    padding: 0 16px;
    font-size: 14px;

    .logoBtn {
      display: flex;
      align-items: center;

      img {
        height: 18px;
      }
    }

    .myBtn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 34px;
      aspect-ratio: 1;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;

      img {
        width: 22px;
      }
    }

    .loginBtn {
      width: 140px;
      height: 34px;
      font-weight: 700;
      border: 1px solid #fff;
      border-radius: 28px;
    }
  }

  .contArea {
    flex: 1;
    padding: 20px;
    overflow-y: scroll;
    position: relative;

    .navList {
      details {
        &[open] {
          summary {
            opacity: 1;

            img {
              transform: rotate(180deg);
            }
          }
        }

        summary {
          display: flex;
          align-items: center;
          gap: 10px;
          height: 50px;
          font-size: 22px;
          opacity: 0.4;

          img {
            height: 6px;
          }
        }

        .detNavList {
          padding: 10px 0;

          li {
            height: 44px;
            padding: 0 20px;
            font-size: 20px;
            font-weight: 700;
            border-left: 1px solid rgba(255, 255, 255, 0.1);
            opacity: 0.4;
          }
        }
      }

      .navBtn {
        display: flex;
        align-items: center;
        height: 50px;
        font-size: 22px;
        opacity: 0.4;

        &:focus {
          opacity: 1;
        }
      }
    }

    .btnBox {
      display: flex;
      flex-direction: column;
      gap: 12px;
      position: fixed;
      right: 22px;
      bottom: 72px;

      button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 34px;
        aspect-ratio: 1;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;

        img {
          width: 20px;
          height: 20px;
          object-fit: contain;
        }
      }
    }
  }

  footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 56px;
    padding: 0 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.2);

    .leftArea {
      display: flex;
      align-items: center;
      .exitBtn {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 20px 0 0;

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

    .authBtn {
      width: 90px;
      height: 34px;
      font-size: 14px;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.8);
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid #000000;
      border-radius: 20px;
    }
  }
`;
