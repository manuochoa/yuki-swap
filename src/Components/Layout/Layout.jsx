import React from "react";
import Header from "../Header/Header";

const Layout = ({
  disconnectWallet,
  children,
  buttonText,
  showModal,
  userAddress,
}) => {
  return (
    <div>
      <Header
        disconnectWallet={disconnectWallet}
        userAddress={userAddress}
        showModal={showModal}
        buttonText={buttonText}
      />
      <div>{children}</div>
    </div>
  );
};

export default Layout;
