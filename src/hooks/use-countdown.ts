"use client";

import { useEffect, useState } from "react";
import { getCountdown, type CountdownTime } from "@/utils/countdown";

const EMPTY_COUNTDOWN: CountdownTime = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  isComplete: false,
  totalMilliseconds: 0,
};

export function useCountdown(targetDate: string) {
  const [time, setTime] = useState<CountdownTime>(EMPTY_COUNTDOWN);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(getCountdown(targetDate));

    const interval = window.setInterval(() => {
      setTime(getCountdown(targetDate));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [targetDate]);

  return { ...time, mounted };
}
