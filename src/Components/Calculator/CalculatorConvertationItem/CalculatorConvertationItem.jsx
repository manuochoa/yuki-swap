import React, { useState, useEffect } from "react";
import Input from "../../Input/Input";
import classes from "./CalculatorConvertationItem.module.css";
import Dropdown from "react-dropdown";
import tokens from "../../../common/tokensList/tokenList.json";

const CalculatorConvertationItem = (props) => {
  const {
    balance,
    dropdownHandler,
    options,
    defaultOption,
    dropdownImg,
    setImg,
    value,
    setValue,
    children,
    text,
    chainId,
  } = props;
  const [symbol, setSymbol] = useState(defaultOption);

  useEffect(() => {
    let token = tokens[chainId].find((el) => el.logoURI === dropdownImg);
    setSymbol(token.symbol);
    console.log(token, dropdownImg);
  }, [dropdownImg]);

  const truncateByDecimalPlace = (value, numDecimalPlaces) =>
    Math.trunc(value * Math.pow(10, numDecimalPlaces)) /
    Math.pow(10, numDecimalPlaces);

  return (
    <div className={classes["convertation__item"]}>
      <div className={classes["convertation__item-top"]}>
        <div className={classes["convertation__item-top__left"]}>{text}</div>
        <div className={classes["convertation__item-top__right"]}>
          Available:
          <span>
            {balance} {symbol}
          </span>
        </div>
      </div>
      <div className={classes["convertation__item-input-wrapper"]}>
        <Input
          type
          value={truncateByDecimalPlace(value, 4)}
          onChange={(e) => setValue(e)}
        />
        <div className={classes["convertation-dollars-amount"]}>
          (~$<span>1,708</span>)
        </div>
        <div className={classes["dropdown-wrapper"]}>
          <img src={dropdownImg} alt="dropdown logo" />
          <Dropdown
            options={options}
            onChange={(e) => {
              setSymbol(e.value);
              dropdownHandler(e);
            }}
            value={defaultOption}
            placeholder="Select an option"
            className={classes["calculator-dropdown"]}
          />
        </div>
        {children}
      </div>
    </div>
  );
};

export default CalculatorConvertationItem;
