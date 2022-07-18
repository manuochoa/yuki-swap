import React from "react";
import classes from "./BlueButton.module.css";

const BlueButton = ({ disabled, text, onClick }) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={classes["blue-btn"]}
    >
      {text}
    </button>
  );
};

export default BlueButton;
