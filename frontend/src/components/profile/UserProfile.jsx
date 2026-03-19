import React, { useState, useEffect } from 'react';
import { me } from '../../api/authentication/auth';
import './UserProfile.css';
import { studySessionAPI } from '../../api/studySession';

export default function ProfilePage({ onClose }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
  });

  useEffect(() => {
  const fetchUser = async () => {
    try {
      const response = await me();
      setUser(response);
      setFormData({
        name: response.name || '',
        location: response.location || '',
      });

      try {
        const stat = await studySessionAPI.getStats();
        setStats({
          currentStreak: stat.currentStreak ?? 0,
          bestStreak: stat.bestStreak ?? 0,
          totalHours: Math.round(stat.totalStudyTime ?? 0),
          pomodorosCompleted: stat.totalPomodoros ?? 0,
          thisWeek: 0,
          dailyAverage: '0.0',
        });
      } catch (statsError) {
        // fallback nếu endpoint stats lỗi
        calculateStats(response);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, []);

  const calculateStats = (userData) => {
    if (!userData.times || userData.times.length === 0) {
      setStats({
        currentStreak: 0,
        bestStreak: 0,
        totalHours: 0,
        pomodorosCompleted: 0,
        thisWeek: 0,
        dailyAverage: 0,
      });
      return;
    }

    const times = userData.times;
    let totalDuration = 0;
    let totalCount = 0;

    times.forEach(t => {
      totalDuration += t.duration;
      totalCount += t.count;
    });

    setStats({
      currentStreak: 0,
      bestStreak: 0,
      totalHours: Math.round(totalDuration),
      pomodorosCompleted: totalCount,
      thisWeek: 0,
      dailyAverage: '0.0',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      // TODO: Implement update profile API
      console.log('Saving profile:', formData);
      setEditing(false);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="profile-modal-overlay" onClick={onClose}>
        <div className="profile-modal-content" onClick={e => e.stopPropagation()}>
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-modal-overlay" onClick={onClose}>
        <div className="profile-modal-content" onClick={e => e.stopPropagation()}>
          <div className="error">User not found</div>
        </div>
      </div>
    );
  }

  const coins = user.times?.length || 0;
  const level = Math.floor((user.times?.length || 0) / 10) + 1;

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="profile-modal-header">
          <h2>{user.username}'s profile</h2>
          <div className="profile-modal-actions">
            {!editing && (
              <button className="btn-edit-modal" onClick={() => setEditing(true)}>
                ✏️ Edit
              </button>
            )}
            <button className="btn-copy-link">
              🔗 Copy link
            </button>
            <button className="btn-close" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* User Info Section */}
        <div className="profile-user-section">
          <div className="profile-avatar-large">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="profile-user-info">
            <h1>{user.username}</h1>
            <p className="level-badge">Lv. {level}</p>
            <p className="coins-info">Your coins: {coins}</p>
          </div>
          <div className="profile-xp-bar">
            <p className="xp-text">{coins} XP to next</p>
            <div className="xp-bar-bg">
              <div className="xp-bar-fill" style={{ width: `${(coins % 10) * 10}%` }}></div>
            </div>
            <p className="xp-next">{10 - (coins % 10)}/10 xp</p>
          </div>
        </div>

        {/* Stats Section */}
        {!editing && stats && (
          <div className="profile-stats-section">
            <h3 className="stats-title">📊 Stats</h3>
            <div className="stats-grid">
              <div className="stat-card stat-current-streak">
                <p className="stat-label">Current Streak</p>
                <p className="stat-value">{stats.currentStreak}</p>
                <p className="stat-unit">DAYS</p>
              </div>
              <div className="stat-card stat-best-streak">
                <p className="stat-label">Best Streak</p>
                <p className="stat-value">{stats.bestStreak}</p>
                <p className="stat-unit">DAYS</p>
              </div>
              <div className="stat-card stat-total-hours">
                <p className="stat-label">Total hours</p>
                <p className="stat-value-highlight">Plus</p>
                <p className="stat-value">{stats.totalHours}h</p>
              </div>
              <div className="stat-card stat-pomodoros">
                <p className="stat-label">Pomodoros Completed</p>
                <p className="stat-value">{stats.pomodorosCompleted}</p>
              </div>
              <div className="stat-card stat-this-week">
                <p className="stat-label">This Week</p>
                <p className="stat-value">{stats.thisWeek}</p>
                <p className="stat-unit">POMODOROS</p>
              </div>
              <div className="stat-card stat-daily-average">
                <p className="stat-label">Daily average</p>
                <p className="stat-value-secondary">Plus</p>
                <p className="stat-label-secondary">LAST 0 DAYS</p>
              </div>
            </div>
          </div>
        )}

        {/* Edit Form */}
        {editing && (
          <div className="profile-edit-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter your location"
              />
            </div>
            <div className="form-actions">
              <button 
                className="btn-cancel-edit"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-save-edit"
                onClick={handleSaveProfile}
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* Heatmap Section */}
        <div className="profile-heatmap-section">
          <h3 className="heatmap-title">🔥 Heatmap</h3>
          <div className="heatmap-placeholder">
            <div className="lock-icon">🔒</div>
            <p>Unlock History</p>
          </div>
        </div>
      </div>
    </div>
  );
}