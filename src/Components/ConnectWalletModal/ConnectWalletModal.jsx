import React from "react";
import Overflow from "../Overflow/Overflow";
import classes from "./ConnectWalletModal.module.css";

import metamask from "../../Assets/Images/metamask.png";
import wallet from "../../Assets/Images/wallet.png";
import cross from "../../Assets/Images/cross.png";

const ConnectWalletModal = (props) => {
  const { onClose, connectWalletConnect, connectMetamask, disconnectWallet } =
    props;

  return (
    <Overflow>
      <div className={classes.main}>
        <div className={classes.header}>
          <h4>Connect Wallet</h4>
          <button className={classes["close-btn"]} onClick={onClose}>
            <img src={cross} alt="close cross icon" />
          </button>
        </div>
        <div className={classes.content}>
          <button onClick={connectMetamask} className={classes.button}>
            <img src={metamask} alt="metamask" />
            <p>Metamask</p>
          </button>
          <button onClick={connectWalletConnect} className={classes.button}>
            <img src={wallet} alt="metamask" />
            <p>WalletConnect</p>
          </button>
        </div>
        <button className={classes.submit}>Connect</button>
      </div>
    </Overflow>
  );
};

export default ConnectWalletModal;
