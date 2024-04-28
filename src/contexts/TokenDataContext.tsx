import { ReactNode, createContext, useEffect, useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { useRate } from "../hooks/use-Rat";
import { GetTokenDataContextValue, UserDatas } from "../components/dataType";
import { ethers } from "ethers";
import { flareTestnet } from "viem/chains";
import { TOKEN_AIRDROP_CONTRACT_ADDR } from "../config";
export const GetTokenDataContext = createContext<GetTokenDataContextValue>({
  isBuyState: true,
  ethBalanceOfContract: 0,
  isClaimableForuser: false,
  userData: 0,
  currentTokenPerEth: 0,
  getInfo: () => {},
});

interface GetTokenDataProviderProps {
  children: ReactNode;
}

const GetTokenDataProvider: React.FC<GetTokenDataProviderProps> = ({
  children,
}) => {
  const { address } = useAccount();
  const {
    getTotalReceivedEthAmount,
    isAvailableTobuy,
    getUserData,
    getCurrentTokenPerEthRatio,
  } = useRate();

  const [currentTokenPerEth, setCurrentTokenPerEth] = useState(0);
  const [userData, setUserData] = useState(0);
  const [isClaimableForuser, setIsClaimableForUser] = useState(false);
  const [isBuyState, setIsBuyState] = useState(true);
  const [ethBalanceOfContract, setEthBalanceOfContract] = useState(0);

  const result = useBalance({
    address: TOKEN_AIRDROP_CONTRACT_ADDR,
    chainId: flareTestnet.id,
    scopeKey: "foo",
    formatUnits: "ether",
  });

  const getInfo = async () => {
    const state = await getTotalReceivedEthAmount();
    const buyState = await isAvailableTobuy();
    setIsBuyState(buyState);
    if (address) {
      const data = await getUserData(address);
      const formattedBalance = (Number(data) / 10 ** 18).toString();

      setUserData(Number(formattedBalance));
    }
    getEthBalanceOfCtr();
  };

  const getEthBalanceOfCtr = async () => {
    if (result.data) {
      try {
        const formattedBalance = Number(result.data.value).toString();
        setEthBalanceOfContract(Number(formattedBalance) / 10 ** 18);
      } catch (error) {
        console.error("Error converting balance:", error);
      }
    }
  };

  const getCurrentTokenPerEth = async () => {
    if (result.data) {
      try {
        const data = await getCurrentTokenPerEthRatio();
        const formattedBalance = (Number(data) / 10 ** 18).toString();
        setCurrentTokenPerEth(Number(formattedBalance));
      } catch (error) {
        console.error("Error converting balance:", error);
      }
    }
  };

  useEffect(() => {
    if (address) {
      getInfo();
      const interval = setInterval(() => {
        getInfo();
      }, 6000); // 1 minute
      return () => clearInterval(interval);
    } else {
      setIsClaimableForUser(false);
      setUserData(0);
    }
    // eslint-disable-next-line
  }, [address]);

  useEffect(() => {
    const interval = setInterval(() => {
      getEthBalanceOfCtr();
      getCurrentTokenPerEth();
    }, 30000); // 30 seconds

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  return (
    <GetTokenDataContext.Provider
      value={{
        isBuyState,
        currentTokenPerEth,
        ethBalanceOfContract,
        isClaimableForuser,
        userData,
        getInfo,
      }}
    >
      {children}
    </GetTokenDataContext.Provider>
  );
};

export default GetTokenDataProvider;
