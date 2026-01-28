import React, { useState } from 'react';
import './SettingsModal.css';

export default function SettingsModal({ onClose }) {
    const [activeTab, setActiveTab] = useState('focus'); // 'focus' or 'stopwatch'
    const [preset, setPreset] = useState('Extended Focus');
    const [countUpTimer, setCountUpTimer] = useState(false);
    const [deepFocus, setDeepFocus] = useState(false);

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button className="modal-close" onClick={onClose}>✕</button>

                {/* Tabs */}
                <div className="modal-tabs">
                    <button 
                        className={`modal-tab ${activeTab === 'focus' ? 'active' : ''}`}
                        onClick={() => setActiveTab('focus')}
                    >
                        <span className="tab-icon">⏱️</span>
                        Focus Timer
                    </button>
                    <button 
                        className={`modal-tab ${activeTab === 'stopwatch' ? 'active' : ''}`}
                        onClick={() => setActiveTab('stopwatch')}
                    >
                        <span className="tab-icon">⏱️</span>
                        Stopwatch
                    </button>
                </div>

                {/* Content */}
                <div className="modal-body">
                    {/* Preset Selector */}
                    <div className="modal-row">
                        <label>Preset:</label>
                        <select 
                            className="preset-select"
                            value={preset}
                            onChange={(e) => setPreset(e.target.value)}
                        >
                            <option>Extended Focus</option>
                            <option>Pomodoro</option>
                            <option>Short Break</option>
                            <option>Long Break</option>
                        </select>
                        <span className="preset-times">50m · 10m · 30m</span>
                    </div>

                    {/* Toggle Options */}
                    <div className="modal-row toggle-row">
                        <div className="toggle-item">
                            <span className="toggle-icon">⬆️</span>
                            <span>Count up timer</span>
                        </div>
                        <label className="toggle-switch">
                            <input 
                                type="checkbox"
                                checked={countUpTimer}
                                onChange={(e) => setCountUpTimer(e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    <div className="modal-row toggle-row">
                        <div className="toggle-item">
                            <span className="toggle-icon">⚠️</span>
                            <span>Deep Focus</span>
                        </div>
                        <label className="toggle-switch">
                            <input 
                                type="checkbox"
                                checked={deepFocus}
                                onChange={(e) => setDeepFocus(e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    <p className="modal-info">
                        Requires studyfoc.us <a href="#">Chrome extension</a>
                    </p>
                </div>
            </div>
        </div>
    );
}