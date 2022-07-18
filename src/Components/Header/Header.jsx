import React, { useState } from "react";
import CommonButton from "../Buttons/CommonButton/CommonButton";
import Navigation from "../Navigation/Navigation";
import classes from "./Header.module.css";
import logo from "../../Assets/Images/logo.png";
import { NavLink } from "react-router-dom";
import Hamburger from "../Hamburger/Hamburger";

const Header = ({ disconnectWallet, buttonText, showModal, userAddress }) => {
  const [isHamburgerOpened, setIsHamburgerOpened] = useState(false);
  const toggleHamburger = () => {
    setIsHamburgerOpened((prev) => !prev);
  };

  const closeHamburger = () => {
    setIsHamburgerOpened(false);
  };

  return (
    <header className={classes["header-wrapper"]}>
      <div
        className={
          isHamburgerOpened
            ? classes["navigation-mob"]
            : classes["navigation-mob"] +
              " " +
              classes["navigation-mob__hidden"]
        }
      >
        <Navigation closeHamburger={closeHamburger} />
      </div>

      <Hamburger
        isHamburgerOpened={isHamburgerOpened}
        toggleHamburger={toggleHamburger}
      />
      <NavLink className={classes["header-logo"]} to="/">
        <img alt="logo" src={logo} />
      </NavLink>
      <div className={classes["navigation-desktop"]}>
        <Navigation />
      </div>

      <CommonButton
        userAddress={userAddress}
        clickHandler={userAddress ? disconnectWallet : showModal}
        text={buttonText}
      />
    </header>
  );
};

export default Header;
