import React, { useState } from "react";
import classes from "./CalculatorTolerance.module.css";
import infoIcon from "../../../Assets/Images/info-icon.png";
import settingsIcon from "../../../Assets/Images/settings-icon.png";

const CalculatorTolerance = ({ slippage, setSlippage }) => {
  const [settingSlippage, isSettingSlippage] = useState(false);
  return (
    <div className={classes["calculator-tolerance"]}>
      <div className={classes["calculator-tolerance__left"]}>
        Slippage tolerance
        <img src={infoIcon} alt="binance logo" />
      </div>
      <div className={classes["calculator-tolerance__right"]}>
        {settingSlippage ? (
          <input
            type="text"
            value={slippage}
            onChange={(e) => setSlippage(e.target.value)}
          />
        ) : (
          `${slippage}%`
        )}
        <button
          onClick={() => isSettingSlippage(!settingSlippage)}
          className={classes["calculator__settings-btn"]}
        >
          <img src={settingsIcon} alt="binance logo" />
        </button>
      </div>
    </div>
  );
};

export default CalculatorTolerance;
