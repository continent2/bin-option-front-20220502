import { useEffect, useState } from "react";
import styled from "styled-components";
import PopupBg from "../common/PopupBg";
import I_dnPol from "../../img/icon/I_dnPol.svg";
import { useSelector } from "react-redux";
import SelectPhoneLocPopup from "./SelectPhoneLocPopup";
import { useTranslation } from "react-i18next";

export default function Phone({ userData, setUserData }) {
  const { t } = useTranslation();
  const isMobile = useSelector((state) => state.common.isMobile);

  const [selLocPopup, setSelLocPopup] = useState(false);

  function onBlurPhone() {
    if (userData.phone[0] === "0")
      setUserData({ ...userData, phone: userData.phone.slice(1) });
  }

  function validatePw(str) {
    const regex = /(?=.*\d)(?=.*[A-Z]).{8,}/;
    return regex.test(str);
  }

  useEffect(() => {
    if (userData.pw && !validatePw(userData.pw))
      setUserData({
        ...userData,
        pwAlarm:
          "Password must be at least 8 characters with 1 upper case letter and 1 number.",
      });
    else setUserData({ ...userData, pwAlarm: "" });
  }, [userData.pw]);

  if (isMobile)
    return (
      <>
        <MphoneBox>
          <li className="phoneNumBox">
            <p className="key">{t("Phone Number")}</p>
            <div className="value">
              <div className="selectBox local">
                <button
                  className="selectBtn"
                  onClick={() => setSelLocPopup(true)}
                >
                  <p>{userData?.phoneLoc}</p>

                  <img src={I_dnPol} alt="" />
                </button>

                {selLocPopup && (
                  <>
                    <SelectPhoneLocPopup
                      setCont={(v) =>
                        setUserData({
                          ...userData,
                          phoneLoc: v,
                        })
                      }
                      off={setSelLocPopup}
                    />
                    <PopupBg off={setSelLocPopup} />
                  </>
                )}
              </div>
              <div className="inputBox">
                <input
                  type="number"
                  value={userData?.phone}
                  onChange={(e) =>
                    setUserData({ ...userData, phone: e.target.value })
                  }
                  onBlur={onBlurPhone}
                  placeholder=""
                />
              </div>

              {userData.phoneAlarm && (
                <p className="alarm">{t(userData.phoneAlarm)}</p>
              )}
            </div>
          </li>

          <li>
            <p className="key">{t("Password")}</p>
            <div className="value">
              <div className={`${userData.pwAlarm && "alarm"} inputBox`}>
                <input
                  type="password"
                  value={userData?.pw}
                  onChange={(e) =>
                    setUserData({ ...userData, pw: e.target.value })
                  }
                  placeholder=""
                />
              </div>

              {userData.pwAlarm && (
                <p className="alarm">{t(userData.pwAlarm)}</p>
              )}
            </div>
          </li>
        </MphoneBox>
      </>
    );
  else
    return (
      <>
        <PphoneBox>
          <li className="phoneNumBox">
            <p className="key">{t("Phone Number")}</p>
            <div className="value">
              <div className="inputCont">
                <div className="selectBox local">
                  <button
                    className="selectBtn"
                    onClick={() => setSelLocPopup(true)}
                  >
                    <p>{userData?.phoneLoc}</p>

                    <img src={I_dnPol} alt="" />
                  </button>

                  {selLocPopup && (
                    <>
                      <SelectPhoneLocPopup
                        setCont={(v) =>
                          setUserData({
                            ...userData,
                            phoneLoc: v,
                          })
                        }
                        off={setSelLocPopup}
                      />
                      <PopupBg off={setSelLocPopup} />
                    </>
                  )}
                </div>

                <div className={`${userData.phoneAlarm && "alarm"} inputBox`}>
                  <input
                    type="number"
                    value={userData?.phone}
                    onChange={(e) =>
                      setUserData({ ...userData, phone: e.target.value })
                    }
                    onBlur={onBlurPhone}
                    placeholder=""
                  />
                </div>
              </div>

              {userData.phoneAlarm && (
                <p className="alarm">{t(userData.phoneAlarm)}</p>
              )}
            </div>
          </li>

          <li>
            <p className="key">{t("Password")}</p>
            <div className="value">
              <div className={`${userData.pwAlarm && "alarm"} inputBox`}>
                <input
                  type="password"
                  value={userData?.pw}
                  onChange={(e) =>
                    setUserData({ ...userData, pw: e.target.value })
                  }
                  placeholder=""
                />
              </div>

              {userData.pwAlarm && (
                <p className="alarm">{t(userData.pwAlarm)}</p>
              )}
            </div>
          </li>
        </PphoneBox>
      </>
    );
}

const MphoneBox = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 20px;

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
      }

      p.alarm {
        font-size: 12px;
        color: #ff5353;
      }
    }
  }
`;

const PphoneBox = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 24px;

  & > li {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 14px;

    &.phoneNumBox {
      .value {
        .inputCont {
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
      }

      p.alarm {
        font-size: 12px;
        color: #ff5353;
      }
    }
  }
`;
