import React from "react";
import classes from "./Input.module.css";

const Input = ({ value, onChange }) => {
  return (
    <input
      onChange={onChange}
      value={value}
      className={classes["convertation__item-input"]}
      type="number"
    />
  );
};

export default Input;
