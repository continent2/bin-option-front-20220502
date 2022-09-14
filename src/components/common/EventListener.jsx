import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { gCliId } from "../../configs/setting";
import { useDispatch } from "react-redux";
import { setMobile } from "../../reducers/common";
import axios from "axios";
import { API } from "../../configs/api";

export default function EventListener() {
  const location = useLocation();
  const dispatch = useDispatch();

  function handleResize() {
    if (window.innerWidth >= 1200) dispatch(setMobile(false));
    else dispatch(setMobile(true));
  }

  function initGApi() {
    function start() {
      window.gapi.client.init({
        clientId: gCliId,
        scope: "email",
        plugin_name: "binary",
      });
    }

    window.gapi.load("client:auth2", start);
  }

  useLayoutEffect(() => {
    initGApi();

    handleResize();

    axios.defaults.headers.Authorization = localStorage.getItem("token");
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    axios.defaults.headers.Authorization = localStorage.getItem("token");
  }, [location]);

  useEffect(() => {
    if (!localStorage.getItem("token")) return;

    setInterval(() => {
      axios
        .get(API.AUTH)
        .then(({ data }) => {})
        .catch((err) => {
          console.error(err);
          localStorage.removeItem("token");
          window.location.reload();
        });
    }, 60000);
  }, [location]);

  return <></>;
}
