import React from 'react';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import HomePage from './scenes/homePage/index';
import LoginPage from './scenes/loginPage/index';
import ProfilePage from './scenes/profilePage/index';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />}></Route>
          <Route path="/home" element={<HomePage />}></Route>
          <Route path="/profile/:userId" element={<ProfilePage />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;