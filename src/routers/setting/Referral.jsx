import { useState } from "react";
import styled from "styled-components";
import I_cpWhite from "../../img/icon/I_cpWhite.svg";
import { onClickCopy, setToast } from "../../util/Util";
import { D_referralCategoryList } from "../../data/D_setting";
import Recommender from "../../components/setting/referral/Recommender";
import History from "../../components/setting/referral/History";
import DefaultHeader from "../../components/header/DefaultHeader";
import { useSelector } from "react-redux";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { API } from "../../configs/api";

export default function Referal({ userData }) {
  const { t } = useTranslation();
  const isMobile = useSelector((state) => state.common.isMobile);

  const [category, setCategory] = useState(0);
  const [urlHead, setUrlHead] = useState("");

  function onClickCopyBtn(str) {
    onClickCopy(str);
    setToast({ type: "alarm", cont: "Copied Successfully" });
  }

  function getUrlHead() {
    axios
      .get(API.ADMIN_QR)
      .then(({ data }) => {
        console.log(data.url);
        setUrlHead(data.url);
      })
      .catch(console.error);
  }

  useEffect(() => {
    getUrlHead();
  }, []);

  if (isMobile)
    return (
      <>
        <DefaultHeader title="Referrals" />

        <MreferralBox>
          <section className="innerBox">
            <article className="titleArea">
              <p className="explain">
                {t(
                  "Share your referral link! Each new user who accesses this link will be paid 1% of their profits for each transaction."
                )}
              </p>
            </article>

            <article className="recommendArea">
              <strong className="title">{t("Recommend")}</strong>

              <ul className="dataList">
                <li>
                  <p className="key">{t("Code")}</p>
                  <button
                    className="value"
                    onClick={() => onClickCopyBtn(userData?.referercode)}
                  >
                    <p className="code">{userData?.referercode}</p>
                    <img src={I_cpWhite} alt="" />
                  </button>
                </li>

                <li>
                  <p className="key">{t("Link")}</p>
                  <button
                    className="value"
                    onClick={() =>
                      onClickCopyBtn(
                        `${urlHead}/#/auth/signup?refcode=${userData?.referercode}`
                      )
                    }
                  >
                    <p className="url">
                      {`${urlHead}/#/auth/signup?refcode=${userData?.referercode}`}
                    </p>
                    <img src={I_cpWhite} alt="" />
                  </button>
                </li>
              </ul>
            </article>

            <article className="listArea">
              <ul className="categoryList">
                {D_referralCategoryList.map((v, i) => (
                  <li
                    key={i}
                    className={`${category === i && "on"}`}
                    onClick={() => setCategory(i)}
                  >
                    {t(v)}
                  </li>
                ))}
              </ul>

              {category === 0 && <Recommender />}
              {category === 1 && <History />}
            </article>
          </section>
        </MreferralBox>
      </>
    );
  else
    return (
      <>
        <PreferralBox>
          <section className="innerBox">
            <article className="titleArea">
              <strong className="title">{t("Referrals")}</strong>
              <p className="explain">
                {t(
                  "Share your referral link! Each new user who accesses this link will be paid 1% of their profits for each transaction."
                )}
              </p>
            </article>

            <article className="recommendArea">
              <strong className="title">{t("Recommend")}</strong>

              <ul className="dataList">
                <li>
                  <p className="key">{t("Code")}</p>
                  <button
                    className="value"
                    onClick={() => onClickCopyBtn(userData?.referercode)}
                  >
                    <p className="code">{userData?.referercode}</p>
                    <img src={I_cpWhite} alt="" />
                  </button>
                </li>

                <li>
                  <p className="key">{t("Link")}</p>
                  <button
                    className="value"
                    onClick={() =>
                      onClickCopyBtn(
                        `${urlHead}/#/auth/signup?refcode=${userData?.referercode}`
                      )
                    }
                  >
                    <p className="url">
                      {`${urlHead}/#/auth/signup?refcode=${userData?.referercode}`}
                    </p>
                    <img src={I_cpWhite} alt="" />
                  </button>
                </li>
              </ul>
            </article>

            <article className="listArea">
              <ul className="categoryList">
                {D_referralCategoryList.map((v, i) => (
                  <li
                    key={i}
                    className={`${category === i && "on"}`}
                    onClick={() => setCategory(i)}
                  >
                    {t(v)}
                  </li>
                ))}
              </ul>

              {category === 0 && <Recommender />}
              {category === 1 && <History />}
            </article>
          </section>
        </PreferralBox>
      </>
    );
}

const MreferralBox = styled.main`
  height: 100%;
  padding: 20px;
  overflow: hidden;

  .innerBox {
    height: 100%;
    overflow-y: scroll;

    .titleArea {
      .explain {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.6);
      }
    }

    .recommendArea {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin: 40px 0 0 0;

      .title {
        font-size: 16px;
      }

      .dataList {
        display: flex;
        flex-direction: column;
        gap: 14px;

        li {
          display: flex;
          align-items: center;
          gap: 20px;
          height: 50px;
          padding: 0 20px;
          font-size: 14px;
          background: rgba(255, 255, 255, 0.1);
          border: 1.4px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;

          &:focus-within {
            border-color: #fff;
          }

          .key {
            color: rgba(255, 255, 255, 0.4);
          }

          .value {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 12px;
            overflow: hidden;

            img {
              width: 18px;
            }

            p {
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
        }
      }
    }

    .listArea {
      display: flex;
      flex-direction: column;
      gap: 20px;
      max-width: 100%;
      margin: 60px 0 0 0;

      .categoryList {
        display: flex;

        li {
          flex: 1;
          height: 32px;
          font-size: 16px;
          font-weight: 700;
          text-align: center;
          border-bottom: 4px solid transparent;
          opacity: 0.4;
          cursor: pointer;

          &.on {
            border-color: #fff;
            opacity: 1;
          }
        }
      }
    }
  }
`;

const PreferralBox = styled.main`
  flex: 1;
  height: 100%;
  padding: 70px 140px 0;
  overflow-y: scroll;

  @media (max-width: 1440px) {
    max-width: 1020px;
    padding: 70px 40px 70px 80px;
  }

  .innerBox {
    height: 100%;

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

    .recommendArea {
      display: flex;
      flex-direction: column;
      gap: 14px;
      width: 900px;
      margin: 44px 0 0 0;
      font-size: 16px;

      .title {
        font-size: 16px;
      }

      .dataList {
        display: flex;
        flex-direction: column;
        gap: 14px;

        li {
          display: flex;
          align-items: center;
          gap: 40px;
          height: 56px;
          padding: 0 24px;
          font-size: 16px;
          background: rgba(255, 255, 255, 0.1);
          border: 1.4px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;

          &:focus-within {
            border-color: #fff;
          }

          .key {
            color: rgba(255, 255, 255, 0.4);
          }

          .value {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 10px;

            img {
              width: 16px;
            }
          }
        }
      }
    }

    .listArea {
      display: flex;
      flex-direction: column;
      gap: 20px;
      max-width: 100%;
      margin: 80px 0 0 0;

      .categoryList {
        display: flex;
        gap: 14px;

        li {
          height: 32px;
          font-size: 16px;
          font-weight: 700;
          border-bottom: 4px solid transparent;
          opacity: 0.4;
          cursor: pointer;

          &.on {
            border-color: #fff;
            opacity: 1;
          }
        }
      }
    }
  }
`;
