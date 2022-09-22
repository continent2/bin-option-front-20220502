import { useEffect, useState } from "react";
import styled from "styled-components";
import PopupBg from "../../components/common/PopupBg";
import VerificationPopup from "../../components/setting/myProfile/VerificationPopup";
import axios from "axios";
import { API } from "../../configs/api";
import { useSelector } from "react-redux";
import DefaultHeader from "../../components/header/DefaultHeader";
import { setToast } from "../../util/Util";
import SelectPhoneLocPopup from "../../components/auth/SelectPhoneLocPopup";
import I_dnPolWhite from "../../img/icon/I_dnPolWhite.svg";
import { useTranslation } from "react-i18next";

export default function MyProfile({ userData }) {
  const { t } = useTranslation();
  const isMobile = useSelector((state) => state.common.isMobile);

  const [uid, setUid] = useState("");
  const [pw, setPw] = useState("");
  const [changePw, setChangePw] = useState(false);
  const [pwChk, setPwChk] = useState("");
  const [pwAlarm, setPwAlarm] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countryNum, setCountryNum] = useState("");
  const [selLocPopup, setSelLocPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSend, setEmailSend] = useState(false);
  const [emailCode, setEmailCode] = useState("");
  const [emailCodeAlarm, setEmailCodeAlarm] = useState("");
  const [emailVerify, setEmailVerify] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneSend, setPhoneSend] = useState(false);
  const [phoneCode, setPhoneCode] = useState("");
  const [phoneCodeAlarm, setPhoneCodeAlarm] = useState("");
  const [phoneVerify, setPhoneVerify] = useState(false);
  const [verificationPopup, setVerificationPopup] = useState(false);

  function validatePw(str) {
    const regex = /(?=.*\d)(?=.*[A-Z]).{8,}/;
    return regex.test(str);
  }

  function onClickVeriEmailBtn() {
    setEmailSend(true);
    setVerificationPopup("email");

    axios
      .post(`${API.USER_SEND_CERTIFICATION}/email`, { email })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.error(err));
  }

  function onClickCheckEmailCodeBtn() {
    axios
      .post(`${API.USER_VERIFY}/email/${emailCode}`)
      .then(({ data }) => {
        console.log(data);
        if (data.status === "OK") {
          setEmailVerify(true);
          localStorage.setItem("token", data.result.tokenId);
        } else if (data.status === "ERR") setEmailCodeAlarm("invalid Code");
      })
      .catch(console.error);
  }

  function onClickVeriPhoneBtn() {
    setPhoneSend(true);
    setVerificationPopup("phone");

    axios
      .post(`${API.USER_SEND_CERTIFICATION}/phone`, { countryNum, phone })
      .then((res) => {
        console.log(res);
      })
      .catch(console.error);
  }

  function onClickCheckPhoneCodeBtn() {
    axios
      .post(`${API.USER_VERIFY}/phone/${phoneCode}`)
      .then(({ data }) => {
        console.log(data);

        if (data.status === "OK") {
          setPhoneVerify(true);
          localStorage.setItem("token", data.result.tokenId);
        } else if (data.status === "ERR") setPhoneCodeAlarm("invalid Code");
      })
      .catch(console.error);
  }

  function onclickSaveBtn() {
    let patchData = {
      email,
      firstName,
      lastName,
    };

    if (pw) patchData.password = pw;
    if (pw) patchData.phone = phone;

    console.log(patchData);

    axios.patch(`${API.USER_PROFILE}`, patchData).then(({ data }) => {
      console.log(data);

      if (data.message === "CHANGED") {
        setToast({ type: "alarm", cont: t("Your changes have been saved.") });
        localStorage.setItem("token", data.jwttoken.tokenId);

        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else setToast({ type: "alarm", cont: data.message });
    });
  }

  useEffect(() => {
    if (!(pw && pwChk)) return;

    if (!validatePw(pw)) {
      setPwAlarm(
        t(
          "Password must be at least 8 characters with 1 upper case letter and 1 number."
        )
      );
      return;
    }

    if (pw !== pwChk) {
      setPwAlarm(t("The password you have entered does not coincide"));
      return;
    }

    setPwAlarm("");
  }, [pw, pwChk]);

  function onBlurPhone() {
    if (phone[0] === "0") setPhone(phone.slice(1));
  }

  useEffect(() => {
    if (!userData) return;
    console.log(userData);

    userData.id && setUid(userData.id);
    userData.email && setEmail(userData.email);
    userData.phone && setPhone(userData.phone);
    userData.firstname && setFirstName(userData.firstname);
    userData.lastname && setLastName(userData.lastname);
    userData.countryNum && setCountryNum(userData.countryNum);
    userData.mailVerified && setEmailVerify(userData.mailVerified);
    userData.phoneVerified && setPhoneVerify(userData.phoneVerified);
  }, [userData]);

  useEffect(() => {
    setEmailCodeAlarm("");
  }, [emailCode]);

  useEffect(() => {
    setPhoneCodeAlarm("");
  }, [phoneCode]);

  if (isMobile)
    return (
      <>
        <DefaultHeader title="History" />

        <MmyProfileBox>
          <section className="innerBox">
            <article className="contArea">
              <ul className="inputList">
                <li>
                  <p className="key">{t("UID")}</p>
                  <div className="value">
                    <input disabled value={uid} />
                  </div>
                </li>

                <li>
                  <p className="key">{t("Password")}*</p>
                  <div className={`${pwAlarm && "alarmBox"} value`}>
                    <input
                      type="password"
                      value={pw}
                      disabled={!changePw}
                      onChange={(e) => setPw(e.target.value)}
                      placeholder=""
                    />

                    <button
                      className="changeBtn"
                      onClick={() => setChangePw(true)}
                    >
                      {t("Change")}
                    </button>
                  </div>
                </li>
                {changePw && (
                  <li>
                    <p className="key">{t("Confirm Password")}*</p>
                    <div className={`${pwAlarm && "alarmBox"} value`}>
                      <input
                        type="password"
                        value={pwChk}
                        onChange={(e) => setPwChk(e.target.value)}
                        placeholder=""
                      />
                    </div>

                    {pwAlarm && <p className="alarm">{t(pwAlarm)}</p>}
                  </li>
                )}

                <li>
                  <p className="key">{t("First name")}*</p>
                  <div className="value">
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder=""
                    />
                  </div>
                </li>

                <li>
                  <p className="key">{t("Last name")}*</p>
                  <div className="value">
                    <input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder=""
                    />
                  </div>
                </li>

                <li>
                  <p className="key">{t("Email")}*</p>
                  <div className="value">
                    <input
                      type="email"
                      disabled={userData.email}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder=""
                    />

                    {emailVerify ? (
                      <p className="verified">{t("Verified")}</p>
                    ) : (
                      <button
                        className={`${!emailSend && "init"} sendBtn`}
                        onClick={onClickVeriEmailBtn}
                      >
                        {emailSend ? t("Resend") : t("Unverified")}
                      </button>
                    )}
                  </div>
                </li>

                {!emailVerify && emailSend && (
                  <li>
                    <p className="key">{t("Email Code")}*</p>
                    <div className={`${emailCodeAlarm && "alarmBox"} value`}>
                      <input
                        type="text"
                        value={emailCode}
                        onChange={(e) => setEmailCode(e.target.value)}
                        placeholder=""
                      />

                      {emailCode ? (
                        <button
                          className="checkBtn"
                          onClick={onClickCheckEmailCodeBtn}
                        >
                          {t("Check")}
                        </button>
                      ) : (
                        <></>
                      )}
                    </div>

                    {emailCodeAlarm && (
                      <p className="alarm">{t(emailCodeAlarm)}</p>
                    )}
                  </li>
                )}

                <li>
                  <p className="key">{t("Phone")}</p>

                  <div className="selectBox local">
                    <button
                      className="selectBtn"
                      onClick={() => setSelLocPopup(true)}
                    >
                      <p>{countryNum}</p>

                      <img src={I_dnPolWhite} alt="" />
                    </button>

                    {selLocPopup && (
                      <>
                        <SelectPhoneLocPopup
                          setCont={(v) => setCountryNum(v)}
                          off={setSelLocPopup}
                        />
                        <PopupBg off={setSelLocPopup} />
                      </>
                    )}
                  </div>

                  <div className="value">
                    <input
                      type="number"
                      value={phone}
                      disabled={userData.phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder=""
                      onBlur={onBlurPhone}
                    />

                    {phoneVerify ? (
                      <p className="verified">{t("Verified")}</p>
                    ) : (
                      <button
                        className={`${!phoneSend && "init"} sendBtn`}
                        onClick={onClickVeriPhoneBtn}
                      >
                        {phoneSend ? t("Resend") : t("Unverified")}
                      </button>
                    )}
                  </div>
                </li>

                {!phoneVerify && phoneSend && (
                  <li>
                    <p className="key">{t("Phone Code")}*</p>
                    <div className={`${phoneCodeAlarm && "alarmBox"} value`}>
                      <input
                        type="text"
                        value={phoneCode}
                        onChange={(e) => setPhoneCode(e.target.value)}
                        placeholder=""
                      />

                      {phoneCode ? (
                        <button
                          className="checkBtn"
                          onClick={onClickCheckPhoneCodeBtn}
                        >
                          {t("Check")}
                        </button>
                      ) : (
                        <></>
                      )}
                    </div>
                    {phoneCodeAlarm && (
                      <p className="alarm">{t(phoneCodeAlarm)}</p>
                    )}
                  </li>
                )}
              </ul>

              <button
                className="saveBtn"
                disabled={!(firstName && lastName) || (changePw && !pwChk)}
                onClick={onclickSaveBtn}
              >
                {t("Save")}
              </button>
            </article>
          </section>
        </MmyProfileBox>

        {verificationPopup === "email" && (
          <>
            <VerificationPopup
              title="Email verification"
              explain="Please complete your email address validation in order to secure
            your account and funds on it."
              off={setVerificationPopup}
            />
            <PopupBg off={setVerificationPopup} />
          </>
        )}

        {verificationPopup === "phone" && (
          <>
            <VerificationPopup
              title="Phone Number verification"
              off={setVerificationPopup}
            />
            <PopupBg off={setVerificationPopup} />
          </>
        )}
      </>
    );
  else
    return (
      <>
        <PmyProfileBox>
          <section className="innerBox">
            <article className="titleArea">
              <strong className="title">{t("My Profile")}</strong>
              <p className="explain">
                {t(
                  "Please for your security, please fill out the following form"
                )}
              </p>
            </article>

            <article className="contArea">
              <ul className="inputList">
                <li>
                  <p className="key">{t("UID")}</p>
                  <div className="value">
                    <div className="inputBox">
                      <input disabled value={uid} />
                    </div>
                  </div>
                </li>

                <li>
                  <p className="key">{t("Password")}*</p>
                  <div className="value">
                    <div className={`${pwAlarm && "alarmBox"} inputBox`}>
                      <input
                        type="password"
                        value={pw}
                        disabled={!changePw}
                        onChange={(e) => setPw(e.target.value)}
                        placeholder=""
                      />

                      <button
                        className="changeBtn"
                        onClick={() => setChangePw(true)}
                      >
                        {t("Change")}
                      </button>
                    </div>
                  </div>
                </li>
                {changePw && (
                  <li>
                    <p className="key">{t("Confirm Password")}*</p>
                    <div className="value">
                      <div className={`${pwAlarm && "alarmBox"} inputBox`}>
                        <input
                          type="password"
                          value={pwChk}
                          onChange={(e) => setPwChk(e.target.value)}
                          placeholder=""
                        />
                      </div>
                    </div>

                    {pwAlarm && <p className="alarm">{t(pwAlarm)}</p>}
                  </li>
                )}

                <li>
                  <p className="key">{t("First name")}*</p>
                  <div className="value">
                    <div className="inputBox">
                      <input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder=""
                      />
                    </div>
                  </div>
                </li>

                <li>
                  <p className="key">{t("Last name")}*</p>
                  <div className="value">
                    <div className="inputBox">
                      <input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder=""
                      />
                    </div>
                  </div>
                </li>

                <li>
                  <p className="key">{t("Email")}*</p>
                  <div className="value">
                    <div className="inputBox">
                      <input
                        type="email"
                        disabled={userData.email}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder=""
                      />

                      {/* {emailVerify ? ( */}
                      {0 ? (
                        <p className="verified">{t("Verified")}</p>
                      ) : (
                        <button
                          className={`${!emailSend && "init"} sendBtn`}
                          onClick={onClickVeriEmailBtn}
                        >
                          {emailSend ? t("Resend") : t("Unverified")}
                        </button>
                      )}
                    </div>
                  </div>
                </li>

                {!emailVerify && emailSend && (
                  <li>
                    <p className="key">{t("Email Code")}*</p>
                    <div className="value">
                      <div
                        className={`${emailCodeAlarm && "alarmBox"} inputBox`}
                      >
                        <input
                          type="text"
                          value={emailCode}
                          onChange={(e) => setEmailCode(e.target.value)}
                          placeholder=""
                        />

                        {emailCode ? (
                          <button
                            className="checkBtn"
                            onClick={onClickCheckEmailCodeBtn}
                          >
                            {t("Check")}
                          </button>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                    {emailCodeAlarm && (
                      <p className="alarm">{t(emailCodeAlarm)}</p>
                    )}
                  </li>
                )}

                <li>
                  <p className="key">{t("Phone")}</p>
                  <div className="value">
                    <div className="selectBox local">
                      <button
                        className="selectBtn"
                        onClick={() => setSelLocPopup(true)}
                      >
                        <p>{countryNum}</p>

                        <img src={I_dnPolWhite} alt="" />
                      </button>

                      {selLocPopup && (
                        <>
                          <SelectPhoneLocPopup
                            setCont={(v) => setCountryNum(v)}
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
                        disabled={userData.phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder=""
                        onBlur={onBlurPhone}
                      />

                      {phoneVerify ? (
                        <p className="verified">{t("Verified")}</p>
                      ) : (
                        <button
                          className={`${!phoneSend && "init"} sendBtn`}
                          onClick={onClickVeriPhoneBtn}
                        >
                          {phoneSend ? t("Resend") : t("Unverified")}
                        </button>
                      )}
                    </div>
                  </div>
                </li>

                {!phoneVerify && phoneSend && (
                  <li>
                    <p className="key">{t("Phone Code")}*</p>
                    <div className="value">
                      <div
                        className={`${phoneCodeAlarm && "alarmBox"} inputBox`}
                      >
                        <input
                          type="text"
                          value={phoneCode}
                          onChange={(e) => setPhoneCode(e.target.value)}
                          placeholder=""
                        />

                        {phoneCode ? (
                          <button
                            className="checkBtn"
                            onClick={onClickCheckPhoneCodeBtn}
                          >
                            {t("Check")}
                          </button>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                    {phoneCodeAlarm && (
                      <p className="alarm">{t(phoneCodeAlarm)}</p>
                    )}
                  </li>
                )}
              </ul>

              <button
                className="saveBtn"
                disabled={!(firstName && lastName) || (changePw && !pwChk)}
                onClick={onclickSaveBtn}
              >
                {t("Save")}
              </button>
            </article>
          </section>
        </PmyProfileBox>

        {verificationPopup === "email" && (
          <>
            <VerificationPopup
              title="Email verification"
              explain="Please complete your email address validation in order to secure
            your account and funds on it."
              off={setVerificationPopup}
            />
            <PopupBg off={setVerificationPopup} />
          </>
        )}

        {verificationPopup === "phone" && (
          <>
            <VerificationPopup
              title="Phone Number verification"
              off={setVerificationPopup}
            />
            <PopupBg off={setVerificationPopup} />
          </>
        )}
      </>
    );
}

const MmyProfileBox = styled.main`
  height: 100%;
  overflow: hidden;

  .innerBox {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 20px;
    overflow-y: scroll;

    .contArea {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 60px;
      padding: 24px 20px;
      background: rgba(255, 255, 255, 0.2);
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;

      .inputList {
        display: flex;
        flex-direction: column;
        gap: 20px;
        font-size: 16px;

        & > li {
          display: flex;
          flex-direction: column;
          gap: 8px;

          .key {
          }

          .selectBox {
            display: flex;
            align-items: center;
            height: 50px;
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid transparent;
            border-radius: 10px;
            position: relative;

            .selectBtn {
              display: flex;
              justify-content: space-between;
              align-items: center;
              width: 100%;
              height: 100%;
              padding: 0 18px;

              img {
                width: 16px;
              }
            }

            .selectPopup {
              background: rgba(0, 0, 0, 0.4);
              backdrop-filter: blur(40px);
              -webkit-backdrop-filter: blur(40px);
              left: 0;
              top: unset;
              bottom: 50px;
              border: 2px solid rgba(255, 255, 255, 0.1);
            }
          }

          .value {
            display: flex;
            align-items: center;
            gap: 4px;
            height: 50px;
            padding: 0 18px;
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid transparent;
            border-radius: 10px;

            &:focus-within {
              border-color: #fff;

              button {
                color: #fff;
              }
            }

            &.alarmBox {
              border-color: #ff5353;
            }

            input {
              flex: 1;
              height: 100%;
            }

            .verified {
              color: #f7ab1f;
            }

            .sendBtn {
              color: rgba(255, 255, 255, 0.4);

              &.init {
                color: #ff5353;
              }
            }
          }

          .alarm {
            margin: 10px 0 0 0;
            font-size: 14px;
            color: #ff5353;
          }
        }
      }

      .saveBtn {
        width: 100%;
        height: 50px;
        font-size: 18px;
        font-weight: 700;
        color: #f7ab1f;
        background: rgba(247, 171, 31, 0.1);
        border: 1px solid #f7ab1f;
        border-radius: 12px;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.4);

        &:disabled {
          color: #fff;
          background: rgba(255, 255, 255, 0.1);
          border-color: #fff;
        }
      }
    }
  }
`;

const PmyProfileBox = styled.main`
  flex: 1;
  padding: 70px 140px;
  overflow-y: scroll;

  @media (max-width: 1440px) {
    max-width: 1020px;
    padding: 70px 40px 70px 80px;
  }

  .innerBox {
    display: flex;
    flex-direction: column;
    gap: 40px;
    height: 100%;
    margin: 0 0 70px;

    .titleArea {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .title {
        font-size: 24px;
      }

      .explain {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.6);
      }
    }

    .contArea {
      display: flex;
      flex-direction: column;
      gap: 24px;
      max-width: 900px;
      padding: 34px 40px;
      background: rgba(255, 255, 255, 0.2);
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;

      .inputList {
        display: flex;
        flex-direction: column;
        gap: 24px;
        font-size: 16px;

        & > li {
          display: flex;
          flex-direction: column;
          gap: 8px;

          .key {
          }

          .value {
            display: flex;
            gap: 8px;

            .selectBox {
              display: flex;
              align-items: center;
              width: 90px;
              height: 48px;
              border: 1px solid transparent;
              background: rgba(0, 0, 0, 0.4);
              border-radius: 10px;
              position: relative;

              .selectBtn {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                height: 100%;
                padding: 0 16px;
                font-size: 14px;
              }

              .selectPopup {
                background: rgba(0, 0, 0, 0.4);
                backdrop-filter: blur(40px);
                -webkit-backdrop-filter: blur(40px);
                left: 0;
                border: 2px solid rgba(255, 255, 255, 0.1);
              }
            }

            .inputBox {
              flex: 1;
              display: flex;
              align-items: center;
              height: 48px;
              padding: 0 22px;
              background: rgba(0, 0, 0, 0.4);
              border: 1px solid transparent;
              border-radius: 10px;

              &:focus-within {
                border-color: #fff;

                button {
                  color: #fff;
                }
              }

              &.alarmBox {
                border-color: #ff5353;
              }

              input {
                flex: 1;
                height: 100%;
              }

              .verified {
                color: #f7ab1f;
              }

              .sendBtn {
                color: rgba(255, 255, 255, 0.4);

                &.init {
                  color: #ff5353;
                }
              }
            }
          }

          .alarm {
            margin: 6px 0 0 0;
            font-size: 16px;
            color: #ff5353;
          }
        }
      }

      .saveBtn {
        width: 200px;
        height: 56px;
        font-size: 18px;
        font-weight: 700;
        color: #f7ab1f;
        background: rgba(247, 171, 31, 0.1);
        border: 1px solid #f7ab1f;
        border-radius: 12px;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.4);

        &:disabled {
          color: #fff;
          background: rgba(255, 255, 255, 0.1);
          border-color: #fff;
        }
      }
    }
  }
`;
