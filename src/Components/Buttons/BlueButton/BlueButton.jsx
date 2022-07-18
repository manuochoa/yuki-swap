import React from "react";
import classes from "./BlueButton.module.css";

const BlueButton = ({ text, onClick }) => {
  return (
    <button onClick={onClick} className={classes["blue-btn"]}>
      {text}
    </button>
  );
};

export default BlueButton;
