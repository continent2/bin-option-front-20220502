import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import L_yellow from "../../img/logo/L_yellow.svg";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

export default function LandingFooter() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isMobile = useSelector((state) => state.common.isMobile);

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
      </MlandingFooterBox>
    );
  else
    return (
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
