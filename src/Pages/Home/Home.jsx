import React from "react";
import Calculator from "../../Components/Calculator/Calculator";
import Layout from "../../Components/Layout/Layout";

const Home = ({
  wallet,
  walletProvider,
  setIsShowWalletModal,
  disconnectWallet,
  userAddress,
  showModal,
  chainId,
}) => {
  return (
    <Layout
      disconnectWallet={disconnectWallet}
      userAddress={userAddress}
      showModal={showModal}
      buttonText="Connect Wallet"
    >
      <Calculator
        chainId={chainId}
        wallet={wallet}
        walletProvider={walletProvider}
        setIsShowWalletModal={setIsShowWalletModal}
        userAddress={userAddress}
      />
    </Layout>
  );
};

export default Home;
