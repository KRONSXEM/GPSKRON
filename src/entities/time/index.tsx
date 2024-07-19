"use client";
import { getCurrentTime } from "@/shared/lib/utils";
import React, { useEffect, useState } from "react";

export const Time = () => {
  const [time, setTime] = useState(getCurrentTime());

  useEffect(() => {
    const intr = setInterval(() => {
      setTime(getCurrentTime());
    }, 1000);

    return () => {
      clearInterval(intr);
    };
  }, [time]);

  return (
    <div className="absolute top-3 left-[50%] z-[500] -translate-x-1/2">
      {time}
    </div>
  );
};
