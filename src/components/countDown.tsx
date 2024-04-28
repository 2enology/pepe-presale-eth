import React, { useCallback, useEffect, useState } from "react";
interface CountdownProps {
  timestamp: number;
}

const Countdown: React.FC<CountdownProps> = ({ timestamp }) => {
  const calculateTimeLeft = useCallback(() => {
    const difference = timestamp - new Date().getTime();
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    }

    return timeLeft;
  }, [timestamp]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft, timestamp]);

  const formatTimeUnit = (unit: number) => (unit < 10 ? `0${unit}` : unit);

  return (
    <div className="flex items-center justify-center flex-col gap-5">
      <p className="font-bold text-white text-[25px]">Presale Starts In</p>
      <div className="flex gap-5">
        <div className="flex flex-col gap-2 items-center justify-center">
          <span className="bg-[#d24e4e] rounded-md bg-opacity-30 font-bold text-white p-5 text-[19px]">
            {formatTimeUnit(timeLeft.days)}
          </span>
          <span className="text-[14px] font-semibold text-white">Days</span>
        </div>
        <div className="flex flex-col gap-2 items-center justify-center">
          <span className="bg-[#d24e4e] rounded-md bg-opacity-20 font-bold text-white p-5 text-[19px]">
            {formatTimeUnit(timeLeft.hours)}
          </span>
          <span className="text-[14px] font-semibold text-white">Hours</span>
        </div>
        <div className="flex flex-col gap-2 items-center justify-center">
          <span className="bg-[#d24e4e] rounded-md bg-opacity-20 font-bold text-white p-5 text-[19px]">
            {formatTimeUnit(timeLeft.minutes)}
          </span>
          <span className="text-[14px] font-semibold text-white">
            Minutes
          </span>
        </div>
        <div className="flex flex-col gap-2 items-center justify-center">
          <span className="bg-[#d24e4e] rounded-md bg-opacity-20 font-bold text-white p-5 text-[19px]">
            {formatTimeUnit(timeLeft.seconds)}
          </span>
          <span className="text-[14px] font-semibold text-white">
            Seconds
          </span>
        </div>
      </div>
    </div>
  );
};

export default Countdown;
