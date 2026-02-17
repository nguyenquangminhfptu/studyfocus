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
import settingClockIcon from '../../assets/user-menu/settingClock.svg';

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
const PRESET_TIMES = [25, 5, 10]; // Pomodoro: 25min, Short Break: 5min, Long Break: 10min

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
  const { minutes, seconds, isRunning, toggleTimer, setTime } = useTimer(25);

  // States
  const [mode, setMode] = useState('pomodoro');
  const [showSettings, setShowSettings] = useState(false);
  const [task, setTask] = useState('');
  const [currentPreset, setCurrentPreset] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isPiPMode, setIsPiPMode] = useState(false);

  // Refs
  const userMenuRef = useRef(null);
  const videoRef = useRef(null);
  const pipWindowRef = useRef(null);

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

  // ========== PICTURE-IN-PICTURE SETUP ========== 
  useEffect(() => {
    return () => {
      if (pipWindowRef.current && !pipWindowRef.current.closed) {
        pipWindowRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (pipWindowRef.current && !pipWindowRef.current.closed) {
      const pipDoc = pipWindowRef.current.document;
      const timerElement = pipDoc.getElementById('pip-timer');
      if (timerElement) {
        timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      }
      const playPauseBtn = pipDoc.getElementById('pip-play-pause');
      if (playPauseBtn) {
        playPauseBtn.textContent = isRunning ? 'Pause' : 'Start';
        const newBtn = playPauseBtn.cloneNode(true);
        playPauseBtn.parentNode.replaceChild(newBtn, playPauseBtn);
        newBtn.addEventListener('click', () => {
          toggleTimer();
        });
      }
    }
  }, [minutes, seconds, isRunning, toggleTimer]);

  // ========== HANDLERS ==========
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

  const handleSkipToBreak = useCallback(() => {
    const nextPreset = (currentPreset + 1) % PRESET_NAMES.length;
    setCurrentPreset(nextPreset);
    const newTime = PRESET_TIMES[nextPreset];
    if (setTime) {
      setTime(newTime);
    }
    console.log('Skipped to:', PRESET_NAMES[nextPreset], `(${newTime} minutes)`);
  }, [currentPreset, setTime]);

  // HÀM XỬ LÝ THAY ĐỔI PRESET TỪ DOTS (click vào chấm tròn)
  const handlePresetDotChange = useCallback((index) => {
    setCurrentPreset(index);
    const newTime = PRESET_TIMES[index];
    if (setTime) {
      setTime(newTime);
    }
    console.log('Preset dot changed to:', PRESET_NAMES[index], `(${newTime} minutes)`);
  }, [setTime]);

  // ⭐ HÀM XỬ LÝ THAY ĐỔI PRESET TỪ MODAL SETTINGS
  const handleSettingsPresetChange = useCallback((presetConfig) => {
    console.log('Settings preset changed to:', presetConfig.presetName);
    
    // Cập nhật thời gian từ modal settings
    if (setTime) {
      setTime(presetConfig.focusTime);
    }
    
    // Đóng modal
    setShowSettings(false);
  }, [setTime]);

  const handleTogglePiP = useCallback(async () => {
    if (!('documentPictureInPicture' in window)) {
      alert('Document Picture-in-Picture is not supported in your browser. Please use Chrome 116+');
      return;
    }

    try {
      if (pipWindowRef.current && !pipWindowRef.current.closed) {
        pipWindowRef.current.close();
        pipWindowRef.current = null;
        setIsPiPMode(false);
        return;
      }

      const pipWindow = await window.documentPictureInPicture.requestWindow({
        width: 450,
        height: 280,
      });

      pipWindowRef.current = pipWindow;
      setIsPiPMode(true);

      const styleSheets = Array.from(document.styleSheets);
      styleSheets.forEach((styleSheet) => {
        try {
          const cssRules = Array.from(styleSheet.cssRules || [])
            .map((rule) => rule.cssText)
            .join('');
          const style = pipWindow.document.createElement('style');
          style.textContent = cssRules;
          pipWindow.document.head.appendChild(style);
        } catch (e) {
          const link = pipWindow.document.createElement('link');
          link.rel = 'stylesheet';
          link.href = styleSheet.href;
          pipWindow.document.head.appendChild(link);
        }
      });

      const pipExtraStyles = pipWindow.document.createElement('style');
      pipExtraStyles.textContent = `
        .pip-container {
          background-image: url('${backgroundImage}') !important;
          background-size: cover !important;
          background-position: center !important;
        }
      `;
      pipWindow.document.head.appendChild(pipExtraStyles);

      const pipContainer = pipWindow.document.createElement('div');
      pipContainer.className = 'pip-container';
      pipContainer.innerHTML = `
        <div class="pip-content">
          <div id="pip-timer" class="pip-timer">
            ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}
          </div>
          <div class="pip-controls">
            <button id="pip-play-pause" class="pip-btn">
              ${isRunning ? 'Pause' : 'Start'}
            </button>
            <button id="pip-skip" class="pip-icon-btn" title="Skip to next">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="5 4 15 12 5 20 5 4"/>
                <line x1="19" y1="5" x2="19" y2="19"/>
              </svg>
            </button>
          </div>
        </div>
      `;

      pipWindow.document.body.appendChild(pipContainer);

      const playPauseBtn = pipWindow.document.getElementById('pip-play-pause');
      const skipBtn = pipWindow.document.getElementById('pip-skip');

      playPauseBtn.addEventListener('click', toggleTimer);
      skipBtn.addEventListener('click', handleSkipToBreak);

      pipWindow.addEventListener('pagehide', () => {
        pipWindowRef.current = null;
        setIsPiPMode(false);
      });

    } catch (error) {
      console.error('Error opening Picture-in-Picture:', error);
      alert('Cannot open Picture-in-Picture: ' + error.message);
    }
  }, [minutes, seconds, isRunning, toggleTimer, handleSkipToBreak]);

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
      <div
        className="timer-background"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        role="presentation"
      />
      <div className="timer-overlay" role="presentation" />

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

      <div className="timer-content">
        {/* SỬA: Truyền handlePresetDotChange thay vì handlePresetChange */}
        <PresetDots
          currentPreset={currentPreset}
          onPresetChange={handlePresetDotChange}
        />

        <div className="timer-display">
          <h1 className="time">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </h1>
        </div>

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

        <div className="control-section">
          <button
            className="settings-icon-btn"
            onClick={handleOpenSettings}
            aria-label="Open settings"
          >
            <img
              src={settingClockIcon}
              alt="Settings"
              className="settings-icon-img"
              width="24"
              height="24"
            />
          </button>

          <button
            onClick={toggleTimer}
            className="start-btn-large"
            aria-label={isRunning ? 'Pause timer' : 'Start timer'}
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>

          <button
            className="pip-btn-main"
            onClick={handleTogglePiP}
            aria-label="Toggle Picture-in-Picture"
            title="Picture-in-Picture"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <rect x="13" y="13" width="6" height="6" rx="1" />
            </svg>
          </button>

          <button
            className="skip-btn"
            onClick={handleSkipToBreak}
            aria-label="Skip to next preset"
            title="Skip to break"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 4 15 12 5 20 5 4" />
              <line x1="19" y1="5" x2="19" y2="19" />
            </svg>
          </button>
        </div>
      </div>

      <footer className="timer-footer">
        <FooterButtonsGroup buttons={FOOTER_BUTTONS_LEFT} direction="left" />
        <FooterButtonsGroup buttons={FOOTER_BUTTONS_RIGHT} direction="right" />
      </footer>

      {/* SỬA: Truyền handleSettingsPresetChange */}
      {showSettings && (
        <SettingsModal 
          onClose={handleCloseSettings}
          onPresetChange={handleSettingsPresetChange}
        />
      )}
    </div>
  );
}