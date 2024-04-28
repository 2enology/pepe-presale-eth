import type { NextPage } from "next";
import dynamic from "next/dynamic";

const Home: NextPage = () => {
  const Detail = dynamic(() => import("../components/Detail"), {
    loading: () => <p>Hopping..</p>,
  });
  return (
    <>
      <video
        autoPlay
        muted
        loop
        id="myVideo"
        className="fixed right-0 bottom-0 top-0 min-h-full min-w-full -z-50"
      >
        <source src="/imgs/bg.mp4" type="video/mp4" />
      </video>
      <div className="flex flex-col items-center transition-all duration-300 min-h-full">
        <div className="w-full max-w-[1200px] flex md:mt-[52px] mt-[49px] items-center justify-center p-3 relative flex-col animate__animated animate__fadeIn">
          <Detail />
        </div>
      </div>
    </>
  );
};

export default Home;
