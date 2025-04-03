import React from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';

import Landing from './pages/Landing';
import Input from './pages/Input';
import Profile from './pages/profile';
import Login from './pages/Login';

function App() {
  const location = useLocation();
  const noNavBar = ["/landing"]; 

  return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col h-[90vh] w-[40vh] border rounded-lg shadow-md overflow-hidden">
      
        <div className="flex-grow overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/landing" />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/input" element={<Input />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
          
          </Routes>
        </div>

    
      </div>
    </div>
  );
}

export default App;

