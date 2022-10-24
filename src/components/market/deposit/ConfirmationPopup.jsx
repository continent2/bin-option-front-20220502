import axios from "axios";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import styled from "styled-components";
import I_x from "../../../img/icon/I_x.svg";
import I_xWhite from "../../../img/icon/I_xWhite.svg";
import { API} from '../../../configs/api'
export default function ConfirmationPopup({ off , amount , asset 
  , cleardisp
}) {
  const { t } = useTranslation();
  const isMobile = useSelector((state) => state.common.isMobile);
  console.log ( `@jdata` , {amount , asset} )
  let token = localStorage.getItem ( 'token')
  if ( amount && asset && asset.uuid ){}
  else { alert (`Please set amount`) ; off() ; return }
  function onClickConfirmBtn() {
    axios.post ( API.HANDLE_DEPOSIT + `/${asset?.uuid}` , {
      amount // : ''
      , amountunit : asset?.symbol // ''
      , timestamp : moment().unix()
      , sendingbank : ''
      , sendingaccount : ''
      , sendername  : ''
    } , {headers:{ 
      Authorization: token ,
    }} ).then ( resp=>{
      if ( resp?.data?.status == 'OK' ){
        off();
        alert ( ) ;
        cleardisp ()
        return 
      } else { off();alert ( t('Err-Please inquire admin')) ; return }
    }).catch ( err=>{ console.log(err) ; off(); return })
//    off();
  }

  if (isMobile)
    return (
      <MconfirmationPopupBox className="defaultPopup">
        <article className="topArea">
          <span className="blank" />

          <p className="title">{t("Confirmation")}</p>

          <button className="exitBtn" onClick={() => off()}>
            <img src={I_xWhite} alt="" />
          </button>
        </article>

        <article className="contArea">
          <p className="explain">
            {t(
              'I understand that clicking on "Payment Completed" before a successful payment may cause my account to be restricted.'
            )}
          </p>

          <div className="btnBox">
            <button className="confirmBtn" onClick={onClickConfirmBtn}>
              {t("Acknowledge")}
            </button>
          </div>
        </article>
      </MconfirmationPopupBox>
    );
  else
    return (
      <PconfirmationPopupBox className="defaultPopup">
        <article className="topArea">
          <span className="blank" />

          <p className="title">{t("Confirmation")}</p>

          <button className="exitBtn" onClick={() => off()}>
            <img src={I_x} alt="" />
          </button>
        </article>

        <article className="contArea">
          <p className="explain">
            {t('I understand that clicking on "Payment Completed" before a successful payment may cause my account to be restricted.')}
          </p>

          <div className="btnBox">
            <button className="confirmBtn" onClick={onClickConfirmBtn}>
              {t("Acknowledge")}
            </button>

            <button className="cancelBtn" onClick={() => off()}>
              {t("Cancel")}
            </button>
          </div>
        </article>
      </PconfirmationPopupBox>
    );
}

const MconfirmationPopupBox = styled.section`
  width: 328px;
  max-height: 80vh;
  overflow-y: scroll;
  color: #fff;

  .topArea {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    padding: 0 30px;

    .title {
      font-size: 16px;
    }

    .exitBtn {
      img {
        width: 16px;
        opacity: 0.4;
      }
    }
  }

  .contArea {
    display: flex;
    flex-direction: column;
    gap: 22px;
    padding: 12px 24px 30px;

    .explain {
      font-size: 14px;
      text-align: center;
    }

    .btnBox {
      .confirmBtn {
        width: 100%;
        height: 50px;
        font-size: 16px;
        font-weight: 700;
        color: #4e3200;
        background: linear-gradient(99.16deg, #604719 3.95%, #f7ab1f 52.09%);
        border-radius: 8px;
      }
    }
  }
`;

const PconfirmationPopupBox = styled.section`
  width: 500px;
  color: #fff;

  .topArea {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 70px;
    padding: 0 30px;

    .title {
      font-size: 18px;
    }

    .exitBtn {
      img {
        width: 16px;
        opacity: 0.4;
      }
    }
  }

  .contArea {
    display: flex;
    flex-direction: column;
    gap: 44px;
    padding: 30px 40px 44px;

    .explain {
      font-size: 14px;
      text-align: center;
    }

    .btnBox {
      display: flex;
      align-items: center;
      gap: 20px;

      button {
        flex: 1;
        height: 56px;
        font-size: 18px;
        font-weight: 700;
        border-radius: 10px;

        &.confirmBtn {
          color: #4e3200;
          background: linear-gradient(99.16deg, #604719 3.95%, #f7ab1f 52.09%);
        }

        &.cancelBtn {
          color: #f7ab1f;
          border: 2px solid #f7ab1f;
        }
      }
    }
  }
`;
