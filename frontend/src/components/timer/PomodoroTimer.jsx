import './PomodoroTimer.css';  // CSS file (sẽ tạo sau)
export default function PomodoroTimer() {
    return (
        <div className="timer-container">
            {/* Background */}
            <div className="timer-background"></div>

            {/* Mode Toggle Button */}
            <div className="mode-selector">
                <button className="mode-btn">Switch Mode</button>
            </div>

            {/* Decorative Dots */}
            <div className="tag-dots">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
            </div>

            {/* Timer Display */}
            <div className="timer-display">
                <h1 className="time">00:00</h1>
            </div>

            {/* Task Input */}
            <div className="task-input">
                <input type="text" placeholder="What are you working on?" />
            </div>

            {/* Start/Pause Button */}
            <button className="start-btn">Start</button>

            {/* Reset Button */}
            <button className="reset-btn">Reset</button>

            {/* Stats */}
            <div className="stats">
                <p>🍅 Pomodoros: 0</p>
                <p>⏱️ Mode: pomodoro</p>
            </div>
        </div>
    );
}