import React from "react";
import classes from "./Hamburger.module.css";

const Hamburger = ({isHamburgerOpened, toggleHamburger}) => {
  return (
    <div
      className={
        isHamburgerOpened ? classes.hamburger + " " + classes.change : classes.hamburger
      }
      onClick={toggleHamburger}
    >
      <div className={classes.bar1}></div>
      <div className={classes.bar2}></div>
      <div className={classes.bar3}></div>
    </div>
  );
};

export default Hamburger;
