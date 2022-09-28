import { useEffect, useLayoutEffect, useState } from "react";
import styled from "styled-components";
import * as am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Dark from "@amcharts/amcharts5/themes/Dark";
import * as am5stock from "@amcharts/amcharts5/stock";
import * as am5xy from "@amcharts/amcharts5/xy";
import axios from "axios";
import { API } from "../../../configs/api";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { setPrice } from "../../../reducers/bet";

export default function CandleChart({ assetInfo, chartOpt, socket, page }) {
  const dispatch = useDispatch();

  const isMobile = useSelector((state) => state.common.isMobile);
  const openedData = useSelector((state) => state.bet.openedData);

  const [valueSeries, setValueSeries] = useState();
  const [dateAxis, setDateAxis] = useState();
  const [valueAxis, setValueAxis] = useState();
  const [root, setRoot] = useState();
  const [apiData, setApiData] = useState([]);
  const [tooltip, setTooltip] = useState();
  const [currentLabel, setCurrentLabel] = useState();
  const [stockChart, setStockChart] = useState();
  const [currentValueDataItem, setCurrentValueDataItem] = useState();
  const [currentPrice, setCurrentPrice] = useState(0);

  function getPreData() {
    axios
      .get(API.GET_TICKERS, {
        params: {
          barSize: chartOpt.barSize,
          symbol: assetInfo?.APISymbol,
          N: 60,
        },
      })
      .then(({ data }) => {
        let { list } = data;
        list = list.filter((elem) => elem.show);
        let _resData = list || [];

        let _data = [];

        _resData.map((e, i) => {
          if (!e) return;
          _data.push({
            Date: e.starttime * 1000,
            Open: Number(e.open),
            High: Number(e.high),
            Low:
              Number(e.low) > 0
                ? Number(e.low)
                : (
                    (Number(e.open) + Number(e.high) + Number(e.close)) /
                    3
                  ).toFixed(2),
            Close: Number(e.close),
          });
        });

        console.log("_candle_data", _data);
        setApiData([..._data]);
      })
      .catch(console.error);
  }

  function getData(price) {
    let pushData;
    let _apiData = apiData;
    let _lastIndex = _apiData[_apiData.length - 1];
    let _now = new Date().setMilliseconds(0);

    console.log("apiDATA", apiData);
    dispatch(setPrice({ currentPrice: price, pastPrice: _lastIndex.Close }));

    if (
      Math.floor(_now / chartOpt.barSize) !==
      Math.floor(_lastIndex.Date / chartOpt.barSize)
    )
      if (
        Math.floor(_now / chartOpt.barSize) ===
        Math.floor(_lastIndex.Date / chartOpt.barSize)
      ) {
        if (price > _lastIndex.High) _lastIndex.High = price;
        else if (price < _lastIndex.Low) _lastIndex.Low = price;
        _lastIndex.Close = price;

        valueSeries.data.setIndex(valueSeries.data.length - 1, _lastIndex);
      } else {
        pushData = {
          Date: _now,
          Open: _lastIndex.Close,
          High: price,
          Low: price,
          Close: price,
        };
        valueSeries.data.push(pushData);
        valueSeries.data.shift();
      }
    setApiData([...valueSeries.data]);

    if (currentLabel) {
      currentValueDataItem.animate({
        key: "value",
        to: price,
        duration: 500,
        easing: am5.ease.out(am5.ease.cubic),
      });

      currentLabel.set("text", stockChart.getNumberFormatter().format(price));
      let bg = currentLabel.get("background");

      if (bg) bg.set("fill", am5.color(0xf7ab1f));
    }
  }

  function makeXevent({
    dateAxis,
    root,
    tooltip,
    date,
    letter,
    color,
    description,
  }) {
    if (chartOpt.barSize >= 60000) date = new Date(date).setSeconds(0);

    if (!dateAxis) return;
    console.log("chartOpt.barSize", "\n", date, "\n", new Date(date));

    var dataItem = dateAxis.createAxisRange(
      dateAxis.makeDataItem({ value: date })
    );

    var grid = dataItem.get("grid");
    if (grid) {
      grid.setAll({
        visible: false,
        strokeOpacity: 0.8,
        strokeDasharray: [3, 3],
        stroke: color,
      });
    }

    var bullet = am5.Container.new(root, {
      y: -100,
    });

    var circle = bullet.children.push(
      am5.Circle.new(root, {
        radius: 10,
        stroke: color,
        fill: am5.color(0x181c25),
        // tooltipText: description,
        // tooltip: tooltip,
        // tooltipY: 0,
      })
    );

    var label = bullet.children.push(
      am5.Label.new(root, {
        text: letter,
        stroke: color,
        strokeOpacity: 0.6,
        centerX: am5.p50,
        centerY: am5.p50,
      })
    );

    dataItem.set(
      "bullet",
      am5xy.AxisBullet.new(root, {
        location: 0,
        sprite: bullet,
      })
    );

    setTimeout(() => {
      dateAxis.axisRanges.removeValue(dataItem);
    }, 1000);
  }

  function makeYevent({ dateAxis, color, description }) {
    if (!dateAxis) return;

    var dataItem = dateAxis.createAxisRange(
      dateAxis.makeDataItem({ value: description })
    );

    var grid = dataItem.get("grid");
    if (grid) {
      grid.setAll({
        visible: true,
        strokeOpacity: 0.8,
        strokeDasharray: [3, 3],
        stroke: color,
      });
    }

    setTimeout(() => dateAxis.axisRanges.removeValue(dataItem), 1000);
  }

  useLayoutEffect(() => {
    var root = am5.Root.new("ChartBox");
    setRoot(root);
    root.setThemes([am5themes_Animated.new(root), am5themes_Dark.new(root)]);

    var stockChart = root.container.children.push(
      am5stock.StockChart.new(root, {
        background: am5.Rectangle.new(root, {
          fill: am5.color(0x181c25),
        }),
      })
    );

    root.interfaceColors.setAll({
      grid: "rgba(255, 255, 255, 0.1)",
      negative: am5.color(0xff5353),
      positive: am5.color(0x3fb68b),
    });

    setStockChart(stockChart);

    root.numberFormatter.set("numberFormat", "#,###.####");

    var mainPanel = stockChart.panels.push(
      am5stock.StockPanel.new(root, {
        wheelY: "zoomX",
        panX: true,
        panY: true,
      })
    );

    var valueAxis = mainPanel.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {
          pan: "zoom",
        }),
        extraMin: 0.1,
        tooltip: am5.Tooltip.new(root, {}),
        numberFormat: "#,###.####",
        extraTooltipPrecision: 2,
      })
    );

    setValueAxis(valueAxis);

    var dateAxis = mainPanel.xAxes.push(
      am5xy.GaplessDateAxis.new(root, {
        baseInterval: {
          timeUnit: "second",
          count: 1,
        },
        renderer: am5xy.AxisRendererX.new(root, {}),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    setDateAxis(dateAxis);

    let currentValueDataItem = valueAxis.createAxisRange(
      valueAxis.makeDataItem({ value: 0 })
    );
    setCurrentValueDataItem(currentValueDataItem);

    let currentLabel = currentValueDataItem.get("label");
    setCurrentLabel(currentLabel);

    if (currentLabel) {
      currentLabel.setAll({
        fill: am5.color(0xffffff),
        background: am5.Rectangle.new(root, { fill: am5.color(0x000000) }),
      });
    }

    let currentGrid = currentValueDataItem.get("grid");
    if (currentGrid) {
      currentGrid.setAll({
        strokeOpacity: 0.5,
        strokeDasharray: [2, 5],
        stroke: am5.color(0xf7ab1f),
      });
    }

    var valueSeries = mainPanel.series.push(
      am5xy.CandlestickSeries.new(root, {
        name: assetInfo?.APISymbol,
        clustered: false,
        valueXField: "Date",
        valueYField: "Close",
        highValueYField: "High",
        lowValueYField: "Low",
        openValueYField: "Open",
        calculateAggregates: true,
        xAxis: dateAxis,
        yAxis: valueAxis,
        legendValueText:
          "open: [bold]{openValueY}[/] high: [bold]{highValueY}[/] low: [bold]{lowValueY}[/] close: [bold]{valueY}[/]",
        legendRangeValueText: "",
      })
    );

    setValueSeries(valueSeries);

    stockChart.set("stockSeries", valueSeries);

    var valueLegend = mainPanel.plotContainer.children.push(
      am5stock.StockLegend.new(root, {
        stockChart: stockChart,
        paddingTop: isMobile ? 30 : 50,
        paddingLeft: 0,
      })
    );

    var volumeAxisRenderer = am5xy.AxisRendererY.new(root, {
      inside: true,
    });

    volumeAxisRenderer.labels.template.set("forceHidden", true);
    volumeAxisRenderer.grid.template.set("forceHidden", true);

    var volumeValueAxis = mainPanel.yAxes.push(
      am5xy.ValueAxis.new(root, {
        numberFormat: "#.#a",
        height: am5.percent(20),
        y: am5.percent(100),
        centerY: am5.percent(100),
        renderer: volumeAxisRenderer,
      })
    );

    var volumeSeries = mainPanel.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Volume",
        clustered: false,
        valueXField: "Date",
        valueYField: "Volume",
        xAxis: dateAxis,
        yAxis: volumeValueAxis,
        legendValueText: "[bold]{valueY.formatNumber('#,###.0a')}[/]",
      })
    );

    volumeSeries.columns.template.setAll({
      strokeOpacity: 0,
      fillOpacity: 0.5,
    });

    stockChart.set("volumeSeries", volumeSeries);

    valueLegend.data.setAll([valueSeries, volumeSeries]);

    mainPanel.set(
      "cursor",
      am5xy.XYCursor.new(root, {
        yAxis: valueAxis,
        xAxis: dateAxis,
        snapToSeries: [valueSeries],
        snapToSeriesBy: "y!",
      })
    );

    let cursor = mainPanel.get("cursor");

    cursor.lineX.setAll({
      strokeDasharray: [2, 5],
      stroke: am5.color(0xffffff),
    });

    cursor.lineY.setAll({
      strokeDasharray: [2, 5],
      stroke: am5.color(0xffffff),
    });

    var tooltip = am5.Tooltip.new(root, {
      getStrokeFromSprite: false,
      getFillFromSprite: false,
    });

    setTooltip(tooltip);

    tooltip.get("background").setAll({
      stroke: am5.color(0xffffff),
      strokeOpacity: 0.8,
    });

    mainPanel.set("tooltip", tooltip);
  }, []);

  useEffect(() => {
    if (!root) return;

    getPreData();
    let _preInterval = setInterval(() => {
      getPreData();
    }, chartOpt.barSize);

    return () => clearInterval(_preInterval);
  }, [root, chartOpt]);

  useEffect(() => {
    socket.on("get_ticker_price", (res) => {
      if (!res) return;
      console.log("get_ticker_price", res);
      setCurrentPrice(Number(res));
    });

    return () => socket.off("get_ticker_price");
  }, []);

  useEffect(() => {
    if (!apiData[0]) return;
    valueSeries.data.setAll([...apiData]);

    let _dataInterval = setTimeout(() => {
      socket.emit("get_ticker_price", assetInfo.APISymbol);
      if (currentPrice) getData(currentPrice);
    }, 1000);

    return () => {
      clearTimeout(_dataInterval);
    };
  }, [
    apiData,
    currentPrice,
    valueSeries,
    currentLabel,
    currentValueDataItem,
    stockChart,
  ]);

  useEffect(() => {
    if (!openedData) return;
    console.log("OPENEDDATA", openedData);

    openedData
      .filter((v) => v.type === page.toUpperCase())
      .map((e) => {
        makeXevent({
          dateAxis: dateAxis,
          root: root,
          tooltip: tooltip,
          date: Number(moment(e.createdat).format("x")),
          letter: e.side === "HIGH" ? "H" : "L",
          color: am5.color(e.side === "HIGH" ? 0x3fb68b : 0xff5353),
          description: Number(e.startingPrice),
        });

        // makeYevent({
        //   dateAxis: valueAxis,
        //   color: am5.color(e.side === "HIGH" ? 0x3fb68b : 0xff5353),
        //   description: Number(e.startingPrice).toFixed(2),
        // });
      });
  }, [dateAxis, root, tooltip, openedData, chartOpt]);

  return <AmChartBox id="ChartBox"></AmChartBox>;
}

const AmChartBox = styled.div`
  flex: 1;
  overflow: hidden;
`;
