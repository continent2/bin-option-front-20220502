import axios from "axios";
import { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, Navigate } from "react-router";
import { io } from "socket.io-client";
import { API, URL } from "../../configs/api";
import {
  setBetFlag,
  setClosedFlag,
  setDividObj,
  setOpenedData,
} from "../../reducers/bet";
import { setToast } from "../../util/Util";
import Demo from "./Demo";
import Live from "./Live";
import { useNavigate } from "react-router-dom";

export default function Bet() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const demoToken = localStorage.getItem("demoToken");
  const isMobile = useSelector((state) => state.common.isMobile);
  const betFlag = useSelector((state) => state.bet.betFlag);

  const [notiOpt, setNotiOpt] = useState("");
  const [socketIo, setSocketIo] = useState("");

  function getNotiOpt() {
    axios
      .get(API.NOTI, {
        headers: {
          Authorization: token || demoToken,
        },
      })
      .then(({ data }) => {
        let _resp = data.resp;
        let _notiOpt = {};

        _notiOpt.betEnd = _resp.betend;
        _notiOpt.orderRequest = _resp.orderrequest;

        setNotiOpt({ ..._notiOpt });
      })
      .catch(console.error);
  }

  useEffect(() => {
    setSocketIo(
      io(URL, {
        transports: ["websocket"],
        query: {
          token:
            localStorage.getItem("token") || localStorage.getItem("demoToken"),
        },
      })
    );
  }, []);

  function getBetSocket() {
    socketIo.on("connect", (res) => {
      console.log("socketIo connect", socketIo);
    });

    socketIo.on("connect_error", (res) => {
      console.error("auth", res);
    });

    socketIo.on("dividendrate_0913", (res) => {
      console.log("dividendrate_0913", res);
      if (res) {
      } else {
        return;
      }
      dispatch(setDividObj(res));
    });

    socketIo.on("bet", (res) => {
      console.log("bet", res);
    });

    socketIo.on("bet_closed", (res) => {
      console.log("bet_closed", res);

      if (notiOpt.betEnd) {
        res.map((v, i) => {
          setTimeout(() => {
            setToast({
              type: "closed",
              assetInfo: { name: v.name, side: v.data.side },
              amount: v.data.amount / 10 ** 6,
              profit: v.profit,
              data: v.data,
              isMobile,
            });
          }, i * 1000);
        });
      }

      dispatch(setClosedFlag());
      dispatch(setBetFlag());
    });

    console.log("socketIo", socketIo);
  }

  function getDemoToken() {
    if (token || demoToken) return;

    axios
      .get(`${API.USER_DEMO_TOKEN}`)
      .then(({ data }) => {
        console.log(data.token);

        localStorage.setItem("demoToken", data.token);
        window.location.reload();
      })
      .catch((err) => console.error(err));
  }

  function getLog() {
    socketIo.emit("bet", {}, (res) => {
      console.log("bet", res);
      dispatch(setOpenedData(res));
    });
  }

  useLayoutEffect(() => {
    getDemoToken();
    getNotiOpt();
  }, []);

  useEffect(() => {
    if (!socketIo) return;

    getLog();

    let logInterval = setInterval(() => {
      getLog();
    }, 1000);

    return () => {
      clearInterval(logInterval);
    };
  }, [socketIo, betFlag]);

  useEffect(() => {
    if (!(socketIo && notiOpt)) return;
    getBetSocket();
  }, [socketIo, notiOpt]);

  useEffect(() => {
    if (!socketIo) return;

    return () => {
      localStorage.removeItem("demoToken");
      socketIo.on("disconnect", () => {
        console.log("disconnected");
      });

      socketIo.disconnect("dividendrate_0913");
      socketIo.disconnect("bet");
      socketIo.disconnect("bet_closed");
    };
  }, [socketIo]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="live" />} />
      <Route
        path="/live"
        element={<Live socket={socketIo} notiOpt={notiOpt} />}
      />
      <Route
        path="/demo"
        element={<Demo socket={socketIo} notiOpt={notiOpt} />}
      />
    </Routes>
  );
}
