import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './PomodoroTimer.css';
import useTimer from '../../hooks/userTimer';
import backgroundImage from '../../assets/background.jpg';
import SettingsModal from './SettingsModal';
import { logout } from '../../api/authentication/auth';


// SVG Icon imports
import upgradeIcon from '../../assets/user-menu/gift.svg';
import profileIcon from '../../assets/user-menu/profile.svg';
import roomIcon from '../../assets/user-menu/group.svg';
import settingsIcon from '../../assets/user-menu/setting.svg';
import friendIcon from '../../assets/user-menu/friend.svg';
import extensionIcon from '../../assets/user-menu/extension.svg';
import ourApp from '../../assets/user-menu/app.svg';
import logoutIcon from '../../assets/user-menu/logout.svg';
import weatherIcon from '../../assets/ground/cloud.svg';
import musicIcon from '../../assets/ground/music.svg';
import backgroundIcon from '../../assets/ground/picture.svg';
import notesIcon from '../../assets/ground/note.svg';
import chattingIcon from '../../assets/ground/chatting.svg';
import findUser from '../../assets/ground/finduser.svg';
import focusLightning from '../../assets/ground/lightning.svg';
import clockIcon from '../../assets/ground/clock.svg';

// ========== STATIC CONFIGS ==========
const MENU_ITEMS = [
  { id: 'upgrade', icon: upgradeIcon, text: 'Upgrade to Plus', arrow: true, type: 'svg' },
  { id: 'profile', icon: profileIcon, text: 'Public profile', arrow: true, type: 'svg' },
  { id: 'room', icon: roomIcon, text: 'Find study room', arrow: true, type: 'svg' },
  { id: 'settings', icon: settingsIcon, text: 'App settings', arrow: true, type: 'svg' },
  { id: 'friends', icon: friendIcon, text: 'Manage friends', arrow: true, type: 'svg' },
];

const EXTERNAL_ITEMS = [
  { id: 'discord', icon: '💬', text: 'Discord', external: true, type: 'emoji' },
  { id: 'extension', icon: extensionIcon, text: 'Chrome extension', external: true, type: 'svg' },
  { id: 'notion', icon: '📝', text: 'Notion pomodoro timer', external: true, type: 'emoji' },
];

const FOOTER_ITEMS = [
  { id: 'apps', icon: ourApp, text: 'Our apps', arrow: true, type: 'svg' },
  { id: 'logout', icon: logoutIcon, text: 'Logout', external: true, type: 'svg' },
];

const PRESET_NAMES = ['Pomodoro', 'Short Break', 'Long Break'];

const FOOTER_BUTTONS_LEFT = [
  { id: 'cloud', icon: weatherIcon, label: 'Cloud' },
  { id: 'music', icon: musicIcon, label: 'Music' },
  { id: 'background', icon: backgroundIcon, label: 'Background' },
  { id: 'notes', icon: notesIcon, label: 'Notes' },
];

const FOOTER_BUTTONS_RIGHT = [
  { id: 'user', icon: findUser, label: 'User' },
  { id: 'chat', icon: chattingIcon, label: 'Chat' },
  { id: 'deepfocus', icon: focusLightning, label: 'Deep Focus' },
  { id: 'clock', icon: clockIcon, label: 'Clock' },
];

// ========== MEMOIZED COMPONENTS ==========
// Icon renderer - FIX: check type field thay vì .endsWith
const IconRenderer = React.memo(({ icon, type }) => {
  if (type === 'svg') {
    return (
      <img 
        src={icon} 
        alt="" 
        loading="lazy"
        className="icon-svg"
        width="20"
        height="20"
      />
    );
  }
  
  return <span className="emoji-icon">{icon}</span>;
});

IconRenderer.displayName = 'IconRenderer';

