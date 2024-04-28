/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { useRouter } from "next/router";
import WalletConnectBtn from "../walletConnectButton";

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();
  return (
    <>
      <div className="w-full xl:flex items-center justify-center border-b border-black border-opacity-5 p-1 z-[9999]">
        <div className="xl:w-[1200px] w-auto flex items-center justify-between px-3">
          <div className="flex items-center justify-center top-[24px] p-1 gap-3 cursor-pointer">
            <img
              src="/imgs/logo.jpg"
              className="w-[45px] h-[45px] border-black rounded-full "
              alt=""
            />
            <p className="uppercase text-white text-opacity-80 font-extrabold text-[18px] cursor-pointer">
              {`$PepeF`}
            </p>
          </div>
          <WalletConnectBtn />
        </div>
      </div>
    </>
  );
};

export default Header;
