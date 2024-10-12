// src/main/frontend/src/App.js

import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './App.css';
import HomePage from './pages/home/HomePage';
import SchedulePage from './pages/schedule/schedulePage';
import SubjectPage from "./pages/subject/subjectPage";
import AboutPage from './pages/about/aboutPage';
import LoginPage from './pages/login/loginPage';
import NavBar from './components/NavBar';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import FilePage from "./pages/file/filePage";

function App() {
    // 배포 환경에서 console.log, console.warn 지우기
    if ((process.env.REACT_APP_ENV || "production") === "production") {
        console = window.console || {};
        console.log = function no_console() {};
        console.warn = function no_console() {};
        console.error = function () {};
    }

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
                            <Route path="/file" element={<PrivateRoute element={<FilePage />} />} />
                            <Route path="/subjects" element={<SubjectPage />} />
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

