import { useEffect, useState } from "react";
import styled from "styled-components";
import { D_tokenCategoryList } from "../../data/D_bet";
import I_searchWhite from "../../img/icon/I_searchWhite.svg";
import I_xWhite from "../../img/icon/I_xWhite.svg";
import I_starYellow from "../../img/icon/I_starYellow.svg";
import I_starYellowO from "../../img/icon/I_starYellowO.svg";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { API } from "../../configs/api";
import { setTokenPopupData } from "../../reducers/bet";
import { getDividFromData } from "../../util/Util";

export default function TokenPopup({ off, setAssetInfo, getBookMark }) {
  const dispatch = useDispatch();
  const isMobile = useSelector((state) => state.common.isMobile);
  const dividObj = useSelector((state) => state.bet.dividObj);

  const [categoryList, setCategoryList] = useState([]);
  const [category, setCategory] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const [search, setSearch] = useState("");
  const [listData, setListData] = useState([]);

  function getAssetWithSearch(_search) {
    axios
      .get(`${API.GET_ASSETS}`, {
        params: { searchkey: _search, group: category },
      })
      .then(({ data }) => {
        console.log(data);
        setListData(data.resp);
        dispatch(setTokenPopupData(data.resp));
      })
      .catch((err) => console.error(err));
  }

  function onClickStock(asset) {
    console.log(asset);
    setAssetInfo(asset);
    off();
  }

  function onClickFavBtn(e, v) {
    e.stopPropagation();

    axios
      .post(`${API.BOOKMARKS}/assets/${v.id}`)
      .then((res) => {
        getAssetList();
        getBookMark();
      })
      .catch((err) => console.error(err));
  }

  function getAssetList() {
    axios
      .get(`${API.GET_ASSETS}`, { params: { group: category } })
      .then(({ data }) => {
        console.log("assets", data.resp);
        setListData(data.resp || []);
        dispatch(setTokenPopupData(data.resp));
      })
      .catch((err) => console.error(err));
  }

  function getAssetGroup() {
    axios
      .get(`${API.GET_ASSETS_GROUP}`)
      .then(({ data }) => {
        console.log("group", data.listgroups);
        setCategory(data.listgroups[0].groupstr);
        setCategoryList(data.listgroups);
      })
      .catch(console.error);
  }

  console.log("category", category);

  useEffect(() => {
    getAssetGroup();
  }, []);

  useEffect(() => {
    getAssetList();
  }, [category]);

  if (isMobile)
    return (
      <MtokenPopupBox>
        <article className="topArea">
          {searchMode ? (
            <div className="searchBox">
              <button
                className="cancelBtn"
                onClick={() => setSearchMode(false)}
              >
                <img src={I_xWhite} alt="" />
              </button>

              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  getAssetWithSearch(e.target.value);
                }}
                placeholder="e.g. “ETH” or “Ethereum”"
              />
            </div>
          ) : (
            <>
              <ul className="categoryList">
                {categoryList.map((v, i) => (
                  <li
                    key={i}
                    className={`${category === v.groupstr && "on"}`}
                    onClick={() => {
                      setCategory(v.groupstr);
                      setSearch("");
                    }}
                  >
                    {v.name}
                  </li>
                ))}
              </ul>

              <button className="searchBtn" onClick={() => setSearchMode(true)}>
                <img src={I_searchWhite} alt="" />
              </button>
            </>
          )}
        </article>

        <article className="listArea">
          <ul className="tokenList">
            {listData.map((v, i) => {
              let _percent = getDividFromData({
                id: v.id,
                _case: "totalRate",
                dataObj: dividObj,
              });

              let _congestion = getDividFromData({
                id: v.id,
                _case: "betCount",
                dataObj: dividObj,
              });

              return (
                <li key={i} onClick={() => onClickStock(v)}>
                  <button
                    className="favBtn"
                    onClick={(e) => onClickFavBtn(e, v)}
                  >
                    <img
                      src={v.bookmark ? I_starYellowO : I_starYellow}
                      alt=""
                    />
                  </button>

                  <img className="tknImg" src={v.imgurl} alt="" />

                  <span className="nameBox">
                    <p className="name">{v.name}</p>

                    {category === "coin" && (
                      <p className="inital">{v.baseAsset}</p>
                    )}
                  </span>

                  <p
                    className={`${_congestion >= 50 ? "red" : "green"} percent`}
                  >{`${_percent || 0}%`}</p>
                </li>
              );
            })}
          </ul>
        </article>

        <footer>
          <button className="exitBtn" onClick={() => off()}>
            <img src={I_xWhite} alt="" />
          </button>

          <strong className="explain">Select market</strong>
        </footer>
      </MtokenPopupBox>
    );
  else
    return (
      <PtokenPopupBox>
        <article className="topArea">
          <ul className="categoryList">
            {categoryList.map((v, i) => (
              <li
                key={i}
                className={`${category === v.groupstr && "on"}`}
                onClick={() => {
                  setCategory(v.groupstr);
                  setSearch("");
                }}
              >
                {v.name}
              </li>
            ))}
          </ul>

          <div className="searchBox">
            {search ? (
              <button className="cancelBtn" onClick={() => setSearch("")}>
                <img src={I_xWhite} alt="" />
              </button>
            ) : (
              <button className="searchBtn">
                <img src={I_searchWhite} alt="" />
              </button>
            )}

            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                getAssetWithSearch(e.target.value);
              }}
              placeholder="e.g. “ETH” or “Ethereum”"
            />
          </div>
        </article>

        <article className="listArea">
          <ul className="tokenList">
            {listData
              .filter((e) => e.active)
              .map((v, i) => {
                let _percent = getDividFromData({
                  id: v.id,
                  _case: "totalRate",
                  dataObj: dividObj,
                });

                let _congestion = getDividFromData({
                  id: v.id,
                  _case: "betCount",
                  dataObj: dividObj,
                });

                return (
                  <li key={i} onClick={() => onClickStock(v)}>
                    <button
                      className="favBtn"
                      onClick={(e) => onClickFavBtn(e, v)}
                    >
                      <img
                        src={v.bookmark ? I_starYellowO : I_starYellow}
                        alt=""
                      />
                    </button>

                    <img className="tknImg" src={v.imgurl} alt="" />

                    <span className="nameBox">
                      <p className="name">{v.name}</p>

                      {category === "coin" && (
                        <p className="inital">{v.baseAsset}</p>
                      )}
                    </span>

                    <p
                      className={`${
                        _congestion >= 50 ? "red" : "green"
                      } percent`}
                    >{`${_percent || 0}%`}</p>
                  </li>
                );
              })}
          </ul>
        </article>
      </PtokenPopupBox>
    );
}

