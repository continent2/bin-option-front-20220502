import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import styled from "styled-components";
import DefaultHeader from "../../components/header/DefaultHeader";
import { API } from "../../configs/api";

export default function Notifications() {
  const { t } = useTranslation();
  const isMobile = useSelector((state) => state.common.isMobile);

  const [betEnd, setBetEnd] = useState(false);
  const [orderRequest, setOrderRequest] = useState(false);
  const [emailNoti, setEmailNoti] = useState(false);
  const [lastNews, setLasetNews] = useState(false);
  const [question, setQuestion] = useState(false);

  function getData() {
    axios
      .get(API.NOTI)
      .then(({ data }) => {
        console.log(data);
        let _resp = data.resp;

        setBetEnd(_resp.betend);
        setOrderRequest(_resp.orderrequest);
        setEmailNoti(_resp.emailnotice);
        setLasetNews(_resp.latestnews);
        setQuestion(_resp.questions);
      })
      .catch(console.error);
  }

  function onClickSaveBtn() {
    let _formData = {};

    _formData.betend = betEnd ? 1 : 0;
    _formData.orderrequest = orderRequest ? 1 : 0;
    _formData.emailnotice = emailNoti ? 1 : 0;
    _formData.latestnews = lastNews ? 1 : 0;
    _formData.questions = question ? 1 : 0;

    axios
      .patch(API.NOTI_SET, _formData)
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch(console.error);
  }

  useEffect(() => {
    getData();
  }, []);

  if (isMobile)
    return (
      <>
        <DefaultHeader title="Notification" />

        <MnotificationsBox>
          <section className="innerBox">
            <article className="contArea">
              <ul className="optList">
                <li>
                  <div className="topBar">
                    <p className="title">{t("Position End Notification")}</p>

                    <button
                      className={`${betEnd && "on"} toggleBtn`}
                      onClick={() => setBetEnd(!betEnd)}
                    >
                      <p className="on">{t("on")}</p>
                      <span />
                      <p className="off">{t("off")}</p>
                    </button>
                  </div>

                  <div className="key">
                    <p className="explain">
                      {t("Notification when position closes")}
                    </p>
                  </div>
                </li>

                <li>
                  <div className="topBar">
                    <p className="title">{t("Orders request successful")}</p>

                    <button
                      className={`${orderRequest && "on"} toggleBtn`}
                      onClick={() => setOrderRequest(!orderRequest)}
                    >
                      <p className="on">{t("on")}</p>
                      <span />
                      <p className="off">{t("off")}</p>
                    </button>
                  </div>

                  <div className="key">
                    <p className="explain">
                      {t("Confirmation window for orders")}
                    </p>
                  </div>
                </li>

                <li>
                  <div className="topBar">
                    <p className="title">{t("Email notifications")}</p>

                    <button
                      className={`${emailNoti && "on"} toggleBtn`}
                      onClick={() => setEmailNoti(!emailNoti)}
                    >
                      <p className="on">{t("on")}</p>
                      <span />
                      <p className="off">{t("off")}</p>
                    </button>
                  </div>

                  <div className="key">
                    <p className="explain">
                      {t("Subscribe to Betbit updates")}
                    </p>
                  </div>
                </li>

                <li>
                  <div className="topBar">
                    <p className="title">{t("Latest news")}</p>

                    <button
                      className={`${lastNews && "on"} toggleBtn`}
                      onClick={() => setLasetNews(!lastNews)}
                    >
                      <p className="on">{t("on")}</p>
                      <span />
                      <p className="off">{t("off")}</p>
                    </button>
                  </div>

                  <div className="key">
                    <p className="explain">
                      {t("Promotion: Our latest events, offers and more")}
                    </p>
                  </div>
                </li>

                <li>
                  <div className="topBar">
                    <p className="title">{t("Questions")}</p>

                    <button
                      className={`${question && "on"} toggleBtn`}
                      onClick={() => setQuestion(!question)}
                    >
                      <p className="on">{t("on")}</p>
                      <span />
                      <p className="off">{t("off")}</p>
                    </button>
                  </div>

                  <div className="key">
                    <p className="explain">
                      {t("Notification of answers to support team inquiries")}
                    </p>
                  </div>
                </li>
              </ul>

              <button className="saveBtn" onClick={onClickSaveBtn}>
                {t("Save")}
              </button>
            </article>
          </section>
        </MnotificationsBox>
      </>
    );
  else
    return (
      <>
        <PnotificationsBox>
          <section className="innerBox">
            <article className="titleArea">
              <strong className="title">{t("Notification settings")}</strong>
              <p className="explain">
                {t(
                  "Please select the type of notifications you want to receive from this account"
                )}
              </p>
            </article>

            <article className="contArea">
              <ul className="optList">
                <li>
                  <div className="key">
                    <p className="title">{t("Position End Notification")}</p>
                    <p className="explain">
                      {t("Notification when position closes")}
                    </p>
                  </div>

                  <button
                    className={`${betEnd && "on"} toggleBtn`}
                    onClick={() => setBetEnd(!betEnd)}
                  >
                    <p className="on">{t("on")}</p>
                    <span />
                    <p className="off">{t("off")}</p>
                  </button>
                </li>

                <li>
                  <div className="key">
                    <p className="title">{t("Orders request successful")}</p>
                    <p className="explain">
                      {t("Confirmation window for orders")}
                    </p>
                  </div>

                  <button
                    className={`${orderRequest && "on"} toggleBtn`}
                    onClick={() => setOrderRequest(!orderRequest)}
                  >
                    <p className="on">{t("on")}</p>
                    <span />
                    <p className="off">{t("off")}</p>
                  </button>
                </li>

                <li>
                  <div className="key">
                    <p className="title">{t("Email notifications")}</p>
                    <p className="explain">
                      {t("Subscribe to Betbit updates")}
                    </p>
                  </div>

                  <button
                    className={`${emailNoti && "on"} toggleBtn`}
                    onClick={() => setEmailNoti(!emailNoti)}
                  >
                    <p className="on">{t("on")}</p>
                    <span />
                    <p className="off">{t("off")}</p>
                  </button>
                </li>

                <li>
                  <div className="key">
                    <p className="title">{t("Latest news")}</p>
                    <p className="explain">
                      {t("Promotion: Our latest events, offers and more")}
                    </p>
                  </div>

                  <button
                    className={`${lastNews && "on"} toggleBtn`}
                    onClick={() => setLasetNews(!lastNews)}
                  >
                    <p className="on">{t("on")}</p>
                    <span />
                    <p className="off">{t("off")}</p>
                  </button>
                </li>

                <li>
                  <div className="key">
                    <p className="title">{t("Questions")}</p>
                    <p className="explain">
                      {t("Notification of answers to support team inquiries")}
                    </p>
                  </div>

                  <button
                    className={`${question && "on"} toggleBtn`}
                    onClick={() => setQuestion(!question)}
                  >
                    <p className="on">{t("on")}</p>
                    <span />
                    <p className="off">{t("off")}</p>
                  </button>
                </li>
              </ul>

              <button className="saveBtn" onClick={onClickSaveBtn}>
                {t("Save")}
              </button>
            </article>
          </section>
        </PnotificationsBox>
      </>
    );
}

