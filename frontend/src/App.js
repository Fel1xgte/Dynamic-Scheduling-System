import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Landing from './pages/Landing';
import Input from './pages/Input';
import Profile from './pages/Profile';
import Login from './pages/Login';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/input" element={<Input />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;