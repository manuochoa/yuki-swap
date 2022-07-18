import React from "react";
import classes from "./SwitchBtn.module.css";
import switchIcon from "../../../Assets/Images/switch.png";

const SwitchBtn = ({btnHandler}) => {
  return (
    <button onClick={btnHandler} className={classes["switch-btn"]}>
      <img src={switchIcon} alt="switch icon" />
    </button>
  );
};

export default SwitchBtn;
