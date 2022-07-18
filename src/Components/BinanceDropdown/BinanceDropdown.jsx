import React from "react";
import classes from "./BinanceDropdown.module.css";
import binanceLogo from "../../Assets/Images/binance-logo.png";
import Dropdown from "react-dropdown";

const logos = {
  0: "https://e7.pngegg.com/pngimages/1022/1019/png-clipart-question-mark-logo-question-mark-in-circle-icons-logos-emojis-question-marks.png",
  1: "https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/81d9f/eth-diamond-black.webp",
  56: "https://crypto-central.io/library/uploads/BNB-300x300.png",
};

const BinanceDropdown = ({ unknownNetwork, chainId }) => {
  const options = { 1: "Ethereum Mainnet", 56: "Binance Smart Chain" };
  function toHex(d) {
    return "0x" + Number(d).toString(16);
  }

  const changeChain = async (e) => {
    let token = Object.values(options).findIndex((el) => el === e.value);
    let chain = Object.keys(options)[token];
    console.log(token, toHex(chain));

    if (chainId !== Number(chain)) {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHex(chain) }],
      });
    }
  };
  return (
    <div className={classes["binance-dropdown-wrapper"]}>
      <img src={unknownNetwork ? logos[0] : logos[chainId]} alt="chain logo" />
      {/* <h3>{options[chainId]}</h3> */}
      <Dropdown
        options={Object.values(options)}
        value={unknownNetwork ? "Unknown Network" : options[chainId]}
        onChange={(e) => changeChain(e)}
      />
    </div>
  );
};

export default BinanceDropdown;