// Menu item button
const UserMenuItemComponent = React.memo(({ item, onItemClick }) => {
  const handleClick = useCallback(() => {
    onItemClick(item.id);
  }, [item.id, onItemClick]);

  return (
    <button className="user-dropdown-item" onClick={handleClick}>
      <span className="item-icon">
        <IconRenderer icon={item.icon} type={item.type} />
      </span>
      <span className="item-text">{item.text}</span>
      <span className={item.arrow ? 'item-arrow' : 'item-external'}>
        {item.arrow ? '›' : '↗'}
      </span>
    </button>
  );
});

UserMenuItemComponent.displayName = 'UserMenuItemComponent';

// Menu section with divider
const UserMenuSection = React.memo(({ items, isLast, onItemClick }) => {
  return (
    <>
      <div className="user-dropdown-items">
        {items.map(item => (
          <UserMenuItemComponent
            key={item.id}
            item={item}
            onItemClick={onItemClick}
          />
        ))}
      </div>
      {!isLast && <div className="user-dropdown-divider" />}
    </>
  );
});

UserMenuSection.displayName = 'UserMenuSection';

// Preset dots indicator
const PresetDots = React.memo(({ currentPreset, onPresetChange }) => {
  return (
    <div className="preset-dots">
      {PRESET_NAMES.map((name, index) => (
        <button
          key={index}
          className={`preset-dot ${currentPreset === index ? 'active' : ''}`}
          onClick={() => onPresetChange(index)}
          aria-label={`${name} preset`}
          title={name}
        />
      ))}
    </div>
  );
});

PresetDots.displayName = 'PresetDots';

// Footer buttons group
const FooterButtonsGroup = React.memo(({ buttons, direction }) => {
  return (
    <div className={`footer-${direction}`}>
      {buttons.map(btn => {
        const isSvg = typeof btn.icon === 'string' && (btn.icon.includes('.svg') || btn.icon.startsWith('data:'));
        
        return (
          <button 
            key={btn.id}
            className="footer-btn"
            aria-label={btn.label}
            title={btn.label}
          >
            {isSvg ? (
              <img 
                src={btn.icon} 
                alt={btn.label}
                className="footer-btn-icon"
                loading="lazy"
              />
            ) : (
              btn.icon
            )}
          </button>
        );
      })}
    </div>
  );
});

FooterButtonsGroup.displayName = 'FooterButtonsGroup';

// User dropdown header
const UserDropdownHeader = React.memo(({ onClose }) => {
  return (
    <div className="user-dropdown-header">
      <div>
        <div className="user-dropdown-title">MegaScholar905</div>
        <div className="user-dropdown-subtitle">Guest Account</div>
      </div>
      <button 
        className="user-dropdown-close"
        onClick={onClose}
        aria-label="Close menu"
      >
        ✕
      </button>
    </div>
  );
});

UserDropdownHeader.displayName = 'UserDropdownHeader';

