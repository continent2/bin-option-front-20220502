import styled from "styled-components";
import I_xWhite from "../../img/icon/I_xWhite.svg";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { API } from "../../configs/api";
import { setToast } from "../../util/Util";
import { useNavigate } from "react-router-dom";

export default function ReqeustPopup({ off }) {
  const { t } = useTranslation();
  const isMobile = useSelector((state) => state.common.isMobile);
  const [cont, setCont] = useState("");

  const navigate = useNavigate();

  function onClickSendBtn() {
    if (!localStorage.getItem("token")) {
      navigate("/auth");
    }

    axios
      .post(`${API.INQUIRY_ENROLL}`, {
        content: cont,
      })
      .then((res) => {
        console.log(res);
        off();
        setToast({ type: "qna", cont: "문의가 정상적으로 요청되었습니다." });
      })
      .catch(console.error);
  }

  if (isMobile)
    return (
      <MrequestPopupBox>
        <article className="topArea">
          <span className="blank" />

          <p className="title">{t("Submit a request")}</p>

          <button className="exitBtn" onClick={() => off()}>
            <img src={I_xWhite} alt="" />
          </button>
        </article>

        <article className="contArea">
          <textarea
            value={cont}
            onChange={(e) => setCont(e.target.value)}
            placeholder=""
          />

          <button className="sendBtn" onClick={onClickSendBtn}>
            {t("Send request")}
          </button>
        </article>
      </MrequestPopupBox>
    );
  else
    return (
      <PrequestPopupBox>
        <article className="topArea">
          <span className="blank" />

          <p className="title">{t("Submit a request")}</p>

          <button className="exitBtn" onClick={() => off()}>
            <img src={I_xWhite} alt="" />
          </button>
        </article>

        <article className="contArea">
          <textarea
            value={cont}
            onChange={(e) => setCont(e.target.value)}
            placeholder=""
          />

          <button className="sendBtn" onClick={onClickSendBtn}>
            {t("Send request")}
          </button>
        </article>
      </PrequestPopupBox>
    );
}

const MrequestPopupBox = styled.section`
  max-height: 60vh;
  overflow-y: scroll;
  color: #fff;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 20px 20px 0px 0px;
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  right: 0;
  bottom: 0;
  left: 0;
  position: fixed;
  z-index: 6;

  .topArea {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    padding: 0 20px;
    font-size: 18px;

    .blank,
    .exitBtn img {
      width: 16px;
      opacity: 0.2;
    }
  }

  .contArea {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 0 20px 30px;

    textarea {
      height: 316px;
      padding: 10px;
      font-size: 16px;
      background: rgba(0, 0, 0, 0.3);
      border: 1.4px solid transparent;
      border-radius: 10px;

      &:focus-within {
        border-color: #fff;
      }
    }

    .sendBtn {
      height: 50px;
      font-size: 18px;
      font-weight: 700;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid #fff;
      border-radius: 12px;

      &:hover {
        box-shadow: 0px 6px 6px rgba(0, 0, 0, 0.2);
      }
    }
  }
`;

const PrequestPopupBox = styled.section`
  width: 500px;
  height: 360px;
  color: #fff;
  background: rgba(0, 0, 0, 0.4);
  border: 1.4px solid rgba(255, 255, 255, 0.14);
  border-radius: 20px;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  position: fixed;
  z-index: 6;

  .topArea {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 70px;
    padding: 0 30px;
    font-size: 20px;

    .blank,
    .exitBtn img {
      width: 16px;
      opacity: 0.2;
    }
  }

  .contArea {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 14px 40px 0;

    textarea {
      height: 140px;
      padding: 10px;
      font-size: 16px;
      background: rgba(0, 0, 0, 0.3);
      border: 1.4px solid transparent;
      border-radius: 10px;

      &:focus-within {
        border-color: #fff;
      }
    }

    .sendBtn {
      height: 56px;
      font-size: 18px;
      font-weight: 700;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid #fff;
      border-radius: 12px;

      &:hover {
        box-shadow: 0px 6px 6px rgba(0, 0, 0, 0.2);
      }
    }
  }
`;
