import { useTranslation } from "react-i18next";
import styled from "styled-components";

export default function Toast({ msg }) {
  const { t } = useTranslation();
  return <ToastBox>{t(msg)}</ToastBox>;
}

const ToastBox = styled.div`
  position: absolute;
  bottom: 4%;
  left: 50%;
  padding: 11px;
  transform: translate(-50%, -50%);
  z-index: 3;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  border-radius: 4px;
  border: 1px solid #000;
`;
