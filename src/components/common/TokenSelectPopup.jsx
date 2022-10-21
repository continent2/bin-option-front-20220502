import { useSelector } from "react-redux";
import styled from "styled-components";

export default function TokenSelectPopup({
  off,
  list,
  setCont,
  asset,
  setAsset,
  setConfirm,
}) {
  const isMobile = useSelector((state) => state.common.isMobile);
  console.log(list);
  function onClickCont(v) {
    // if (setCont) setCont(v);
    if (setAsset) setAsset(v);
    if (off) off();
    if (setConfirm) setConfirm(true);
  }

  if (isMobile)
    return (
      <MselectPopupBox className="selectPopup">
        {/* {list.map((v, i) => (
          <li key={i} onClick={() => onClickCont(v)}>
            <img className="icon" src={v.icon} />
            <p>{v.text}</p>
          </li>
        ))} */}
        {list.map((v, i) => {
          return (
            <li key={v.symbol} onClick={() => onClickCont(v)}>
              <img className="icon" src={v.logourl} />
              <p>{v.symbol}</p>
            </li>
          );
        })}
      </MselectPopupBox>
    );
  else
    return (
      // <PselectPopupBox className="selectPopup">
      //   {list.map((v, i) => (
      //     <li key={i} onClick={() => onClickCont(v)}>
      //       <img className="icon" src={v.icon} />
      //       <p>{v.text}</p>
      //     </li>
      //   ))}
      // </PselectPopupBox>
      <PselectPopupBox className="selectPopup">
        {list.map((v, i) => {
          return (
            <li key={v.symbol} onClick={() => onClickCont(v)}>
              <img className="icon" src={v.logourl} />
              <p>{v.symbol}</p>
            </li>
          );
        })}
        {/* <li key={asset.symbol} onClick={() => onClickCont(asset)}>
          <img className="icon" src={asset.logourl} />
          <p>{asset.symbol}</p>
        </li> */}
      </PselectPopupBox>
    );
}

const MselectPopupBox = styled.ul`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: inherit;
  position: absolute;
  overflow-y: scroll;
  z-index: 4;

  li {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    height: 50px;
    padding: 0 16px;
    font-size: 18px;
    font-weight: 700;
    opacity: 0.4;
    cursor: pointer;

    &:hover {
      opacity: 1;
    }

    .icon {
      width: 30px;
      aspect-ratio: 1;
      object-fit: contain;
    }
  }
`;

const PselectPopupBox = styled.ul`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 62px 0 12px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 0 0 10px 10px;
  overflow-y: scroll;
  top: 0px;
  position: absolute;
  z-index: 4;

  li {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    height: 56px;
    padding: 0 22px;
    font-size: 20px;
    font-weight: 700;
    opacity: 0.4;
    cursor: pointer;

    &:hover {
      opacity: 1;
    }

    .icon {
      width: 38px;
      height: 38px;
      object-fit: contain;
      box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.4);
    }
  }
`;
