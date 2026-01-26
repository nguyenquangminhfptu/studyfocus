import { useState, useEffect, useRef } from 'react';//lấy hook ra
//        ↑         ↑          ↑
//      State    Side effect  Reference
import { studySessionAPI } from '../../api/studySession';
//         ↑
//      Import API service vừa tạo
import './PomodoroTimer.css';  // CSS file (sẽ tạo sau)
export default function PomodoroTimer() {
    //      ↑              ↑
    //   Export default  Tên component

    // Code tiếp theo ở đây...
    // ==========================================
    // STATE - DỮ LIỆU ĐỘNG CỦA COMPONENT
    // ==========================================

    // 1. TIMER STATE
    const [minutes, setMinutes] = useState(25);
    //      ↑           ↑              ↑
    //   Giá trị  Hàm thay đổi    Giá trị ban đầu = 25

    const [seconds, setSeconds] = useState(0);
    // Tại sao tách minutes và seconds?
    // → Để dễ hiển thị: 25:00, 24:59, 24:58...

    const [isRunning, setIsRunning] = useState(false);
    // true = đang chạy, false = đang dừng

    const [mode, setMode] = useState('pomodoro');
    // 'pomodoro' hoặc 'stopwatch'

    const [pomodoroCount, setPomodoroCount] = useState(0);
    // Đếm số pomodoro đã hoàn thành

    const [task, setTask] = useState('');
    // Lưu nội dung input "What are you working on?"

    // 2. REF - KHÔNG GÂY RE-RENDER
    const intervalRef = useRef(null);
    // Lưu ID của setInterval() để có thể clearInterval() sau

    const startTimeRef = useRef(0);
    // Lưu thời điểm bắt đầu timer (timestamp)

    // Code tiếp...
    // COUNTDOWN LOGIC - ĐẾM NGƯỢC
    useEffect(() => {
        // useEffect này chạy MỖI KHI: isRunning, minutes, seconds, mode THAY ĐỔI

        // Điều kiện: Chỉ chạy khi đang ở mode Pomodoro VÀ timer đang chạy

        if (mode === 'pomodoro' && isRunning) {
            // setInterval = Chạy function mỗi 1000ms (1 giây)
            intervalRef.current = setInterval(() => {
                // Kiểm tra: seconds = 0 chưa?
                if (seconds === 0) {

                    // Nếu seconds = 0, kiểm tra minutes
                    if (minutes === 0) {
                        // ====== TIMER HẾT GIỜ! ======
                        handleTimerComplete();

                    } else {
                        // Chưa hết giờ: Giảm 1 phút, reset seconds về 59
                        setMinutes(prev => prev - 1);
                        //          ↑
                        // prev = giá trị hiện tại của minutes
                        // prev - 1 = giá trị mới

                        setSeconds(59);
                    }

                } else {
                    // seconds > 0: Chỉ giảm seconds
                    setSeconds(prev => prev - 1);
                }
            }, 1000);

        }

        // Khi component unmount, clearInterval()
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                // Dừng setInterval để tránh memory leak
            }
        }


    }, [isRunning, minutes, seconds, mode]);
    //  ↑
    // Dependencies: useEffect chạy lại KHI 1 trong các giá trị này thay đổi


    // ==========================================
    // KHI TIMER HẾT GIỜ
    // ==========================================
    const handleTimerComplete = async () => {
        setIsRunning(false);//stop timer
        //2. Phát âm thanh thông báo
        try {
            const audio = new Audio('/notification.mp3');
            await audio.play();
        } catch (err) {
            console.log('Không có âm thanh:', err);
        }
        // 3. Tính thời gian đã học (phút)
        const duration = mode === 'pomodoro' ? 25.0 : 0;  // Hardcode 25 phút
        //4. Luu session vao backend
        await saveSession(duration);
        //5. Tăng số pomodoro
        setPomodoroCount(prev => prev + 1);
        //6. Reset timer
        setMinutes(25);
        setSeconds(0);
        //7. hien thi thong bao
        alert('Pomodoro completed!');
    }

    // ==========================================
    // SAVE SESSION TO BACKEND
    // ==========================================
    const saveSession = async (duration) => {
        try {
            //call api to create session
            const response = await studySessionAPI.createSession({
                duration: duration,
                breakTime: 5.0,
                count: 1,
                mode: 'pomodoro'
            });
            console.log('Session saved:', response);
        } catch (err) {
            console.log('Failed to save session:', err);
        }
    }

    // ==========================================
    // START / PAUSE TIMER
    // ==========================================
    const toggleTimer = () => {
        setIsRunning(!isRunning);
        if (!isRunning) {
            startTimeRef.current = Date.now();
        }
    };
    // ==========================================
    // RESET TIMER
    // ==========================================
    const resetTimer = () => {
        setIsRunning(false);
        clearInterval(intervalRef.current);
        setMinutes(25);
        setSeconds(0);
        setPomodoroCount(0);
        setTask('');
    };

    // ==========================================
    // TOGGLE MODE (Pomodoro ↔ Stopwatch)
    // ==========================================
    const toggleMode = () => {
        setMode(mode === 'pomodoro' ? 'stopwatch' : 'pomodoro');
        resetTimer();
    };



    return (
        <div className="timer-container">
            {/* Background */}
            <div className="timer-background"></div>

            {/* Mode Toggle Button */}
            <div className="mode-selector">
                <button onClick={toggleMode} className="mode-btn">
                    {mode === 'pomodoro' ? 'Switch to Stopwatch' : 'Switch to Pomodoro'}
                </button>
            </div>

            {/* Decorative Dots */}
            <div className="tag-dots">
                <span className="dot active"></span>
                <span className="dot"></span>
                <span className="dot"></span>
            </div>

            {/* Timer Display */}
            <div className="timer-display">
                <h1 className="time">
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </h1>
            </div>

            {/* Task Input */}
            <div className="task-input">
                <input
                    type="text"
                    placeholder="What are you working on?"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                />
            </div>

            {/* Start/Pause Button */}
            <button onClick={toggleTimer} className="start-btn">
                {isRunning ? 'Pause' : 'Start'}
            </button>

            {/* Reset Button */}
            <button onClick={resetTimer} className="reset-btn">
                Reset
            </button>

            {/* Stats */}
            <div className="stats">
                <p>🍅 Pomodoros: {pomodoroCount}</p>
                <p>⏱️ Mode: {mode}</p>
            </div>
        </div>
    );

}//PomodoroTimer