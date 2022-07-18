import React from "react";
import { NavLink } from "react-router-dom";
import classes from "./Navigation.module.css";

const Navigation = ({ closeHamburger }) => {
  return (
    <ul className={classes.navigation}>
      <li>
        <NavLink onClick={closeHamburger} to="/">
          Home
        </NavLink>
      </li>
      <li>
        <NavLink onClick={closeHamburger} to="#">
          Whitepaper
        </NavLink>
      </li>
      <li>
        <NavLink onClick={closeHamburger} className={classes.active} to="#">
          Swap
        </NavLink>
      </li>
    </ul>
  );
};

export default Navigation;
