import { HashRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";
import EventListener from "./components/common/EventListener";
import GlobalStyle from "./components/common/globalStyle";
import Auth from "./routers/auth/Auth";
import Bet from "./routers/bet/Bet";
import Finance from "./routers/finance/Finance";
import Lending from "./routers/lending/Lending";
import Market from "./routers/market/Market";
import Position from "./routers/position/Position";
import Qna from "./routers/qna/Qna";
import Setting from "./routers/setting/Setting";
import Test from "./Test";
import "./util/ReactToastify.css";
import React, { useState, useEffect } from "react";

export default function App() {
  const [details, setDetails] = useState(null);

  const getUserGeolocationDetails = () => {
    fetch("https://geolocation-db.com/json/0f761a30-fe14-11e9-b59f-e53803842572")
      .then((response) => response.json())
      .then((data) => setDetails(data));
  };

  useEffect(() => {
    getUserGeolocationDetails();
  }, []);

  if (details.country_code !== "US") {
    return (
      <AppBox className="appBox">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Oxygen:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@800&display=swap" rel="stylesheet" />
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <HashRouter>
          <GlobalStyle />
          <EventListener />

          <Routes>
            <Route path="/" element={<Lending />} />
            <Route path="/auth/*" element={<Auth />} />
            <Route path="/market/*" element={<Market />} />
            <Route path="/bet/*" element={<Bet />} />
            <Route path="/position/*" element={<Position />} />
            <Route path="/finance/*" element={<Finance />} />
            <Route path="/setting/*" element={<Setting />} />

            <Route path="/qna" element={<Qna />} />

            <Route path="/test" element={<Test />} />
          </Routes>
        </HashRouter>
      </AppBox>
    );
  } else {
    alert("Can not Access");
  }
}

const AppBox = styled.div`
  width: 100vw;
  color: #2a2a2a;
  overflow-x: hidden;
`;