const MnotificationsBox = styled.main`
  .innerBox {
    height: 100%;
    overflow-y: scroll;
    padding: 20px;

    .contArea {
      display: flex;
      flex-direction: column;
      padding: 24px 20px;
      background: rgba(255, 255, 255, 0.2);
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;

      .optList {
        li {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 14px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.2);

          &:first-of-type {
            padding: 0 0 14px 0;
            border: none;
          }

          .topBar {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .title {
              font-size: 16px;
            }

            .toggleBtn {
              display: flex;
              align-items: center;
              width: 58px;
              height: 24px;
              padding: 3px;
              font-size: 14px;
              background: rgba(255, 255, 255, 0.2);
              border-radius: 12px;
              position: relative;

              &,
              * {
                transition: all 0.3s;
              }

              &.on {
                background: rgba(247, 171, 31, 0.2);

                span {
                  margin: 0 0 0 34px;
                  background: rgba(247, 171, 31, 0.8);
                }

                p {
                  &.on {
                    opacity: 1;
                  }

                  &.off {
                    opacity: 0;
                  }
                }
              }

              span {
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.8);
              }

              p {
                top: 50%;
                transform: translate(0, -50%);
                position: absolute;

                &.on {
                  opacity: 0;
                  left: 14px;
                }

                &.off {
                  opacity: 1;
                  right: 10px;
                }
              }
            }
          }

          .key {
            .explain {
              font-size: 14px;
              color: rgba(255, 255, 255, 0.6);
            }
          }
        }
      }

      .saveBtn {
        width: 100%;
        height: 50px;
        margin: 16px 0 0 0;
        font-size: 18px;
        font-weight: 700;
        background: rgba(255, 255, 255, 0.1);
        border: 1.4px solid #fff;
        border-radius: 12px;
      }
    }
  }
`;

const PnotificationsBox = styled.main`
  flex: 1;
  padding: 70px 140px;

  @media (max-width: 1440px) {
    padding: 70px 40px 70px 80px;
  }

  .innerBox {
    display: flex;
    flex-direction: column;
    gap: 40px;
    height: 100%;
    overflow-y: scroll;

    .titleArea {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 618px;

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
      width: 900px;
      padding: 34px 40px 60px;
      background: rgba(255, 255, 255, 0.2);
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;

      .optList {
        li {
          display: flex;
          justify-content: space-between;
          padding: 20px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);

          &:first-of-type {
            padding: 0 0 20px 0;
          }

          .key {
            display: flex;
            flex-direction: column;
            gap: 4px;

            .title {
              font-size: 18px;
            }

            .explain {
              font-size: 14px;
              color: rgba(255, 255, 255, 0.6);
            }
          }

          .toggleBtn {
            display: flex;
            align-items: center;
            width: 58px;
            height: 24px;
            padding: 3px;
            font-size: 14px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            position: relative;

            &,
            * {
              transition: all 0.3s;
            }

            &.on {
              background: rgba(247, 171, 31, 0.2);

              span {
                margin: 0 0 0 34px;
                background: rgba(247, 171, 31, 0.8);
              }

              p {
                &.on {
                  opacity: 1;
                }

                &.off {
                  opacity: 0;
                }
              }
            }

            span {
              width: 18px;
              height: 18px;
              border-radius: 50%;
              background: rgba(255, 255, 255, 0.8);
            }

            p {
              top: 50%;
              transform: translate(0, -50%);
              position: absolute;

              &.on {
                opacity: 0;
                left: 14px;
              }

              &.off {
                opacity: 1;
                right: 10px;
              }
            }
          }
        }
      }

      .saveBtn {
        width: 200px;
        height: 56px;
        font-size: 18px;
        font-weight: 700;
        background: rgba(255, 255, 255, 0.1);
        border: 1.4px solid #fff;
        border-radius: 12px;
      }
    }
  }
`;
