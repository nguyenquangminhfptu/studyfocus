import { useEffect, useState } from "react";

export default function useTimer(intervalMs = 1000) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSeconds(s => s + 1), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return { seconds };
}
