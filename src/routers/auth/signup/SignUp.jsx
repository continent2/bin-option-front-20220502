import { useState } from "react";
import styled from "styled-components";
import { D_joinData, D_loginCategoryList } from "../../../data/D_auth";
import Email from "../../../components/auth/Email";
import I_dnPol from "../../../img/icon/I_dnPol.svg";
import I_chkOrange from "../../../img/icon/I_chkOrange.svg";
import Phone from "../../../components/auth/Phone";
import QRCode from "react-qr-code";
import { useNavigate, useLocation } from "react-router";
import axios from "axios";
import { API } from "../../../configs/api";
import { useSelector } from "react-redux";
import { setToast } from "../../../util/Util";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { nettype } from "../../../configs/nettype";

export default function Signup() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const isMobile = useSelector((state) => state.common.isMobile);

  const [category, setCategory] = useState(D_loginCategoryList[0]);
  const [chkTerm, setChkTerm] = useState(false);
  const [userData, setUserData] = useState(D_joinData);
  const [qrUrl, setQrUrl] = useState("");

  function onClickSignup() {
    let signDataForm;

    if (category.key === "Email")
      signDataForm = {
        email: userData.email,
        password: userData.pw,
        refcode: userData.referral,
      };
    else if (category.key === "Phone Number")
      signDataForm = {
        phone: userData.phone,
        countryNum: userData.phoneLoc,
        password: userData.pw,
        refcode: userData.referral,
      };

    axios
      .post(`${API.SIGNUP}/${category.value}?nettype=${nettype}`, signDataForm)
      .then(({ data }) => {
        console.log(data);

        if (data.status === "ERR") {
          setToast({ type: "alarm_black", cont: t(data.message) });
        }

        if (data.message === "TOKEN_CREATED") {
          localStorage.setItem("token", data.result.tokenId);
          navigate("/");
        }
      })
      .catch((err) => console.error(err));
  }

  function getUrlHead() {
    axios
      .get(API.ADMIN_QR)
      .then(({ data }) => {
        console.log(data.url);
        setQrUrl(data.url);
      })
      .catch(console.error);
  }

  function getReferral() {
    setUserData({
      ...userData,
      referral: params.get("refcode"),
    });
  }

  useEffect(() => {
    getReferral();
    getUrlHead();
  }, []);

  if (isMobile)
    return (
      <>
        <MsignupBox>
          <section className="innerBox">
            <div className="titleBox">
              <strong className="pgTitle">{t("Create Betbit Account")}</strong>
            </div>

            <article className="contArea">
              <div className="loginArc">
                <div className="contBox">
                  <ul className="categoryList">
                    {D_loginCategoryList.map((v, i) => (
                      <li
                        key={i}
                        className={`${category.key === v.key && "on"}`}
                      >
                        <button onClick={() => setCategory(v)}>{v.key}</button>
                      </li>
                    ))}
                  </ul>

                  {category.key === "Email" && (
                    <Email userData={userData} setUserData={setUserData} />
                  )}

                  {category.key === "Phone Number" && (
                    <Phone userData={userData} setUserData={setUserData} />
                  )}

                  <details className="referralDet" open={params.get("refcode")}>
                    <summary>
                      <p>
                        {t("Referral ID")} ({t("Optional")})
                      </p>
                      <img src={I_dnPol} alt="" />
                    </summary>

                    <div className="inputCont">
                      <div
                        className={`${
                          userData.referralAlarm && "alarm"
                        } inputBox`}
                      >
                        <input
                          value={userData.referral}
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              referral: e.target.value,
                            })
                          }
                          placeholder=""
                        />
                      </div>

                      {userData.referralAlarm && (
                        <p className="alarm">{userData.referralAlarm}</p>
                      )}
                    </div>
                  </details>
                </div>

                <div className="btnBox">
                  <div className="termBox">
                    <button
                      className={`${chkTerm && "on"} chkBtn`}
                      onClick={() => setChkTerm(!chkTerm)}
                    >
                      <img src={I_chkOrange} alt="" />
                    </button>

                    <span className="agreeBox">
                      <p className="agree">
                        {t("I have read and agree to Betbit’s")}
                      </p>
                      <button className="termBtn" onClick={() => {}}>
                        {t("Terms of Service")}
                      </button>
                    </span>
                  </div>

                  <button
                    className="nextBtn"
                    disabled={
                      !chkTerm ||
                      !(userData.email || userData.phone) ||
                      !userData.pw ||
                      userData.emailAlarm ||
                      userData.pwAlarm
                    }
                    onClick={onClickSignup}
                  >
                    {t("Next")}
                  </button>
                </div>

                <div className="utilBox">
                  <span className="loginBox">
                    <p className="login">{t("Already registered?")}</p>&nbsp;
                    <button
                      className="loginBtn"
                      onClick={() => navigate("/auth/login")}
                    >
                      {t("LogIn")}
                    </button>
                  </span>
                </div>
              </div>
            </article>
          </section>

          <p className="cpRight">© 2022 Betbit.com. All rights reserved</p>
        </MsignupBox>
      </>
    );
  else
    return (
      <>
        <PsignupBox>
          <section className="innerBox">
            <div className="titleBox">
              <strong className="pgTitle">{t("Create Betbit Account")}</strong>
              <p className="explain">
                {t("Register with your email or mobile")}
              </p>
            </div>

            <article className="contArea">
              <div className="loginArc">
                <div className="contBox">
                  <ul className="categoryList">
                    {D_loginCategoryList.map((v, i) => (
                      <li
                        key={i}
                        className={`${category.key === v.key && "on"}`}
                      >
                        <button onClick={() => setCategory(v)}>{v.key}</button>
                      </li>
                    ))}
                  </ul>

                  {category.key === "Email" && (
                    <Email userData={userData} setUserData={setUserData} />
                  )}

                  {category.key === "Phone Number" && (
                    <Phone userData={userData} setUserData={setUserData} />
                  )}

                  <details className="referralDet" open={params.get("refcode")}>
                    <summary>
                      <p>
                        {t("Referral ID")} ({t("Optional")})
                      </p>
                      <img src={I_dnPol} alt="" />
                    </summary>

                    <div className="inputCont">
                      <div
                        className={`${
                          userData.referralAlarm && "alarm"
                        } inputBox`}
                      >
                        <input
                          value={userData.referral}
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              referral: e.target.value,
                            })
                          }
                          placeholder=""
                        />
                      </div>

                      {userData.referralAlarm && (
                        <p className="alarm">{userData.referralAlarm}</p>
                      )}
                    </div>
                  </details>
                </div>

                <div className="btnBox">
                  <div className="termBox">
                    <button
                      className={`${chkTerm && "on"} chkBtn`}
                      onClick={() => setChkTerm(!chkTerm)}
                    >
                      <img src={I_chkOrange} alt="" />
                    </button>

                    <span className="agreeBox">
                      <p className="agree">
                        {t("I have read and agree to Betbit’s")}
                      </p>
                      &nbsp;
                      <button className="termBtn" onClick={() => {}}>
                        {t("Terms of Service")}
                      </button>
                    </span>
                  </div>

                  <button
                    className="nextBtn"
                    disabled={
                      !chkTerm ||
                      !(userData.email || userData.phone) ||
                      !userData.pw ||
                      userData.emailAlarm ||
                      userData.pwAlarm
                    }
                    onClick={onClickSignup}
                  >
                    {t("Next")}
                  </button>
                </div>

                <div className="utilBox">
                  <span className="loginBox">
                    <p className="login">{t("Already registered?")}</p>&nbsp;
                    <button
                      className="loginBtn"
                      onClick={() => navigate("/auth/login")}
                    >
                      {t("LogIn")}
                    </button>
                  </span>
                </div>
              </div>

              <div className="qrArea">
                <div className="qrBox">
                  <QRCode
                    size={220}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={`${qrUrl}/#/auth/signup`}
                    viewBox={`0 0 220 220`}
                  />
                </div>

                <div className="textBox">
                  <strong className="title">{t("Mobile with QR code")}</strong>

                  <p className="explain">
                    {t(
                      "Scan this code and you will be taken to your mobile login."
                    )}
                  </p>
                </div>
              </div>
            </article>
          </section>

          <p className="cpRight">© 2022 Betbit.com. All rights reserved</p>
        </PsignupBox>
      </>
    );
}