// ========== MAIN COMPONENT ==========
export default function PomodoroTimer() {
  const navigate = useNavigate();
  const { minutes, seconds, isRunning, toggleTimer } = useTimer(25);
  
  // States
  const [mode, setMode] = useState('pomodoro');
  const [showSettings, setShowSettings] = useState(false);
  const [task, setTask] = useState('');
  const [currentPreset, setCurrentPreset] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // ========== CLICK OUTSIDE HANDLER ==========
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showUserMenu]);

  // ========== OPTIMIZED HANDLERS (useCallback) ==========
  
  const handleToggleUserMenu = useCallback(() => {
    setShowUserMenu(prev => !prev);
  }, []);

  const handleCloseUserMenu = useCallback(() => {
    setShowUserMenu(false);
  }, []);

  const handleMenuItemClick = useCallback(async (itemId) => {
  if (itemId === 'logout') {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Logout failed');
    }
  } else {
    console.log('Menu item clicked:', itemId);
  }
  setShowUserMenu(false);
}, [navigate]);

  const handlePresetChange = useCallback((index) => {
    setCurrentPreset(index);
    // TODO: Update timer based on preset
  }, []);

  const handleToggleMode = useCallback(() => {
    setMode(prev => prev === 'pomodoro' ? 'stopwatch' : 'pomodoro');
  }, []);

  const handleTaskChange = useCallback((e) => {
    setTask(e.target.value);
  }, []);

  const handleOpenSettings = useCallback(() => {
    setShowSettings(true);
  }, []);

  const handleCloseSettings = useCallback(() => {
    setShowSettings(false);
  }, []);

  // ========== RENDER ==========
  return (
    <div className="timer-container">
      {/* Background Image */}
      <div
        className="timer-background"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        role="presentation"
      />

      {/* Dark Overlay */}
      <div className="timer-overlay" role="presentation" />

      {/* Header */}
      <header className="timer-header">
        <div className="logo">
          <span className="logo-icon" aria-hidden="true">🎯</span>
          <span className="logo-text">StudyFocus</span>
          <button className="deep-focus-btn" aria-label="Enter deep focus mode">
            ⚡ Deep Focus
          </button>
        </div>

        <div className="header-right">
          <button className="stat-btn" aria-label="Streak: 1">🔥 1</button>
          <button className="stat-btn" aria-label="Study time: 0 minutes">⏱️ 0m</button>
          <button className="stat-btn" aria-label="Statistics">📊</button>
          <button className="stat-btn" aria-label="Notifications">🔔</button>
          <button className="user-menu" aria-label="Enter user's study room">
            User's room
          </button>
          
          {/* User Menu with Dropdown */}
          <div className="user-menu-wrapper" ref={userMenuRef}>
            <button 
              onClick={handleToggleUserMenu} 
              className="login-nav-btn"
              aria-expanded={showUserMenu}
              aria-haspopup="menu"
              aria-label="User menu"
            >
              MN
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="user-dropdown-menu" role="menu">
                <UserDropdownHeader onClose={handleCloseUserMenu} />
                <div className="user-dropdown-divider" />
                <UserMenuSection 
                  items={MENU_ITEMS} 
                  onItemClick={handleMenuItemClick}
                />
                <UserMenuSection 
                  items={EXTERNAL_ITEMS} 
                  onItemClick={handleMenuItemClick}
                />
                <UserMenuSection 
                  items={FOOTER_ITEMS}
                  isLast 
                  onItemClick={handleMenuItemClick}
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="timer-content">
        {/* Preset Dots Indicator */}
        <PresetDots 
          currentPreset={currentPreset}
          onPresetChange={handlePresetChange}
        />

        {/* Timer Display */}
        <div className="timer-display">
          <h1 className="time">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </h1>
        </div>

        {/* Task Input */}
        <div className="task-input-wrapper">
          <span className="task-icon" aria-hidden="true">☰</span>
          <input
            type="text"
            className="task-input"
            placeholder="What are you working on?"
            value={task}
            onChange={handleTaskChange}
            aria-label="Current task"
          />
        </div>

        {/* Control Buttons */}
        <div className="control-section">
          {/* Toggle Mode */}
          <button
            className="toggle-mode-btn"
            onClick={handleToggleMode}
            aria-label="Toggle between Pomodoro or Stopwatch mode"
          >
            <span aria-hidden="true">🔄</span>
            <span>Toggle between Pomodoro or Stopwatch.</span>
          </button>

          {/* Start Button */}
          <button 
            onClick={toggleTimer} 
            className="start-btn-large"
            aria-label={isRunning ? 'Pause timer' : 'Start timer'}
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>

          {/* Settings Icon */}
          <button
            className="settings-icon-btn"
            onClick={handleOpenSettings}
            aria-label="Open settings"
          >
            ⚙️
          </button>
        </div>
      </div>

      {/* Footer Controls */}
      <footer className="timer-footer">
        <FooterButtonsGroup buttons={FOOTER_BUTTONS_LEFT} direction="left" />
        <FooterButtonsGroup buttons={FOOTER_BUTTONS_RIGHT} direction="right" />
      </footer>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal onClose={handleCloseSettings} />
      )}
    </div>
  );
}