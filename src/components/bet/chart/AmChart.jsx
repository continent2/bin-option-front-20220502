import { useEffect, useState } from "react";
import CandleChart from "./CandleChart";
import HeikanAshiChart from "./HeikanAshiChart";
import LineChart from "./LineChart";

export default function AmChart({ assetInfo, chartOpt, socket, page }) {
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!assetInfo?.APISymbol) return;

    setBusy(true);
    setTimeout(() => setBusy(false), 1);
  }, [assetInfo, chartOpt]);

  if (busy) return <></>;
  else
    return (
      <>
        {chartOpt.typeStr === "Line" ? (
          <LineChart
            assetInfo={assetInfo}
            chartOpt={chartOpt}
            socket={socket}
          />
        ) : (
          <></>
        )}
        {chartOpt.typeStr === "Candles" ? (
          <CandleChart
            assetInfo={assetInfo}
            chartOpt={chartOpt}
            socket={socket}
            page={page}
          />
        ) : (
          <></>
        )}
        {chartOpt.typeStr === "Heiken Ashi" ? (
          <HeikanAshiChart
            assetInfo={assetInfo}
            chartOpt={chartOpt}
            socket={socket}
            page={page}
          />
        ) : (
          <></>
        )}
      </>
    );
}
