import { useEffect, useState } from "react";
import styled from "styled-components";
import { D_loginCategoryList } from "../../data/D_auth";
import I_xWhite from "../../img/icon/I_xWhite.svg";
import I_dnPol from "../../img/icon/I_dnPol.svg";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import PopupBg from "../../components/common/PopupBg";
import SelectPhoneLocPopup from "../../components/auth/SelectPhoneLocPopup";
import QRCode from "react-qr-code";
import { useTranslation } from "react-i18next";
import { API } from "../../configs/api";
import axios from "axios";

export default function ResetPw() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isMobile = useSelector((state) => state.common.isMobile);

  const [category, setCategory] = useState(D_loginCategoryList[0]);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [phoneLoc, setPhoneLoc] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneSent, setPhoneSent] = useState(false);
  const [selLocPopup, setSelLocPopup] = useState(false);
  const [code, setCode] = useState("");
  const [qrUrl, setQrUrl] = useState("");

  function onChangePhone(v) {
    if (v[0] === "0") v = v.slice(1);
    setPhone(v);
  }

  function getCode() {
    let _fomrData = {};

    if (category.value === "email") {
      _fomrData.email = email;
    } else if (category.value === "phone") {
      _fomrData.countryNum = phoneLoc;
      _fomrData.phone = phone;
    }

    axios
      .post(`${API.RESET_PW}/${category.value}`, _fomrData)
      .then(({ data }) => {
        console.log(data);

        if (data.message === "SENT") {
          if (category.value === "email") setEmailSent(true);
          else if (category.value === "phone") setPhoneSent(true);
        }
      })
      .catch(console.error);
  }

  function disableContBtn() {
    switch (category) {
      case D_loginCategoryList[0]:
        return !(email && code);

      case D_loginCategoryList[1]:
        return !(phoneLoc && phone && code);

      default:
        break;
    }
  }

  function onClickContBtn() {
    axios
      .post(`${API.RESET_VERIFY}/${category.value}/${code}`)
      .then(({ data }) => {
        console.log(data);

        if (data.message === "VALID_CODE")
          navigate(`/auth/setpw/${code}`, {
            state: {
              category: category.value,
              email,
              phoneLoc,
              phone,
            },
          });
      })
      .catch(console.error);
  }

  useEffect(() => {
    axios
      .get(API.ADMIN_QR)
      .then(({ data }) => {
        console.log(data.url);
        setQrUrl(data.url);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    setEmailSent(false);
  }, [email]);

  useEffect(() => {
    setPhoneSent(false);
  }, [phone]);

  useEffect(() => {
    if (!phoneLoc) return;

    getCode();
  }, [phoneLoc]);

  if (isMobile)
    return (
      <>
        <MloginBox>
          <section className="innerBox">
            <div className="titleBox">
              <strong className="pgTitle">{t("Reset Your Password")}</strong>
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
                        <button onClick={() => setCategory(v)}>
                          {t(v.key)}
                        </button>
                      </li>
                    ))}
                  </ul>

                  {category === D_loginCategoryList[0] && (
                    <ul className="inputList">
                      <li>
                        <p className="key">{t("Email")}</p>
                        <div className="value">
                          <div className={`inputBox`}>
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              onBlur={getCode}
                              placeholder=""
                            />

                            {email && (
                              <button
                                className="delBtn"
                                onClick={() => setEmail("")}
                              >
                                <img src={I_xWhite} alt="" />
                              </button>
                            )}
                          </div>
                        </div>
                      </li>

                      {email && emailSent && (
                        <li>
                          <p className="key">{t("Email Verification Code")}</p>

                          <div className="value">
                            <div className={`inputBox`}>
                              <input
                                type="number"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder=""
                              />

                              <button className="getCodeBtn" onClick={() => {}}>
                                {t("Get code")}
                              </button>
                            </div>
                          </div>
                        </li>
                      )}
                    </ul>
                  )}

                  {category === D_loginCategoryList[1] && (
                    <ul className="inputList">
                      <li className="phoneNumBox">
                        <p className="key">{t("Phone Number")}</p>
                        <div className="value">
                          <div className="selectBox local">
                            <button
                              className="selectBtn"
                              onClick={() => setSelLocPopup(true)}
                            >
                              <p>{phoneLoc}</p>

                              <img src={I_dnPol} alt="" />
                            </button>

                            {selLocPopup && (
                              <>
                                <SelectPhoneLocPopup
                                  setCont={setPhoneLoc}
                                  off={setSelLocPopup}
                                />
                                <PopupBg off={setSelLocPopup} />
                              </>
                            )}
                          </div>

                          <div className="inputBox">
                            <input
                              type="number"
                              value={phone}
                              onChange={(e) => onChangePhone(e.target.value)}
                              onBlur={getCode}
                              placeholder=""
                            />
                          </div>
                        </div>
                      </li>

                      {phone && phoneSent && (
                        <li>
                          <p className="key">
                            {t("Phone Number Verification Code")}
                          </p>

                          <div className="value">
                            <div className={`inputBox`}>
                              <input
                                type="number"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder=""
                              />

                              <button className="getCodeBtn" onClick={() => {}}>
                                {t("Get code")}
                              </button>
                            </div>
                          </div>
                        </li>
                      )}
                    </ul>
                  )}
                </div>

                <div className="btnBox">
                  <button
                    className="continueBtn"
                    disabled={disableContBtn()}
                    onClick={onClickContBtn}
                  >
                    {t("Continue")}
                  </button>
                </div>
              </div>
            </article>
          </section>

          <p className="cpRight">© 2022 Betbit.com. All rights reserved</p>
        </MloginBox>
      </>
    );
  else
    return (
      <>
        <PloginBox>
          <section className="innerBox">
            <div className="titleBox">
              <strong className="pgTitle">{t("Reset Your Password")}</strong>
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
                        <button onClick={() => setCategory(v)}>
                          {t(v.key)}
                        </button>
                      </li>
                    ))}
                  </ul>

                  {category === D_loginCategoryList[0] && (
                    <ul className="inputList">
                      <li>
                        <p className="key">{t("Email")}</p>
                        <div className="value">
                          <div className={`inputBox`}>
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              onBlur={getCode}
                              placeholder=""
                            />

                            {email && (
                              <button
                                className="delBtn"
                                onClick={() => setEmail("")}
                              >
                                <img src={I_xWhite} alt="" />
                              </button>
                            )}
                          </div>
                        </div>
                      </li>

                      {email && emailSent && (
                        <li>
                          <p className="key">{t("Email Verification Code")}</p>

                          <div className="value">
                            <div className={`inputBox`}>
                              <input
                                type="number"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder=""
                              />

                              <button className="getCodeBtn" onClick={() => {}}>
                                {t("Get code")}
                              </button>
                            </div>
                          </div>
                        </li>
                      )}
                    </ul>
                  )}

                  {category === D_loginCategoryList[1] && (
                    <ul className="inputList">
                      <li className="phoneNumBox">
                        <p className="key">{t("Phone Number")}</p>
                        <div className="value">
                          <div className="selectBox local">
                            <button
                              className="selectBtn"
                              onClick={() => setSelLocPopup(true)}
                            >
                              <p>{phoneLoc}</p>

                              <img src={I_dnPol} alt="" />
                            </button>

                            {selLocPopup && (
                              <>
                                <SelectPhoneLocPopup
                                  setCont={setPhoneLoc}
                                  off={setSelLocPopup}
                                />
                                <PopupBg off={setSelLocPopup} />
                              </>
                            )}
                          </div>

                          <div className="inputBox">
                            <input
                              type="number"
                              value={phone}
                              onChange={(e) => onChangePhone(e.target.value)}
                              onBlur={getCode}
                              placeholder=""
                            />
                          </div>
                        </div>
                      </li>

                      {phone && phoneSent && (
                        <li>
                          <p className="key">
                            {t("Phone Number Verification Code")}
                          </p>

                          <div className="value">
                            <div className={`inputBox`}>
                              <input
                                type="number"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder=""
                              />

                              <button className="getCodeBtn" onClick={() => {}}>
                                {t("Get code")}
                              </button>
                            </div>
                          </div>
                        </li>
                      )}
                    </ul>
                  )}
                </div>

                <div className="btnBox">
                  <button
                    className="continueBtn"
                    disabled={disableContBtn()}
                    onClick={onClickContBtn}
                  >
                    {t("Continue")}
                  </button>
                </div>
              </div>

              <div className="qrArea">
                <div className="qrBox">
                  <QRCode
                    size={220}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={`${qrUrl}/#/auth/resetpw`}
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
        </PloginBox>
      </>
    );
}

