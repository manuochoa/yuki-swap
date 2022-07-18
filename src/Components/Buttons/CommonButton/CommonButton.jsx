import React from "react";
import classes from "./CommonButton.module.css";

const CommonButton = ({ userAddress, text, clickHandler }) => {
  return (
    <button onClick={clickHandler} className={classes["common-btn"]}>
      {userAddress
        ? `${userAddress.slice(0, 6)}...
            ${userAddress.slice(-10)}`
        : text}
    </button>
  );
};

export default CommonButton;