const MsignupBox = styled.main`
  padding: 56px 0 0;

  .innerBox {
    display: flex;
    flex-direction: column;
    gap: 40px;
    padding: 40px 16px 0;

    .titleBox {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .pgTitle {
        font-size: 28px;
      }
    }

    .contArea {
      .loginArc {
        .contBox {
          .categoryList {
            display: flex;
            margin: 0 0 40px 0;

            li {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 32px;
              font-size: 14px;
              color: #ddd;
              border: 3px solid transparent;
              border-bottom: unset;

              &.on {
                color: inherit;
                border: solid transparent;
                border-width: 3px 3px 0 3px;
                background-image: linear-gradient(#fff, #fff),
                  linear-gradient(
                    180deg,
                    #000000 -12.12%,
                    rgba(0, 0, 0, 0) 131.82%
                  );
                border-radius: 8px 8px 0 0;
                background-origin: border-box;
                background-clip: content-box, border-box;
              }

              button {
                width: 100%;
                height: 100%;
                padding: 0 20px;
              }
            }
          }

          .referralDet {
            margin: 20px 0 0 0;

            &[open] {
              summary {
                img {
                  transform: rotate(180deg);
                }
              }
            }

            summary {
              display: flex;
              align-items: center;
              gap: 6px;
              font-size: 14px;

              img {
                width: 8px;
              }
            }

            .inputCont {
              display: flex;
              flex-direction: column;
              gap: 8px;
              font-size: 14px;
              margin: 8px 0 0 0;

              .inputBox {
                display: flex;
                align-items: center;
                height: 44px;
                padding: 0 16px;
                border-radius: 8px;
                border: 1px solid #ddd;

                &:focus-within {
                  border-color: #f7ab1f;
                }

                &.alarm {
                  border-color: #f00;
                }

                input {
                  flex: 1;
                }
              }

              p.alarm {
                font-size: 12px;
                color: #ff5353;
              }
            }
          }
        }

        .btnBox {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin: 40px 0 0 0;

          .termBox {
            display: flex;
            align-items: flex-start;
            gap: 10px;

            .chkBtn {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 20px;
              height: 20px;
              border-radius: 4px;
              box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.3);

              &.on {
                img {
                  display: block;
                }
              }

              img {
                display: none;
                width: 14px;
              }
            }

            .agreeBox {
              font-size: 14px;

              .termBtn {
                color: #f7ab1f;
              }
            }
          }

          .nextBtn {
            height: 50px;
            font-size: 16px;
            font-weight: 700;
            color: #fff;
            background: #2a2a2a;
            border-radius: 8px;
          }
        }

        .utilBox {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
          margin: 20px 0 0 0;
          font-size: 14px;

          .loginBox {
            display: flex;
            align-items: center;
          }

          button {
            font-size: 14px;
            color: #f7ab1f;
          }
        }
      }
    }
  }

  .cpRight {
    margin: 30px 0;
    font-size: 12px;
    text-align: center;
    white-space: nowrap;
    color: #ddd;
  }
`;

