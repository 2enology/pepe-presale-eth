/* eslint-disable @next/next/no-img-element */
import { useContext, useEffect, useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { flareTestnet } from "viem/chains";
import { ethers } from "ethers";
import { ClassicSpinner } from "react-spinners-kit";
import {
  TbWorld,
  TbBrandTwitter,
  TbBrandTelegram,
  TbBrandDiscord,
} from "react-icons/tb";
import { errorAlert, successAlert, warningAlert } from "../toastGroup";
import Countdown from "../countDown";
import { useRate } from "../../hooks/use-Rat";
import { GetTokenDataContext } from "../../contexts/TokenDataContext";
import Link from "next/link";
import {
  PRESALE_ENDED_TIME,
  SITE_LINK,
  TELEGRAM_LINK,
  TOTAL_ETH_AMOUNT,
  TWITTER_LINK,
  ZOINK_LINK,
} from "../../config";

const Detail = () => {
  const {
    isBuyState,
    userData,
    getInfo,
    ethBalanceOfContract,
    currentTokenPerEth,
  } = useContext(GetTokenDataContext);
  const { payWithEth } = useRate();
  const { address } = useAccount();
  const [balance, setBalance] = useState(0); // Initialize with a default value
  const [payAmount, setPayAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [endPresale, setEndPresale] = useState(true);

  const result = useBalance({
    address: address,
    chainId: flareTestnet.id,
    scopeKey: "foo",
    formatUnits: "ether",
  });

  useEffect(() => {
    if (result.data) {
      try {
        const formattedBalance = ethers.utils.formatUnits(
          result.data.value.toString(),
          "ether"
        );
        setBalance(Number(formattedBalance));
      } catch (error) {
        console.error("Error converting balance:", error);
      }
    }
  }, [result.data]);

  const handleBuyFunc = async () => {
    try {
      setLoading(true);
      const rept = await payWithEth(payAmount);
      if (rept === null) {
        warningAlert("Rejected by User!");
      } else {
        setLoading(false);
        successAlert("Paid Successfully.");
      }
    } catch (error: any) {
      if (error.message.includes("User rejected the request.")) {
        setLoading(false);
        errorAlert("User rejected the request.");
      } else {
        console.log("error", error);
        setLoading(false);
        errorAlert("Failed Paid");
      }
    } finally {
      setLoading(false);
      getInfo();
    }
  };

  console.log("current", new Date().getTime());
  console.log("end", PRESALE_ENDED_TIME);
  return (
    <>
      <div className="w-full flex flex-col md:flex-row items-start justify-center gap-[30px]">
        <div className="lg:w-[400px] md:w-1/2 w-full flex flex-col gap-4 p-2 relative">
          <div className="w-full bg-white min-h-[20vh] rounded-lg p-4 flex flex-col gap-2 bg-opacity-10 relative">
            <img
              src="/imgs/bg2.jpg"
              className="absolute bottom-0 right-0 top-0 left-0 -z-50 rounded-lg h-full w-full object-cover opacity-20"
              alt=""
            />
            <div>
              <Countdown timestamp={PRESALE_ENDED_TIME * 1000} />
            </div>
            <div className="relative w-full bg-gray-200 rounded-full mt-5">
              <div
                className="absolute top-0 h-3 rounded-full shim-green"
                style={{
                  width: (ethBalanceOfContract * 100) / TOTAL_ETH_AMOUNT,
                }}
              />
            </div>

            <div className="w-full flex items-center justify-between text-[12px] font-bold text-white">
              <p>{ethBalanceOfContract.toFixed(2)} FLR</p>
              <p>{TOTAL_ETH_AMOUNT} FLR</p>
            </div>

            <div className="w-full flex items-center justify-between text-[12px] font-bold text-white">
              <p>Current Rate</p>
              <p>1FLR = {currentTokenPerEth.toFixed(2)} PEPEF</p>
            </div>

            <div className="w-full flex items-center justify-between text-[12px] font-bold text-white">
              <p>Current Raise FLR</p>
              <p>
                {ethBalanceOfContract} FLR ({" "}
                {((ethBalanceOfContract * 100) / TOTAL_ETH_AMOUNT).toFixed(2)}{" "}
                %)
              </p>
            </div>

            {address && (
              <div className="w-full flex items-center justify-between text-[12px] font-bold text-white">
                <p>You will get </p>
                <p>{userData.toFixed(3)} PEPEF</p>
              </div>
            )}

            {PRESALE_ENDED_TIME * 1000 > new Date().getTime() ? (
              <div>
                <div className="text-[16px] mt-6 text-white font-bold">
                  Amount (Max:
                  <span className="text-[#E61A59]">
                    {balance.toFixed(2) + "FLR"}
                  </span>
                  )
                </div>
                <div
                  className="w-full flex items-center justify-between border-[2px] border-black
           border-opacity-40 rounded-lg p-2 gap-4"
                >
                  <input
                    className="w-full outline-none text-[16px] bg-transparent h-full text-white"
                    placeholder="0"
                    type="number"
                    onChange={(e) =>
                      Number(e.target.value) >
                      Number((balance - 0.01).toFixed(3))
                        ? setPayAmount(Number((balance - 0.01).toFixed(3)))
                        : setPayAmount(Number(e.target.value))
                    }
                    value={payAmount !== 0 ? payAmount : ""}
                  />
                  <div
                    className="text-[#E61A59] text-[16px] cursor-pointer"
                    onClick={() =>
                      setPayAmount(Number((balance - 0.01).toFixed(3)))
                    }
                  >
                    Max
                  </div>
                </div>
                {payAmount !== 0 && (
                  <p className="text-[16px] text-white font-bold duration-300 transition-all">
                    You will receive{" "}
                    {(currentTokenPerEth * payAmount).toLocaleString()} PEPEF
                  </p>
                )}
                <div className="w-full flex items-center justify-between mt-3 gap-5 flex-col">
                  {address && isBuyState && (
                    <button
                      className={`rounded-lg text-[13.1px] w-full ${
                        payAmount === 0
                          ? "bg-[#d5d3d368] text-[#00000040] border-[1px] border-[#f9519138] cursor-not-allowed rounded-lg py-2"
                          : "bg-[#f95191ec] text-white py-[10px] cursor-pointer rounded-lg"
                      }  px-2 py-1 transition-all duration-300`}
                      onClick={() => payAmount !== 0 && handleBuyFunc()}
                    >
                      Buy with FLR
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                <p className="text-[20px] text-[#ff3e98] font-bold duration-300 transition-all uppercase text-center ">
                  Tokens will be distributed automatically!
                </p>
              </>
            )}
          </div>
        </div>
        <div className="lg:w-[calc(100%-400px)] relative md:w-1/2 w-full bg-white bg-opacity-10 min-h-[10vh] rounded-lg p-5">
          <img
            alt=""
            src="/imgs/bg1.jpg"
            className="absolute bottom-0 right-0 top-0 left-0 -z-50 rounded-lg h-full w-full object-cover opacity-10"
          />
          <div className="flex items-center justify-start gap-3">
            <h1 className="text-2xl font-bold text-white">
              PepeF by @PepesSgb
            </h1>
            <a href={SITE_LINK} target="_blank" rel="referrer">
              <TbWorld color="#f95191ec" size={22} />
            </a>
            <a href={TWITTER_LINK} target="_blank" rel="referrer">
              <TbBrandTwitter color="#f95191ec" size={22} />
            </a>
            <a href={TELEGRAM_LINK} target="_blank" rel="referrer">
              <TbBrandDiscord color="#f95191ec" size={22} />
            </a>
          </div>
          <div className="flex flex-col gap-5 mt-5">
            <p className="text-[18px] font-bold text-white">
              {`Welcome to PepeF, the premier memecoin on the Flare Network, brought to you by the innovative team behind PepeSGB! PepeF is designed to capture the essence of the original Pepe token but with an exciting twist. With a limited supply of 69 million tokens, PepeF is poised to become the most sought-after memecoin within the Flare ecosystem, offering a unique blend of nostalgia and modern crypto features.`}
            </p>
            <h1 className="text-2xl uppercase mt-5 font-bold text-white">
              $PepeF Presale details
            </h1>
            <p className="text-[16px] mt-2">
              <strong className="text-[16px] text-white">
                {` 🐸 Total Supply 69,000,000:`}
              </strong>
            </p>
            <p className="text-[15px]">
              <strong className="text-[16px] text-white">
                {`🐸 40% (27,600,000) Presale`}
              </strong>
            </p>
            <p className="text-[15px]">
              <strong className="text-[16px] text-white">
                {`🐸 25% (17,250,000) Liquidity`}
              </strong>
            </p>
            <p className="text-[15px]">
              <strong className="text-[16px] text-white">
                {`🐸 20% (13,800,000) Monthly Airdrop`}
              </strong>
            </p>
            <p className="text-[15px]">
              <strong className="text-[16px] text-white">
                {`🐸 10% (6,900,000) Development/Gaming`}
              </strong>
            </p>

            <p className="text-[15px]">
              <strong className="text-[16px] text-white">
                {`🐸 5% (3,450,000) Marketing/Team`}
              </strong>
            </p>
            <p className="text-[15px]">
              <strong className="text-[16px] text-white">
                {`✅ Buybacks & Burns `}
              </strong>
            </p>

            <p className="text-[15px]">
              <strong className="text-[16px] text-white">
                {`✅ Unused tokens will be burned `}
              </strong>
            </p>
            <p className="text-[15px]">
              <strong className="text-[16px] text-white">
                {`✅ Fair Launch - 51% funds to Liquidity `}
              </strong>
            </p>
            <p className="text-[15px]">
              <strong className="text-[16px] text-white">
                {`✅ Year old Project on Songbird `}
              </strong>
            </p>
          </div>

          <h1 className="text-[18px] uppercase mt-5 font-bold text-white">
            🔓 How does presale works?
          </h1>
          <p className="text-[15px] mt-2">
            <strong className="text-[18px] text-white">
              {`The presale represents 40% of the total supply, hosted on the Fomo Factory platform. This event operates on a fair launch basis, where the presale ratio depends on the total FLR contributed during the 5-day event. The distribution becomes more dispersed as more wallets participate, ensuring a fair and equitable allocation of tokens.At the conclusion of the presale, 51% of the funds raised will be directed towards seed liquidity to support a stable market entry. The remaining tokens are then distributed to participants, who will receive their PepeF tokens automatically.
`}
            </strong>
          </p>
          <h1 className="text-[18px] uppercase mt-5 font-bold text-white">
            Wen Presale?
          </h1>
          <p className="text-[15px] mt-2">
            <strong className="text-[16px] text-white">
              {`✅ Start Date: 29th April 2024 16:00 UTC `}
            </strong>
          </p>
          <p className="text-[15px] mt-2">
            <strong className="text-[16px] text-white">
              {`✅ End Date:  4th May 2024 16:00 UTC `}
            </strong>
          </p>
          <h1 className="text-[18px] uppercase mt-5 font-bold text-white">
            Monthly Airdrops?
          </h1>
          <p className="text-[15px] mt-4">
            <strong className="text-[18px] text-white">
              {` Each month,20% of the total supply is earmarked for airdrops to PepeS NFT holders.These airdrops coincide with our Flaredrop events and will continue over a span of 21 months. Holders can expect these tokens as a reward for their continued support, with snapshots taken randomly each month to determine eligibility.`}
            </strong>
          </p>
          <div className="flex items-center justify-start gap-3">
            <p className="text-[15px] mt-2">
              <strong className="text-[16px] text-white">
                {`Powered by Fomo Factory - ZOINK `}
                <br />
              </strong>
            </p>
            <a href={ZOINK_LINK} target="_blank" rel="referrer">
              <TbWorld color="#f95191ec" size={22} />
            </a>
          </div>
        </div>
      </div>
      {loading && (
        <div
          className="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-[#1e1e1ee1] backdrop-blur-2xl duration-300
      transition-all"
        >
          <ClassicSpinner color="#E61A59" />
        </div>
      )}
    </>
  );
};

export default Detail;
