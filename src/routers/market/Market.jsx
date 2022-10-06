import { Route, Routes } from "react-router";
import styled from "styled-components";
import DefaultHeader from "../../components/header/DefaultHeader";
import LeftNav from "../../components/common/LeftNav";
import Deposit from "./Deposit";
import { D_marketLeftBarList } from "../../data/D_market";
import WithDrawal from "./WithDrawal";
import History from "./History";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../../configs/api";

export default function Market() {
  const isMobile = useSelector((state) => state.common.isMobile);
  const [userData, setUserData] = useState({});
  useEffect(() => {
    axios.get(`${API.AUTH}`).then(({ data }) => {
      console.log(data.result);
      setUserData(data.result);
    });
  }, []);

  if (isMobile)
    return (
      <MmarketBox>
        <Routes>
          <Route path="/deposit" element={<Deposit userData={userData} />} />
          <Route path="/withdrawal" element={<WithDrawal />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </MmarketBox>
    );
  else
    return (
      <PmarketBox>
        x
        <DefaultHeader border />
        <LeftNav list={D_marketLeftBarList} baseUrl={"market"} />
        <Routes>
          <Route path="/deposit" element={<Deposit userData={userData} />} />
          <Route path="/withdrawal" element={<WithDrawal />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </PmarketBox>
    );
}

const MmarketBox = styled.main`
  width: 100vw;
  height: 100vh;
  padding: 56px 0 0;
  color: #fff;
  background: #0a0e17;
  overflow: hidden;
`;

const PmarketBox = styled.main`
  display: flex;
  width: 100vw;
  height: 100vh;
  padding: 60px 0 0 0;
  color: #fff;
  background: #0a0e17;
  overflow: hidden;
`;
