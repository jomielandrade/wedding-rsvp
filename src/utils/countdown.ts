export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
  totalMilliseconds: number;
}

export function getCountdown(
  targetDate: string | Date,
  now: number = Date.now(),
): CountdownTime {
  const target =
    typeof targetDate === "string"
      ? new Date(targetDate).getTime()
      : targetDate.getTime();

  const diff = Math.max(0, target - now);

  if (diff === 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isComplete: true,
      totalMilliseconds: 0,
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return {
    days,
    hours,
    minutes,
    seconds,
    isComplete: false,
    totalMilliseconds: diff,
  };
}

export function padCountdownUnit(value: number): string {
  return value.toString().padStart(2, "0");
}
