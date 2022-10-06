import axios from "axios";
import { useEffect } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";
import EventListener from "./components/common/EventListener";
import GlobalStyle from "./components/common/globalStyle";
import { API } from "./configs/api";
import { nettype } from "./configs/nettype";
import Auth from "./routers/auth/Auth";
import Bet from "./routers/bet/Bet";
import Finance from "./routers/finance/Finance";
import Landing from "./routers/landing/Landing";
import Market from "./routers/market/Market";
import Position from "./routers/position/Position";
import Qna from "./routers/qna/Qna";
import Setting from "./routers/setting/Setting";
import "./util/ReactToastify.css";
// import "react-toastify/dist/ReactToastify.css";

export default function App() {
  useEffect(() => {
    try {
      axios
        .get(`${API.GET_RECEIVE_DEPOSIT_ASSET}?nettype=${nettype}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })
        .then(({ data }) => {
          console.log({ data });
          const asset = data.respdata.listtokens.filter((v, i) => {
            return v.nettype === nettype;
          });
          localStorage.setItem("assetsymbol", asset[0].symbol);
          localStorage.setItem("asset", JSON.stringify(asset[0]));
        });
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <AppBox className="appBox">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="true"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Oxygen:wght@300;400;600;700&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@800&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@700&display=swap"
        rel="stylesheet"
      />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <HashRouter>
        <GlobalStyle />
        <EventListener />

        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth/*" element={<Auth />} />x
          <Route path="/market/*" element={<Market />} />
          <Route path="/bet/*" element={<Bet />} />
          <Route path="/position/*" element={<Position />} />
          <Route path="/finance/*" element={<Finance />} />
          <Route path="/setting/*" element={<Setting />} />
          <Route path="/qna" element={<Qna />} />
        </Routes>
      </HashRouter>
    </AppBox>
  );
}

const AppBox = styled.div`
  width: 100vw;
  color: #2a2a2a;
  overflow-x: hidden;
`;
