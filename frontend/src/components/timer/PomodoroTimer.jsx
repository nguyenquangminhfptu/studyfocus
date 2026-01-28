import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PomodoroTimer.css';
// ✅ ĐÚNG - userTimer.js nằm trong src/hooks/
import useTimer from '../../hooks/userTimer';
// ✅ ĐÚNG - background.jpg nằm trong src/assets/
import backgroundImage from '../../assets/background.jpg';

export default function PomodoroTimer() {
    const navigate = useNavigate();
    const { minutes, seconds, isRunning, toggleTimer, resetTimer } = useTimer(25);
    
    const handleLoginClick = () => {
        navigate('/login');
    };
    
    return(
        <div className="timer-container">
            {/* Background Image */}
            <div 
                className="timer-background"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            ></div>
            
            {/* Dark Overlay */}
            <div className="timer-overlay"></div>

            {/* Login Button - Góc phải trên */}
            <div className="header-controls">
                <button onClick={handleLoginClick} className="login-nav-btn">
                    Login
                </button>
            </div>

            {/* Content Wrapper */}
            <div className="timer-content">
                {/* Timer Display */}
                <div className="timer-display">
                    <h1 className="time">
                        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </h1>
                </div>

                {/* Buttons */}
                <div className="button-group">
                    <button onClick={toggleTimer} className="start-btn">
                        {isRunning ? 'Pause' : 'Start'}
                    </button>
                    <button onClick={resetTimer} className="reset-btn">
                        Reset
                    </button>
                    <button className="mode-btn">
                        Mode
                    </button>
                </div>
            </div>
        </div>
    )
}