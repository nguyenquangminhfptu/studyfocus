//tận dụng cho stopwatch và userTimer sau này
// Tái sử dụng logic.
// Tách biệt logic và giao diện.
// Dễ dàng kiểm tra và bảo trì.
// Quản lý trạng thái hiệu quả.
// Mở rộng tính năng dễ dàng.

//quản lý trạng thái và logic của bộ đếm thời gian
import { useState, useEffect, useRef, useCallback } from 'react';

export default function useTimer(initialMinutes = 25){
  const [minutes, setMinutes] = useState(initialMinutes);
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);//lưu trữ id của interval

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                if (seconds === 0) {
                    if (minutes === 0) {
                        clearInterval(intervalRef.current);
                        setIsRunning(false); // Hết giờ
                    } else {
                        setMinutes((prev) => prev - 1);
                        setSeconds(59);
                    }
                } else {
                    setSeconds((prev) => prev - 1);
                }
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }

        return () => clearInterval(intervalRef.current); // Cleanup
    }, [isRunning, minutes, seconds]);

    const setTime = useCallback((newMinutes) => {
    setMinutes(newMinutes);
    setSeconds(0);
    setIsRunning(false); // Dừng timer khi chuyển preset
  }, []);

    const toggleTimer = () => setIsRunning(!isRunning);
    const resetTimer = () => {
        setIsRunning(false);
        setMinutes(initialMinutes);
        setSeconds(0);
    };

      return { minutes, seconds, isRunning, toggleTimer, resetTimer, setTime };
}