const MtokenPopupBox = styled.section`
  display: flex;
  flex-direction: column;
  color: #fff;
  background: #181c25;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  position: fixed;
  z-index: 6;

  .topArea {
    display: flex;
    align-items: center;
    gap: 20px;
    height: 64px;
    padding: 0 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);

    .searchBox {
      flex: 1;
      display: flex;
      gap: 8px;
      height: 38px;
      font-size: 14px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 20px;

      .cancelBtn {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        aspect-ratio: 1;
        background: rgba(255, 255, 255, 0.1);
        border: 1.2px solid rgba(255, 255, 255, 0.4);
        border-radius: 50%;

        img {
          width: 16px;
          opacity: 0.4;
        }
      }

      input {
        flex: 1;
      }
    }

    .categoryList {
      flex: 1;
      display: flex;
      gap: 8px;

      li {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 38px;
        padding: 0 16px;
        font-size: 14px;
        font-weight: 700;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid transparent;
        border-radius: 20px;
        cursor: pointer;

        &.on {
          border-color: #fff;
        }
      }
    }

    .searchBtn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 12px;
      aspect-ratio: 1;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;

      img {
        width: 18px;
      }
    }
  }

  .listArea {
    flex: 1;
    overflow-y: scroll;

    .tokenList {
      display: flex;
      flex-direction: column;
      font-size: 16px;

      & > li {
        display: flex;
        align-items: center;
        gap: 10px;
        height: 60px;
        padding: 0 20px;
        cursor: pointer;

        &:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .favBtn {
          img {
            width: 14px;
          }
        }

        .tknImg {
          height: 34px;
        }

        p {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .nameBox {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 10px;

          .name {
          }

          .inital {
            padding: 4px;
            font-size: 12px;
            line-height: 20px;
            color: rgba(255, 255, 255, 0.6);
            background: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
          }
        }

        .percent {
          &.red {
            color: #ff5353;
          }

          &.green {
            color: #3fb68b;
          }
        }
      }
    }
  }

  footer {
    display: flex;
    align-items: center;
    height: 56px;
    border-top: 1px solid rgba(255, 255, 255, 0.2);

    .exitBtn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 62px;
      height: 100%;

      img {
        width: 16px;
      }
    }

    .explain {
      padding: 0 20px;
      margin: 12px 0;
      font-size: 16px;
      color: rgba(255, 255, 255, 0.6);
      border-left: 1px solid rgba(255, 255, 255, 0.2);
    }
  }
`;

const PtokenPopupBox = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 380px;
  max-height: 80vh;
  padding: 30px 20px;
  background: #22262e;
  border-radius: 20px;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.8);
  top: 120px;
  position: fixed;
  z-index: 6;

  .topArea {
    display: flex;
    flex-direction: column;
    gap: 30px;

    .categoryList {
      display: flex;
      gap: 10px;

      li {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 40px;
        padding: 0 20px;
        font-size: 16px;
        font-weight: 700;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid transparent;
        border-radius: 20px;
        cursor: pointer;

        &.on {
          border-color: #fff;
        }
      }
    }

    .searchBox {
      flex: 1;
      display: flex;
      gap: 14px;
      height: inherit;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 20px;

      &:hover {
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
      }

      button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40px;
        aspect-ratio: 1;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;

        &.searchBtn {
          img {
            width: 18px;
          }
        }

        &.cancelBtn {
          border: 1.2px solid rgba(255, 255, 255, 0.4);

          img {
            width: 16px;
            opacity: 0.4;
          }
        }
      }

      input {
        &::placeholder {
          color: #fff;
          opacity: 0.2;
        }
      }
    }
  }

  .listArea {
    flex: 1;
    overflow-y: scroll;

    .tokenList {
      display: flex;
      flex-direction: column;
      font-size: 16px;

      & > li {
        display: flex;
        align-items: center;
        gap: 10px;
        height: 50px;
        padding: 0 14px;
        border-radius: 6px;
        cursor: pointer;

        &:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .favBtn {
          img {
            width: 14px;
          }
        }

        .tknImg {
          height: 34px;
        }

        p {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .nameBox {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 10px;

          .name {
          }

          .inital {
            padding: 4px;
            font-size: 12px;
            line-height: 20px;
            color: rgba(255, 255, 255, 0.6);
            background: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
          }
        }

        .percent {
          &.red {
            color: #ff5353;
          }

          &.green {
            color: #3fb68b;
          }
        }
      }
    }
  }
`;
