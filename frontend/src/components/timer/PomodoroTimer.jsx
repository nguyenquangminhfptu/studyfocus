import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PomodoroTimer.css';
import useTimer from '../../hooks/userTimer';
import backgroundImage from '../../assets/background.jpg';
import SettingsModal from './SettingsModal';

export default function PomodoroTimer() {
    const navigate = useNavigate();
    const { minutes, seconds, isRunning, toggleTimer, resetTimer } = useTimer(25);
    const [mode, setMode] = useState('pomodoro'); // 'pomodoro' or 'stopwatch'
    const [showSettings, setShowSettings] = useState(false);
    const [task, setTask] = useState('');
    const [currentPreset, setCurrentPreset] = useState(0); // 0: Pomodoro, 1: Short Break, 2: Long Break

    const presets = ['Pomodoro', 'Short Break', 'Long Break'];

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handlePresetChange = (index) => {
        setCurrentPreset(index);
        // Logic để thay đổi thời gian timer dựa trên preset
    };

    return (
        <div className="timer-container">
            {/* Background Image */}
            <div
                className="timer-background"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            ></div>

            {/* Dark Overlay */}
            <div className="timer-overlay"></div>

            {/* Header */}
            <header className="timer-header">
                <div className="logo">
                    <span className="logo-icon">🎯</span>
                    <span className="logo-text">StudyFocus</span>
                    <button className="deep-focus-btn">⚡ Deep Focus</button>
                </div>

                <div className="header-right">
                    <button className="stat-btn">🔥 1</button>
                    <button className="stat-btn">⏱️ 0m</button>
                    <button className="stat-btn">📊</button>
                    <button className="stat-btn">🔔</button>
                    <button className="user-menu">User's room</button>
                    <button onClick={handleLoginClick} className="login-nav-btn">
                        MN
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="timer-content">
                {/* Preset Dots Indicator */}
                <div className="preset-dots">
                    {presets.map((_, index) => (
                        <button
                            key={index}
                            className={`preset-dot ${currentPreset === index ? 'active' : ''}`}
                            onClick={() => handlePresetChange(index)}
                        />
                    ))}
                </div>

                {/* Timer Display */}
                <div className="timer-display">
                    <h1 className="time">
                        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </h1>
                </div>

                {/* Task Input */}
                <div className="task-input-wrapper">
                    <span className="task-icon">☰</span>
                    <input
                        type="text"
                        className="task-input"
                        placeholder="What are you working on?"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                    />
                </div>

                {/* Control Buttons */}
                <div className="control-section">
                    {/* Toggle Mode */}
                    <button
                        className="toggle-mode-btn"
                        onClick={() => setMode(mode === 'pomodoro' ? 'stopwatch' : 'pomodoro')}
                    >
                        <span className="toggle-icon">🔄</span>
                        <span>Toggle between Pomodoro or Stopwatch.</span>
                    </button>

                    {/* Start Button */}
                    <button onClick={toggleTimer} className="start-btn-large">
                        {isRunning ? 'Pause' : 'Start'}
                    </button>

                    {/* Settings Icon */}
                    <button
                        className="settings-icon-btn"
                        onClick={() => setShowSettings(true)}
                    >
                        ⚙️
                    </button>
                </div>
            </div>

            {/* Footer Controls */}
            <footer className="timer-footer">
                <div className="footer-left">
                    <button className="footer-btn">☁</button>   {/* Cloud - không có màu */}
                    <button className="footer-btn">♪</button>   {/* Music note */}
                    <button className="footer-btn">▦</button>   {/* Film/Video */}
                    <button className="footer-btn">✎</button>   {/* Pencil */}
                </div>
                <div className="footer-right">
                    <button className="footer-btn">☺</button>   {/* User */}
                    <button className="footer-btn">☰</button>   {/* Chat/Menu */}
                    <button className="footer-btn">⚡</button>  {/* Lightning */}
                    <button className="footer-btn">◷</button>   {/* Clock */}
                </div>
            </footer>

            {/* Settings Modal */}
            {showSettings && (
                <SettingsModal onClose={() => setShowSettings(false)} />
            )}
        </div>
    )
}