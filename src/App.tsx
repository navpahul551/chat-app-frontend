import React, { useState } from 'react';
import './App.css';
import { Login } from './components/login/Login';
import { Home } from './components/home/Home';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import SignUp from './components/signUp/SignUp';

function App() {
    return (
      <>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
      </>
    );
}

export default App;
