import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TimerPage from './pages/TimerPage';

function App() {
  
  return (
    
    <Router>
      <Routes>
        {/* Trang chính - Timer */}
        <Route path="/" element={<TimerPage />} />


        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
       
      </Routes>
      
    </Router>
    
  );
}

export default App;