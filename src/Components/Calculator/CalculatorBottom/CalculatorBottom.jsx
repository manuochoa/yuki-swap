import React from "react";
import classes from "./CalculatorBottom.module.css";

let symbols = {
  1: "ETH",
  56: "BNB",
};

const CalculatorBottom = ({
  isInputsReverted,
  firstInputValue,
  secondInputValue,
  symbolIn,
  symbolOut,
  slippage,
  exchangeRate,
  truncate,
  gasPrice,
  chainId,
}) => {
  return (
    <div className={classes["calculator-bottom"]}>
      <div className={classes["calculator-bottom__item"]}>
        <p className={classes["calculator-bottom__item__left"]}>Price</p>
        <p className={classes["calculator-bottom__item__right"]}>
          {!isInputsReverted
            ? `1 ${symbolIn} = ${truncate(exchangeRate, 8)} ${symbolOut}`
            : `1 ${symbolOut} = ${truncate(exchangeRate, 8)} ${symbolIn}`}
          {/* <span>(~$1,708)</span> */}
        </p>
      </div>
      <div className={classes["calculator-bottom__item"]}>
        <p className={classes["calculator-bottom__item__left"]}>
          Minimum received
        </p>
        <p className={classes["calculator-bottom__item__right"]}>
          {!isInputsReverted
            ? secondInputValue - (secondInputValue * slippage) / 100
            : firstInputValue - (firstInputValue * slippage) / 100}
          {/* <span>(~$1,605.43)</span> */}
        </p>
      </div>

      <div className={classes["calculator-bottom__item"]}>
        <p className={classes["calculator-bottom__item__left"]}>Gas Price</p>
        <p className={classes["calculator-bottom__item__right"]}>
          {gasPrice} {symbols[chainId]}
        </p>
      </div>
    </div>
  );
};

export default CalculatorBottom;
