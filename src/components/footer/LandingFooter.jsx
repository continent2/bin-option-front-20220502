import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import L_yellow from "../../img/logo/L_yellow.svg";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { nettype, version } from "../../configs/nettype";
import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../../configs/api";
// const FRONTVER  = '' 
export default function LandingFooter() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [frontVer, setFrontVer] = useState({});

  const isMobile = useSelector((state) => state.common.isMobile);

  useEffect(() => {
    try {
      axios.get(API.GET_FRONT_VER).then(({ data }) => {
        setFrontVer(data.respdata);
        console.log(data);
        console.log(data.respdata.value.split("-")[0]);
        if (version?.includes(data.respdata.value.split("-")[0])) {
          console.log("버전 일치함");
        } else {
          console.log("버전 안 일치함");
          // window.location.reload()
        }
        // if(data.respdata.value !== nettype)
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  // useEffect(() => {
  //   axios
  //     .get("https://api.github.com/repos/laravel/framework/releases")
  //     .then((res) => console.log(res));
  // }, []);

  if (isMobile)
    return (
      <MlandingFooterBox>
        <section className="innerBox">
          <article className="contArea">
            <div className="termBox contBox">
              <p className="key">{t("Privacy and Regulation")}</p>

              <nav>
                <button className="" onClick={() => {}}>
                  {t("Privacy Policy")}
                </button>
                <button className="" onClick={() => {}}>
                  {t("Terms of Use")}
                </button>
              </nav>
            </div>

            <div className="supportBox contBox">
              <p className="key">{t("Support")}</p>

              <nav>
                <p>Support@betbit.com</p>
                <p>help@betbit.com</p>
              </nav>
            </div>
          </article>

          <article className="cpRightArea">
            <p className="copyright">
              {t("© Betbit, 2022. All rights reserved.")}
            </p>
          </article>
        </section>
        <section className="version">
          <p>version : {version}</p>
        </section>
      </MlandingFooterBox>
    );
  else
    return (
      <>
        <PlandingFooterBox>
          <section className="innerBox">
            <article className="leftArea">
              <div className="logoBox">
                <img className="logo" src={L_yellow} alt="" />

                <p className="copyright">
                  {t("© Betbit, 2022. All rights reserved.")}
                </p>
              </div>
            </article>

            <article className="rightArea">
              <div className="termBox contBox">
                <p className="key">{t("Privacy and Regulation")}</p>

                <nav>
                  <button className="" onClick={() => {}}>
                    {t("Privacy Policy")}
                  </button>
                  <button className="" onClick={() => {}}>
                    {t("Terms of Use")}
                  </button>
                </nav>
              </div>

              <div className="supportBox contBox">
                <p className="key">{t("Support")}</p>

                <nav>
                  <p>Support@betbit.com</p>
                  <p>help@betbit.com</p>
                </nav>
              </div>
            </article>
          </section>
        </PlandingFooterBox>
        <section
          className="version"
          style={{
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: "13px",
            fontWeight: "300",
            marginLeft: "20px",
            marginBottom: "15px",
          }}
        >
          <p>version : {version}</p>
        </section>
      </>
    );
}

const MlandingFooterBox = styled.footer`
  padding: 60px 20px 42px;
  margin: 120px 0 0 0;

  .innerBox {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .contArea {
      display: flex;
      flex-direction: column;
      gap: 20px;

      .contBox {
        display: flex;
        flex-direction: column;
        gap: 14px;
        font-size: 12px;

        .key {
          font-size: 14px;
          font-weight: 500;
        }

        nav {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
          color: rgba(255, 255, 255, 0.4);
        }
      }
    }

    .cpRightArea {
      .copyright {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.4);
      }
    }
  }
  .version {
    margin-top: 20px;
    color: rgba(255, 255, 255, 0.7);
    font-size: 10px;
    font-weight: 300;
  }
`;

const PlandingFooterBox = styled.footer`
  display: flex;
  justify-content: center;
  height: 200px;
  margin: 240px 0 0;

  .innerBox {
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 1260px;
    font-size: 14px;

    .leftArea {
      .logoBox {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 14px;

        .logo {
          height: 28px;
        }

        .copyright {
          font-size: 14px;
          opacity: 0.4;
        }
      }
    }

    .rightArea {
      display: flex;
      gap: 60px;

      .contBox {
        display: flex;
        flex-direction: column;
        gap: 14px;

        .key {
          font-size: 18px;
          font-weight: 500;
        }

        nav {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
          font-size: 14px;
          opacity: 0.4;
        }
      }
    }
  }
`;
