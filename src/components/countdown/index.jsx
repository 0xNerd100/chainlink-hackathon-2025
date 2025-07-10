"use client";
import React, { useState, useEffect } from "react";

const CountdownTimer = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    if (difference <= 0) {
      return null;
    }
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const updatedTime = calculateTimeLeft();
      setTimeLeft(updatedTime);

      if (!updatedTime) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return <div>Countdown Complete!</div>;
  }

  return (
    <ul className="list-none text-center pl-0 mb-0 text-center font-bold flex items-center justify-start gap-2 text-[16px]">
      <li className="">
        <div className="sm:h-[80px] sm:w-[80px] h-[50px] w-[50px] rounded bg-[#1f8f3e] flex items-center justify-center p-2 sm:text-[26px] text-[20px] mb-2">
          {timeLeft.days}
        </div>{" "}
        <span className="sm:text-[14px] text-[12px] themeClr font-normal">
          Days
        </span>
      </li>
      <li className="">
        <div className="sm:h-[80px] sm:w-[80px] h-[50px] w-[50px] rounded bg-[#1f8f3e] flex items-center justify-center p-2 sm:text-[26px] text-[20px] mb-2">
          {timeLeft.hours}
        </div>{" "}
        <span className="sm:text-[14px] text-[12px] themeClr font-normal">
          Hours
        </span>
      </li>
      <li className="">
        <div className="sm:h-[80px] sm:w-[80px] h-[50px] w-[50px] rounded bg-[#1f8f3e] flex items-center justify-center p-2 sm:text-[26px] text-[20px] mb-2">
          {timeLeft.minutes}
        </div>{" "}
        <span className="sm:text-[14px] text-[12px] themeClr font-normal">
          Minutes
        </span>
      </li>
      <li className="">
        <div className="sm:h-[80px] sm:w-[80px] h-[50px] w-[50px] rounded bg-[#1f8f3e] flex items-center justify-center p-2 sm:text-[26px] text-[20px] mb-2">
          {timeLeft.seconds}
        </div>{" "}
        <span className="sm:text-[14px] text-[12px] themeClr font-normal">
          Seconds
        </span>
      </li>
    </ul>
  );
};

export default CountdownTimer;
