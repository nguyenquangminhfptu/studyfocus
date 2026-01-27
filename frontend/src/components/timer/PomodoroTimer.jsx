import React, { useState } from 'react';
import './PomodoroTimer.css';
import useTimer from '/Users/quangminhnguyen/IdeaProjects/studyfocus_work/frontend/src/hooks/userTimer.js';


export default function PomodoroTimer() {
    const { minutes, seconds, isRunning, toggleTimer, resetTimer } = useTimer(25);
    return(
        <div className="timer-container">
            {/* Background */}
            <div className="timer-background"></div>

             {/* Timer Display */}
            <div className="timer-display">
                <h1 className="time">
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </h1>
            </div>

            {/* Start/Pause Button */}
            <button onClick={toggleTimer} className="start-btn">
                {isRunning ? 'Pause' : 'Start'}
            </button>

            {/* Reset Button */}
            <button onClick={resetTimer} className="reset-btn">Reset</button>

            {/* Mode Button */}
            <button className="mode-btn">Mode</button>
        </div>
    )
}