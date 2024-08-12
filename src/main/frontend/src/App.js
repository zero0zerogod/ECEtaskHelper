// src/main/frontend/src/App.js

import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './App.css';
import HomePage from './pages/HomePage/HomePage';
import SchedulePage from './pages/SchedulePage/SchedulePage';
import SubjectInfoPage from "./pages/SubjectInfoPage/SubjectInfoPage";
import AboutPage from './pages/AboutPage/AboutPage';
import LoginPage from './pages/LoginPage/LoginPage';
import NavBar from './components/NavBar';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
    const [isNavBarOpen, setIsNavBarOpen] = useState(true);

    const toggleNavBar = () => {
        setIsNavBarOpen(!isNavBarOpen);
    };

    return (
        <div className="App">
            <AuthProvider>
                <BrowserRouter>
                    <NavBar isOpen={isNavBarOpen} toggleNavBar={toggleNavBar} />
                    <div className={`App-content ${isNavBarOpen ? 'navbar-open' : 'navbar-closed'}`}>
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/" element={<HomePage />} />
                            <Route path="/home" element={<HomePage />} />
                            <Route path="/schedule" element={<PrivateRoute element={<SchedulePage />} />} />
                            <Route path="/subjectInfo" element={<SubjectInfoPage />} />
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/oauth/redirected/kakao" element={<HomePage />} />
                            <Route path="/oauth/redirected/naver" element={<HomePage />} />
                            <Route path="/oauth/redirected/google" element={<HomePage />} />
                        </Routes>
                    </div>
                </BrowserRouter>
            </AuthProvider>
        </div>
    );
}

export default App;

