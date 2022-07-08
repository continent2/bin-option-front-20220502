import { useLocation, useNavigate } from "react-router";
import styled from "styled-components";
import { D_headerList, D_lngList } from "../../data/D_header";
import L_yellow from "../../img/logo/L_yellow.svg";
import I_dnPolWhite from "../../img/icon/I_dnPolWhite.svg";
import I_defaultProfImg from "../../img/icon/I_defaultProfImg.svg";
import I_wallet from "../../img/icon/I_wallet.svg";
import { ReactComponent as I_hamburger } from "../../img/icon/I_hamburger.svg";
import PopupBg from "../common/PopupBg";
import SelLngPopup from "./SelLngPopup";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ProfPopup from "./ProfPopup";
import { useSelector } from "react-redux";
import MenuPopup from "./MenuPopup";
import MyBalancePopup from "./MyBalancePopup";
import AuthPopup from "./AuthPopup";
import axios from "axios";
import { API } from "../../configs/api";
import MorePopup from "./MorePopup";
import AddPopup from "./AddPopup";

export default function DefaultHeader({ white, border, title }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();

  const isMobile = useSelector((state) => state.common.isMobile);

  const token = localStorage.getItem("token");
  const balanceType = localStorage.getItem("balanceType");

  const [lngPopup, setLngPopup] = useState(false);
  const [profPopup, setProfPopup] = useState(false);
  const [myBalancePopup, setMyBalancePopup] = useState(false);
  const [menuPopup, setMenuPopup] = useState(false);
  const [authPopup, setAuthPopup] = useState(false);
  const [morePopup, setMorePopup] = useState(false);
  const [userData, setUserData] = useState({});
  const [balance, setBalance] = useState({});
  const [addPopup, setAddPopup] = useState(false);

  function onClickMenuBtn() {
    if (white) setAuthPopup(true);
    else setMenuPopup(true);
  }

  async function getUserData() {
    const token = localStorage.getItem("token");
    if (!token) return;

    await axios
      .get(`${API.USER_BALANCE}`)
      .then(async ({ data }) => {
        console.log(data);
        setBalance({ ...data.respdata });
      })
      .catch((err) => {
        console.error(err);
      });

    await axios
      .get(`${API.AUTH}`)
      .then(async ({ data }) => {
        console.log(data.result);
        if (data.result?.wallet)
          localStorage.setItem("walletAddress", data.result.wallet);
        setUserData({ ...data.result });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(() => {
    getUserData();
  }, []);

  if (isMobile)
    return (
      <>
        <MdefaultHeaderBox
          className={`${white && "white"} ${border && "border"}`}
        >
          <article className="leftArea">
            {title ? (
              <p className="title">{title}</p>
            ) : token && location.pathname.indexOf("auth") === -1 ? (
              <button
                className="accountBtn"
                onClick={() => setMyBalancePopup(true)}
              >
                {balanceType === "Demo" ? (
                  <p>{`Demo $${balance?.DEMO?.avail / 10 ** 6 || 0}`}</p>
                ) : (
                  <p>{`Live $${balance?.LIVE?.avail / 10 ** 6 || 0}`}</p>
                )}
              </button>
            ) : (
              <button className="logoBtn" onClick={() => navigate("/")}>
                <img src={L_yellow} alt="" />
              </button>
            )}
          </article>

          <article className="rightArea">
            <button className="menuBtn" onClick={onClickMenuBtn}>
              <I_hamburger />
            </button>
          </article>
        </MdefaultHeaderBox>

        {menuPopup && <MenuPopup off={setMenuPopup} userData={userData} />}

        {authPopup && <AuthPopup off={setAuthPopup} />}

        {myBalancePopup && (
          <>
            <MyBalancePopup off={setMyBalancePopup} setAddPopup={setAddPopup} />
            <PopupBg off={setMyBalancePopup} index={6} />
          </>
        )}

        {addPopup && (
          <>
            <AddPopup off={setAddPopup} />
            <PopupBg off={setAddPopup} />
          </>
        )}
      </>
    );
  else
    return (
      <>
        <PdefaultHeaderBox
          className={`${white && "white"} ${border && "border"}`}
        >
          <div className="filterBox" />

          <article className="leftArea">
            <button className="logoBtn" onClick={() => navigate("/")}>
              <img src={L_yellow} alt="" />
            </button>

            {!white && (
              <ul className="navList">
                {D_headerList.map((v, i) =>
                  v.key === "Finance" && !userData.isbranch ? (
                    <Fragment key={i} />
                  ) : (
                    <li
                      key={i}
                      className={`${
                        location.pathname.indexOf(
                          String(v.key).toLocaleLowerCase()
                        ) !== -1 && "on"
                      }`}
                      onClick={() => navigate(v.url)}
                    >
                      {v.key}
                    </li>
                  )
                )}

                <li className={`${morePopup && "on"} moreBox`}>
                  <button
                    className="moreBtn"
                    onClick={() => setMorePopup(true)}
                  >
                    <p>More</p>
                    <img src={I_dnPolWhite} alt="" />
                  </button>

                  {morePopup && (
                    <>
                      <MorePopup off={setMorePopup} />
                      <PopupBg off={setMorePopup} />
                    </>
                  )}
                </li>
              </ul>
            )}
          </article>

          {location.pathname.indexOf("auth") === -1 ? (
            <article className="rightArea">
              {token ? (
                <>
                  <span className="accountBox">
                    <button
                      className="accountBtn"
                      onClick={() => setMyBalancePopup(true)}
                    >
                      {balanceType === "Demo" ? (
                        <>
                          <strong className="key">Demo</strong>
                          <strong className="value">{`$${Number(
                            balance?.DEMO?.avail / 10 ** 6 || 0
                          ).toFixed(2)}`}</strong>
                        </>
                      ) : (
                        <>
                          <strong className="key">Live</strong>
                          <strong className="value">{`$${Number(
                            balance?.LIVE?.avail / 10 ** 6 || 0
                          ).toFixed(2)}`}</strong>
                        </>
                      )}
                    </button>

                    <button
                      className="depositBtn"
                      onClick={() => navigate("/market/deposit")}
                    >
                      <img src={I_wallet} alt="" />

                      <strong>Deposit</strong>
                    </button>
                  </span>

                  <button className="myBtn" onClick={() => setProfPopup(true)}>
                    <img src={I_defaultProfImg} alt="" />
                  </button>
                </>
              ) : (
                <>
                  <div className="lngBox">
                    <button
                      className="lngBtn"
                      onClick={() => setLngPopup(true)}
                    >
                      {D_lngList.find((e) => e.value === i18n.language).key}
                    </button>

                    {lngPopup && (
                      <>
                        <SelLngPopup off={setLngPopup} />
                        <PopupBg off={setLngPopup} />
                      </>
                    )}
                  </div>

                  <button
                    className="loginBtn"
                    onClick={() => navigate("/auth")}
                  >
                    LOGIN
                  </button>
                </>
              )}
            </article>
          ) : (
            <div className="lngBox">
              <button className="lngBtn" onClick={() => setLngPopup(true)}>
                {D_lngList.find((e) => e.value === i18n.language).key}
              </button>

              {lngPopup && (
                <>
                  <SelLngPopup off={setLngPopup} />
                  <PopupBg off={setLngPopup} />
                </>
              )}
            </div>
          )}
        </PdefaultHeaderBox>

        {myBalancePopup && (
          <>
            <MyBalancePopup off={setMyBalancePopup} setAddPopup={setAddPopup} />
            <PopupBg off={setMyBalancePopup} />
          </>
        )}

        {addPopup && (
          <>
            <AddPopup off={setAddPopup} />
            <PopupBg off={setAddPopup} />
          </>
        )}

        {profPopup && (
          <>
            <ProfPopup off={setProfPopup} userData={userData} />
            <PopupBg off={setProfPopup} />
          </>
        )}
      </>
    );
}

const MdefaultHeaderBox = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
  padding: 0 20px;
  color: #fff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  top: 0;
  right: 0;
  left: 0;
  position: fixed;
  z-index: 3;

  &.border {
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }

  &.white {
    color: #2a2a2a;
    background: #fff;
    border-bottom: none;
    box-shadow: unset;

    .rightArea {
      .menuBtn {
        svg {
          .fill {
            fill: #000;
          }
        }
      }
    }
  }

  .leftArea {
    .title {
      font-size: 16px;
    }

    .logoBtn {
      display: flex;
      align-items: center;

      img {
        height: 20px;
      }
    }

    .accountBtn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 116px;
      height: 34px;
      font-size: 14px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 28px;
    }
  }

  .rightArea {
    .menuBtn {
      svg {
        width: 20px;
        height: 20px;

        .fill {
          fill: #fff;
        }
      }
    }
  }
`;

const PdefaultHeaderBox = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 30px;
  color: #fff;
  background: rgba(255, 255, 255, 0.04);
  top: 0;
  right: 0;
  left: 0;
  position: fixed;
  z-index: 3;

  .filterBox {
    width: 100%;
    height: 100%;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    top: 0;
    left: 0;
    position: absolute;
    z-index: -1;
  }

  &.border {
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }

  &.white {
    color: #2a2a2a;
    background: #fff;
    border-bottom: none;

    .rightArea {
      .profBox {
        .profPopup {
          color: #fff;
          background: #2a2a2a;
        }
      }

      .lngBox {
      }

      .loginBtn {
        color: #2a2a2a;
        border: 1px solid #2a2a2a;
      }
    }
  }

  .leftArea {
    display: flex;
    align-items: center;
    gap: 32px;

    .logoBtn {
      display: flex;
      align-items: center;
      img {
        height: 22px;
      }
    }

    .navList {
      display: flex;
      gap: 24px;

      li {
        display: flex;
        align-items: center;
        height: 30px;
        padding: 0 12px;
        border-radius: 6px;
        cursor: pointer;

        &.on {
          background: rgba(255, 255, 255, 0.1);

          &.moreBox {
            .moreBtn {
              img {
                transform: rotate(180deg);
              }
            }
          }
        }

        &.moreBox {
          position: relative;

          .moreBtn {
            display: flex;
            align-items: center;
            gap: 6px;
          }
        }
      }
    }
  }

  .lngBox {
    position: relative;

    .lngBtn {
      height: 30px;
      padding: 0 12px;
      font-size: 14px;
      font-weight: 700;
      border-radius: 6px;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
    }

    .selectPopup {
      background: #fff;
      box-shadow: 0px 0px 14px rgba(0, 0, 0, 0.2);

      li {
        &.on {
          color: #f7ab1f;
        }
      }
    }
  }

  .rightArea {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;

    .accountBox {
      display: flex;
      height: 38px;
      font-size: 14px;
      background: rgba(247, 171, 31, 0.2);
      border-radius: 28px;

      .accountBtn {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 6px;
        width: 138px;
      }

      .depositBtn {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
        width: 122px;
        height: 100%;
        color: #2a2a2a;
        background: #f7ab1f;
        border-radius: 28px;

        img {
          height: 18px;
        }
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
      width: 132px;
      height: 34px;
      font-weight: 700;
      border: 1px solid #fff;
      border-radius: 28px;

      &:hover {
        color: #f7ab1f;
        border-color: #f7ab1f;
      }
    }
  }
`;