const MloginBox = styled.main`
  height: 100vh;
  overflow-y: scroll;
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
        font-size: 22px;
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

          .inputList {
            display: flex;
            flex-direction: column;
            gap: 20px;
            margin: 40px 0 0 0;

            & > li {
              display: flex;
              flex-direction: column;
              gap: 8px;
              font-size: 14px;

              &.phoneNumBox {
                .value {
                  display: flex;
                  flex-direction: row;
                  gap: 10px;

                  .selectBox {
                    width: 90px;
                    border-radius: 8px;
                    border: 1px solid #ddd;
                    position: relative;

                    &:focus-within {
                      border-color: #f7ab1f;
                    }

                    .selectBtn {
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      width: 100%;
                      height: 100%;
                      padding: 0 16px;
                      font-size: 14px;

                      img {
                        width: 8px;
                      }
                    }
                  }

                  .inputBox {
                    flex: 1;
                  }
                }
              }

              .key {
              }

              .value {
                display: flex;
                flex-direction: column;
                gap: 8px;

                .inputBox {
                  display: flex;
                  align-items: center;
                  height: 44px;
                  padding: 0 20px;
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

                  .delBtn {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 16px;
                    height: 16px;
                    background: #ddd;
                    border-radius: 50%;

                    img {
                      width: 8px;
                    }
                  }

                  .getCodeBtn {
                    font-size: 14px;
                    color: #f7ab1f;
                  }
                }

                p.alarm {
                  font-size: 12px;
                  color: #ff5353;
                }
              }
            }
          }
        }

        .btnBox {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          margin: 30px 0 0 0;

          button {
            width: 100%;
            height: 50px;
            font-size: 16px;
            border-radius: 8px;

            &.continueBtn {
              font-weight: 700;
              color: #fff;
              background: #2a2a2a;
            }
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

const PloginBox = styled.main`
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

          .inputList {
            display: flex;
            flex-direction: column;
            gap: 24px;
            margin: 40px 0 0 0;

            & > li {
              display: flex;
              flex-direction: column;
              gap: 8px;
              font-size: 14px;

              &.phoneNumBox {
                .value {
                  display: flex;
                  flex-direction: row;
                  gap: 10px;

                  .selectBox {
                    width: 90px;
                    border-radius: 8px;
                    border: 1px solid #ddd;
                    position: relative;

                    &:focus-within {
                      border-color: #f7ab1f;
                    }

                    .selectBtn {
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      width: 100%;
                      height: 100%;
                      padding: 0 16px;
                      font-size: 14px;
                    }
                  }

                  .inputBox {
                    flex: 1;
                  }
                }
              }

              .key {
              }

              .value {
                display: flex;
                flex-direction: column;
                gap: 10px;

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

                  .delBtn {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 16px;
                    height: 16px;
                    background: #ddd;
                    border-radius: 50%;

                    img {
                      width: 8px;
                    }
                  }

                  .getCodeBtn {
                    font-size: 14px;
                    color: #f7ab1f;
                  }
                }

                p.alarm {
                  font-size: 12px;
                  color: #ff5353;
                }
              }
            }
          }
        }

        .btnBox {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          margin: 40px 0 0 0;

          button {
            width: 100%;
            height: 56px;
            font-size: 18px;
            border-radius: 8px;

            &.continueBtn {
              font-weight: 700;
              color: #fff;
              background: #2a2a2a;
            }
          }

          .or {
            font-size: 16px;
          }
        }

        .utilBox {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
          margin: 24px 0 0 0;
          font-size: 14px;

          button {
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
