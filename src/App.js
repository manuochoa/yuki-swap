import React, { useState, useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./Pages/Home/Home";
import "./reset.css";
import "./App.css";
import ConnectWalletModal from "./Components/ConnectWalletModal/ConnectWalletModal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import ethers from "ethers";
import Web3 from "web3";

const App = () => {
  const [userAddress, setUserAddress] = useState("");
  const [chainId, setChainId] = useState(56);
  const [wallet, setWallet] = useState("");
  const [walletProvider, setWalletProvider] = useState("");
  const [isShowWalletModal, setIsShowWalletModal] = useState(false);

  const handleIsShowWalletModal = () => {
    setIsShowWalletModal(!isShowWalletModal);
  };

  const connectWalletConnect = async () => {
    try {
      const provider = new WalletConnectProvider({
        rpc: {
          1: "https://mainnet.infura.io/v3/0267a87b8abb49379bf3a5b7c8e2f4d7",
          4: "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
          56: "https://bsc-dataseed1.ninicoin.io/",
          97: "https://data-seed-prebsc-2-s2.binance.org:8545/",
        },
        // chainId: 56,
        infuraId: null,
      });

      await provider.enable();
      const web3 = new Web3(provider);
      setWalletProvider(provider);

      const chainId = await web3.eth.getChainId();
      const accounts = await web3.eth.getAccounts();

      console.log("chainId");

      setChainId(chainId);
      setUserAddress(accounts[0]);
      setIsShowWalletModal(false);
      setWallet("WALLET_CONNECT");

      provider.on("accountsChanged", (accounts) => {
        setUserAddress(accounts[0]);
        console.log(accounts);
      });

      // Subscribe to chainId change
      provider.on("chainChanged", (chainId) => {
        setChainId(chainId);
        console.log(chainId);
      });

      // Subscribe to session disconnection
      provider.on("disconnect", (code, reason) => {
        console.log(code, reason);
        setUserAddress("");
      });
    } catch (error) {
      console.log(error);
    }
  };

  const connectMetamask = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setUserAddress(accounts[0]);
      setIsShowWalletModal(false);
      setWallet("METAMASK");

      try {
        window.localStorage.setItem("userAddress", accounts[0]);
      } catch (error) {
        window.localStorage.clear();
        window.localStorage.setItem("userAddress", accounts[0]);
      }

      const chainId = await window.ethereum.request({
        method: "eth_chainId",
      });

      let id = parseInt(chainId, 16);

      console.log(id);
      setChainId(id);

      window.ethereum.on("accountsChanged", function (accounts) {
        setUserAddress(accounts[0]);
      });

      window.ethereum.on("chainChanged", (_chainId) => {
        let id = parseInt(_chainId, 16);
        setChainId(id);
        window.location.reload();
      });
    } catch (error) {
      console.log(error);
    }
  };

  const disconnectWallet = async () => {
    if (wallet === "WALLET_CONNECT") {
      const provider = new WalletConnectProvider({
        rpc: {
          1: "https://mainnet.infura.io/v3/0267a87b8abb49379bf3a5b7c8e2f4d7",
          4: "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
          56: "https://bsc-dataseed1.ninicoin.io/",
          97: "https://data-seed-prebsc-2-s2.binance.org:8545/",
        },
        // chainId: 56,
        infuraId: null,
      });
      await provider.disconnect();
    }

    setUserAddress("");
  };

  useEffect(() => {
    let user = localStorage.getItem("userAddress");
    if (user) {
      connectMetamask();
    }
  }, []);

  return (
    <Router>
      {isShowWalletModal && (
        <ConnectWalletModal
          connectWalletConnect={connectWalletConnect}
          connectMetamask={connectMetamask}
          disconnectWallet={disconnectWallet}
          onClose={handleIsShowWalletModal}
        />
      )}
      <div className="main">
        <Routes>
          <Route
            exact
            path="/"
            element={
              <Home
                wallet={wallet}
                walletProvider={walletProvider}
                disconnectWallet={disconnectWallet}
                userAddress={userAddress}
                chainId={chainId}
                setIsShowWalletModal={setIsShowWalletModal}
                showModal={handleIsShowWalletModal}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