const PsignupBox = styled.main`
  display: flex;
  justify-content: center;
  padding: 70px 0;

  .innerBox {
    display: flex;
    flex-direction: column;
    gap: 44px;
    padding: 90px 0;

    .titleBox {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .pgTitle {
        font-size: 28px;
      }
    }

    .contArea {
      display: flex;
      gap: 125px;

      .loginArc {
        width: 400px;

        .contBox {
          .categoryList {
            display: flex;
            margin: 0 0 40px 0;

            li {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 34px;
              color: #ddd;
              border: 3px solid transparent;
              border-bottom: unset;

              &.on {
                color: inherit;
                border: solid transparent;
                border-width: 3px 3px 0 3px;
                background-image: linear-gradient(#fff, #fff),
                  linear-gradient(
                    180deg,
                    #000000 -12.12%,
                    rgba(0, 0, 0, 0) 131.82%
                  );
                border-radius: 8px 8px 0 0;
                background-origin: border-box;
                background-clip: content-box, border-box;
              }

              button {
                width: 100%;
                height: 100%;
                padding: 0 22px;
              }
            }
          }

          .referralDet {
            margin: 24px 0 0 0;

            &[open] {
              summary {
                img {
                  transform: rotate(180deg);
                }
              }
            }

            summary {
              display: flex;
              align-items: center;
              gap: 6px;
              font-size: 14px;

              img {
                width: 8px;
              }
            }

            .inputCont {
              display: flex;
              flex-direction: column;
              gap: 10px;
              margin: 8px 0 0 0;

              .inputBox {
                display: flex;
                align-items: center;
                height: 44px;
                padding: 0 16px;
                border-radius: 8px;
                border: 1px solid #ddd;

                &:focus-within {
                  border-color: #f7ab1f;
                }

                &.alarm {
                  border-color: #f00;
                }

                input {
                  flex: 1;
                }
              }

              p.alarm {
                font-size: 12px;
                color: #ff5353;
              }
            }
          }
        }

        .btnBox {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin: 40px 0 0 0;

          .termBox {
            display: flex;
            align-items: center;
            gap: 8px;

            .chkBtn {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 20px;
              height: 20px;
              border-radius: 4px;
              box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.3);

              &.on {
                img {
                  display: block;
                }
              }

              img {
                display: none;
                width: 14px;
              }
            }

            .agreeBox {
              display: flex;
              align-items: center;
              font-size: 14px;

              .termBtn {
                color: #f7ab1f;
              }
            }
          }

          .nextBtn {
            height: 56px;
            font-size: 18px;
            font-weight: 700;
            color: #fff;
            background: #2a2a2a;
            border-radius: 8px;
          }
        }

        .utilBox {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
          margin: 24px 0 0 0;
          font-size: 14px;

          .loginBox {
            display: flex;
            align-items: center;
          }

          button {
            font-size: 14px;
            color: #f7ab1f;
          }
        }
      }

      .qrArea {
        display: flex;
        flex-direction: column;
        gap: 40px;
        width: 240px;

        .qrBox {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 240px;
          height: 240px;
          padding: 10px;
          border-radius: 14px;
          box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.14);
        }

        .textBox {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;

          .title {
            font-size: 16px;
          }

          .explain {
            font-size: 14px;
            color: #888;
            text-align: center;
          }
        }
      }
    }
  }

  .cpRight {
    font-size: 12px;
    bottom: 30px;
    left: 50%;
    position: fixed;
    transform: translate(-50%);
  }
`;
