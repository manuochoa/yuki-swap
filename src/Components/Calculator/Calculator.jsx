import React, { useState, useEffect } from "react";
import BlueButton from "../Buttons/BlueButton/BlueButton";
import classes from "./Calculator.module.css";
import inchIcon from "../../Assets/Images/inch-icon.png";
import ethIcon from "../../Assets/Images/eth-icon.png";
import "react-dropdown/style.css";
import SwitchBtn from "../Buttons/SwitchBtn/SwitchBtn";
import BinanceDropdown from "../BinanceDropdown/BinanceDropdown";
import CalculatorBottom from "./CalculatorBottom/CalculatorBottom";
import CalculatorTolerance from "./CalculatorTolerance/CalculatorTolerance";
import CalculatorConvertationItem from "./CalculatorConvertationItem/CalculatorConvertationItem";
import tokens from "../../common/tokensList/tokenList.json";
import { ethers, providers } from "ethers";
import { router, factory, providerRpc } from "../../common/addresses";
import { factoryAbi, routerAbi, ercAbi } from "../../common/abis";

const Calculator = ({
  wallet,
  walletProvider,
  setIsShowWalletModal,
  userAddress,
  chainId,
  unknownNetwork,
}) => {
  const [options, setOptions] = useState(
    tokens[chainId].map((el) => el.symbol)
  );
  const [isInputsReverted, setIsInputsReverted] = useState(false);
  const [firstInputValue, setFirstInputValue] = useState(0);
  const [secondInputValue, setSecondInputValue] = useState(0);
  const [dropdownOneImg, setDropdownOneImg] = useState(
    tokens[chainId][0].logoURI
  );
  const [dropdownTwoImg, setDropdownTwoImg] = useState(
    tokens[chainId][1].logoURI
  );
  const [addressIn, setAddressIn] = useState(tokens[chainId][0].address);
  const [symbolIn, setSymbolIn] = useState(tokens[chainId][0].symbol);
  const [addressOut, setAddressOut] = useState(tokens[chainId][1].address);
  const [symbolOut, setSymbolOut] = useState(tokens[chainId][1].symbol);
  const [tokenIn, setTokenIn] = useState({
    balance: "0",
    isAllowed: false,
  });
  const [tokenOut, setTokenOut] = useState({
    balance: "0",
    isAllowed: false,
  });
  const [slippage, setSlippage] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [enoughAllowance, setEnoughAllowance] = useState(true);
  const [trade, setTrade] = useState({
    amountIn: "",
    amountOut: "",
    amountOutMin: "",
    slippage: "30",
  });
  const [exchangeRate, setExchangeRate] = useState("");
  const [gasPrice, setGasPrice] = useState("");

  const dropdownHandlerOne = (selectedOption) => {
    let token = tokens[chainId].find(
      (el) => selectedOption.value === el.symbol
    );
    getTokenBalance(token.address, "first");
    setDropdownOneImg(token.logoURI);
    setAddressIn(token.address);
    setSymbolIn(token.symbol);
  };

  const dropdownHandlerTwo = (selectedOption) => {
    let token = tokens[chainId].find(
      (el) => selectedOption.value === el.symbol
    );
    getTokenBalance(token.address, "second");
    setDropdownTwoImg(token.logoURI);
    setAddressOut(token.address);
    setSymbolOut(token.symbol);
  };

  const setImg = (img) => {
    return img === "inchIcon" ? inchIcon : ethIcon;
  };

  const switchInputs = () => {
    setIsInputsReverted((prev) => !prev);
  };

  const getSwapAmount = async (type, amount) => {
    let provider = new ethers.providers.JsonRpcProvider(providerRpc[chainId]);

    let routerInstance = new ethers.Contract(
      router[chainId],
      routerAbi,
      provider
    );
    let WETH =
      Number(chainId) !== 43114
        ? await routerInstance.WETH()
        : await routerInstance.WAVAX();
    let inDecimals = tokens[chainId].find(
      (el) => el.address === addressIn
    ).decimals;
    let outDecimals = tokens[chainId].find(
      (el) => el.address === addressOut
    ).decimals;

    console.log(WETH, "WETH");

    let path;

    switch (type) {
      case "first":
        if (amount > 0) {
          if (addressIn === "0x0000000000000000000000000000000000000000") {
            path = [WETH, addressOut];
          } else if (
            addressOut === "0x0000000000000000000000000000000000000000"
          ) {
            path = [addressIn, WETH];
          } else {
            path = [addressIn, WETH, addressOut];
          }
          let amountsOut = await routerInstance.getAmountsOut(
            ethers.utils.parseUnits(amount, inDecimals),
            path
          );
          return ethers.utils.formatUnits(amountsOut.at(-1), outDecimals);
        }
        break;
      case "second":
        if (amount > 0) {
          if (addressOut === "0x0000000000000000000000000000000000000000") {
            path = [addressIn, WETH];
          } else if (
            addressIn === "0x0000000000000000000000000000000000000000"
          ) {
            path = [WETH, addressOut];
          } else {
            path = [addressIn, WETH, addressOut];
          }
          let amountsIn = await routerInstance.getAmountsIn(
            ethers.utils.parseUnits(amount, outDecimals),
            path
          );
          return ethers.utils.formatUnits(amountsIn[0], inDecimals);
        }
        break;

      default:
        break;
    }
  };

  const approveToken = async () => {
    setIsLoading(true);
    try {
      let web3Provider;

      if (wallet === "WALLET_CONNECT") {
        web3Provider = new providers.Web3Provider(walletProvider);
      } else {
        web3Provider = new providers.Web3Provider(window.ethereum);
      }

      let signer = web3Provider.getSigner(0);

      let newInstance = new ethers.Contract(
        !isInputsReverted ? addressIn : addressOut,
        ercAbi,
        signer
      );

      let receipt = await newInstance.approve(
        router[chainId],
        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      );
      setIsLoading(false);
      return receipt;
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const handleSwap = async () => {
    setIsLoading(true);
    try {
      console.log("swap");

      if (addressIn === addressOut) {
        throw "Address in and out are the same";
      }
      let exchangeType;

      if (addressIn === "0x0000000000000000000000000000000000000000") {
        exchangeType = !isInputsReverted ? "ETHtoToken" : "tokenToEth";
      } else if (addressOut === "0x0000000000000000000000000000000000000000") {
        exchangeType = !isInputsReverted ? "tokenToEth" : "ETHtoToken";
      } else {
        exchangeType = "tokenToToken";
      }

      let inDecimals = tokens[chainId].find(
        (el) => el.address === addressIn
      ).decimals;
      let outDecimals = tokens[chainId].find(
        (el) => el.address === addressOut
      ).decimals;

      let amountIn = ethers.utils.parseUnits(
        !isInputsReverted
          ? Number(firstInputValue).toString()
          : Number(secondInputValue).toString(),
        !isInputsReverted ? inDecimals : outDecimals
      );
      let amountOutMin = ethers.utils.parseUnits(
        !isInputsReverted
          ? truncate(
              secondInputValue - (secondInputValue * slippage) / 100,
              6
            ).toString()
          : truncate(
              firstInputValue - (firstInputValue * slippage) / 100,
              6
            ).toString(),
        !isInputsReverted ? outDecimals : inDecimals
      );

      let web3Provider;

      if (wallet === "WALLET_CONNECT") {
        web3Provider = new providers.Web3Provider(walletProvider);
      } else {
        web3Provider = new providers.Web3Provider(window.ethereum);
      }

      let signer = web3Provider.getSigner(0);

      let routerInstance = new ethers.Contract(
        router[chainId],
        routerAbi,
        signer
      );

      let WETH =
        Number(chainId) !== 43114
          ? await routerInstance.WETH()
          : await routerInstance.WAVAX();
      let path = !isInputsReverted
        ? [addressIn, addressOut]
        : [addressOut, addressIn];

      if (addressIn === "0x0000000000000000000000000000000000000000") {
        path = !isInputsReverted ? [WETH, addressOut] : [addressOut, WETH];
      } else if (addressOut === "0x0000000000000000000000000000000000000000") {
        path = !isInputsReverted ? [addressIn, WETH] : [WETH, addressIn];
      }

      let tx;
      let deadline = Date.now() + 1000 * 60 * 10;
      console.log({
        exchangeType,
        isInputsReverted,
        amountOutMin,
        path,
        userAddress,
        deadline,
      });

      if (exchangeType === "ETHtoToken") {
        tx =
          await routerInstance.swapExactETHForTokensSupportingFeeOnTransferTokens(
            amountOutMin,
            path,
            userAddress,
            deadline,
            { value: amountIn }
          );
      } else if (exchangeType === "tokenToEth") {
        tx =
          await routerInstance.swapExactTokensForETHSupportingFeeOnTransferTokens(
            amountIn,
            amountOutMin,
            path,
            userAddress,
            deadline
          );
      } else if (exchangeType === "tokenToToken") {
        if (path[0] !== WETH && path[1] !== WETH) {
          path[2] = path[1];
          path[1] = WETH;
        }
        tx =
          await routerInstance.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            amountIn,
            amountOutMin,
            path,
            userAddress,
            deadline
          );
      }

      let receipt = await tx.wait();
      getBalances();
      setIsLoading(false);
      return receipt;
    } catch (error) {
      console.log(error, "handleSwap");
    }
    setIsLoading(false);
  };

  const truncate = (value, numDecimalPlaces) =>
    Math.trunc(value * Math.pow(10, numDecimalPlaces)) /
    Math.pow(10, numDecimalPlaces);

  const getTokenBalance = async (address, type) => {
    console.log(address);
    if (!userAddress) {
      return;
    }
    let provider = new ethers.providers.JsonRpcProvider(providerRpc[chainId]);

    let tokenInstance = new ethers.Contract(address, ercAbi, provider);

    let balance;
    let isAllowed;

    if (address === "0x0000000000000000000000000000000000000000") {
      balance = await provider.getBalance(userAddress);
      isAllowed = true;
    } else {
      balance = await tokenInstance.balanceOf(userAddress);
      let allowance = await tokenInstance.allowance(
        userAddress,
        router[chainId]
      );
      isAllowed = Number(allowance) > 0;
      console.log(
        Number(allowance),
        address,
        providerRpc[chainId],
        router[chainId],
        "allowance",
        isAllowed
      );
    }

    switch (type) {
      case "first":
        setTokenIn({
          balance: Number(balance / 10 ** 18),
          isAllowed,
        });
        break;
      case "second":
        setTokenOut({
          balance: Number(balance / 10 ** 18),
          isAllowed,
        });
        break;

      default:
        break;
    }
  };

  const handleInputChange = async (e, type) => {
    let amount = e;
    switch (type) {
      case "first":
        setFirstInputValue(amount);
        setSecondInputValue(await getSwapAmount(type, amount));
        break;
      case "second":
        setSecondInputValue(amount);
        setFirstInputValue(await getSwapAmount(type, amount));
        break;

      default:
        break;
    }
  };

  const getBalances = async () => {
    if (userAddress) {
      getTokenBalance(addressIn, "first");
      getTokenBalance(addressOut, "second");
    }
  };

  const getExchangeRate = async () => {
    let type = !isInputsReverted ? "first" : "second";
    let rate = await getSwapAmount(type, "1");
    setExchangeRate(rate);
    let provider = new ethers.providers.JsonRpcProvider(providerRpc[chainId]);
    setGasPrice(
      ethers.utils.formatUnits(await provider.getGasPrice()) * 200000
    );
  };

  useEffect(() => {
    dropdownHandlerOne({ value: options[0] });
    dropdownHandlerTwo({ value: options[1] });
  }, []);

  useEffect(() => {
    getBalances();
  }, [userAddress]);

  useEffect(() => {
    setAddressIn(tokens[chainId][0].address);
    setAddressOut(tokens[chainId][1].address);
    setOptions(tokens[chainId].map((el) => el.symbol));
    setDropdownOneImg(tokens[chainId][0].logoURI);
    setDropdownTwoImg(tokens[chainId][1].logoURI);
    setSymbolIn(tokens[chainId][0].symbol);
    setSymbolOut(tokens[chainId][1].symbol);
    getExchangeRate();
  }, [chainId]);

  useEffect(() => {
    getExchangeRate();
  }, [addressIn, addressOut, isInputsReverted]);
  return (
    <div className={classes["calculator-outer"]}>
      <div className={classes["calculator-wrapper"]}>
        <div className={classes["calculator-top"]}>
          <p className={classes["calculator-top__left"]}>Yuki Swap</p>
          <div className={classes["calculator-top__right"]}>
            <BinanceDropdown
              unknownNetwork={unknownNetwork}
              chainId={chainId}
            />
          </div>
        </div>
        <div className={classes["calculator-convertation"]}>
          <div className={classes["convertation-item-top"]}>
            {!isInputsReverted ? (
              <CalculatorConvertationItem
                chainId={chainId}
                tokens={tokens[chainId]}
                balance={truncate(tokenIn.balance, 6)}
                text="From"
                dropdownHandler={dropdownHandlerOne}
                dropdownImg={dropdownOneImg}
                defaultOption={options[0]}
                options={options}
                setImg={setImg}
                value={firstInputValue}
                setValue={(e) => handleInputChange(e.target.value, "first")}
              >
                <button className={classes["convertation__item-max"]}>
                  max
                </button>
              </CalculatorConvertationItem>
            ) : (
              <CalculatorConvertationItem
                chainId={chainId}
                tokens={tokens[chainId]}
                balance={truncate(tokenOut.balance, 6)}
                text="From"
                dropdownHandler={dropdownHandlerTwo}
                dropdownImg={dropdownTwoImg}
                defaultOption={options[1]}
                options={options}
                setImg={setImg}
                value={secondInputValue}
                setValue={(e) => handleInputChange(e.target.value, "second")}
              />
            )}
          </div>

          <SwitchBtn btnHandler={switchInputs} />
          <div className={classes["convertation-item-bottom"]}>
            {!isInputsReverted ? (
              <CalculatorConvertationItem
                chainId={chainId}
                tokens={tokens[chainId]}
                balance={truncate(tokenOut.balance, 6)}
                text="To"
                dropdownHandler={dropdownHandlerTwo}
                dropdownImg={dropdownTwoImg}
                defaultOption={options[1]}
                options={options}
                setImg={setImg}
                value={secondInputValue}
                setValue={(e) => handleInputChange(e.target.value, "second")}
              />
            ) : (
              <CalculatorConvertationItem
                chainId={chainId}
                tokens={tokens[chainId]}
                balance={truncate(tokenIn.balance, 6)}
                text="To"
                dropdownHandler={dropdownHandlerOne}
                dropdownImg={dropdownOneImg}
                defaultOption={options[0]}
                options={options}
                setImg={setImg}
                value={firstInputValue}
                setValue={(e) => handleInputChange(e.target.value, "first")}
              >
                <button className={classes["convertation__item-max"]}>
                  max
                </button>
              </CalculatorConvertationItem>
            )}
          </div>
        </div>
        <CalculatorTolerance slippage={slippage} setSlippage={setSlippage} />
        <CalculatorBottom
          isInputsReverted={isInputsReverted}
          firstInputValue={firstInputValue}
          secondInputValue={secondInputValue}
          symbolIn={symbolIn}
          symbolOut={symbolOut}
          slippage={slippage}
          exchangeRate={exchangeRate}
          truncate={truncate}
          gasPrice={gasPrice}
          chainId={chainId}
        />
        <div className={classes["calculator-btn"]}>
          <BlueButton
            disabled={unknownNetwork || isLoading}
            onClick={
              // userAddress ? handleSwap : () => setIsShowWalletModal(true)
              userAddress
                ? !isInputsReverted
                  ? tokenIn.isAllowed
                    ? handleSwap
                    : approveToken
                  : tokenOut.isAllowed
                  ? handleSwap
                  : approveToken
                : () => setIsShowWalletModal(true)
            }
            text={
              userAddress
                ? !isInputsReverted
                  ? tokenIn.isAllowed
                    ? "Swap"
                    : "Approve Token"
                  : tokenOut.isAllowed
                  ? "Swap"
                  : "Approve Token"
                : "Connect Wallet"
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Calculator;
