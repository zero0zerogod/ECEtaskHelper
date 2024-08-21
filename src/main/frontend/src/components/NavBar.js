// src/main/frontend/components/NavBar.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './NavBar.css';
import {FaHome, FaCalendarAlt, FaBook, FaInfoCircle, FaUser, FaFileAlt} from 'react-icons/fa';
import { RiLogoutBoxRLine } from "react-icons/ri";
import { GiHamburgerMenu } from "react-icons/gi";

function NavBar({ isOpen, toggleNavBar }) {
    const { userInfo, logout } = useAuth();
    const [isFullyOpen, setIsFullyOpen] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setIsFullyOpen(true), 300); // NavBar가 열린 후 0.3초 후에 `opened` 클래스 추가
        } else {
            setIsFullyOpen(false); // 닫힐 때 즉시 `opened` 클래스 제거
        }
    }, [isOpen]);

    return (
        <nav className={`navbar ${isOpen ? 'open' : 'closed'} ${isFullyOpen ? 'opened' : ''}`}>
            <div className="navbar-header">
                <GiHamburgerMenu className="hamburger-icon" onClick={toggleNavBar} />
            </div>
            <ul className="navbar-list">
                <li className="navbar-item">
                    {userInfo ? (
                        <span className="navbar-link">
                            <FaUser className="navbar-icon" />
                            <span className="navbar-text">{userInfo.nickname} 님</span>
                        </span>
                    ) : (
                        <Link to="/login" className="navbar-link">
                            <FaUser className="navbar-icon" />
                            <span className="navbar-text">로그인</span>
                        </Link>
                    )}
                </li>
                <li className="navbar-item">
                    <Link to="/home" className="navbar-link">
                        <FaHome className="navbar-icon" />
                        <span className="navbar-text">홈</span>
                    </Link>
                </li>
                <li className="navbar-item">
                    <Link to="/schedule" className="navbar-link">
                        <FaCalendarAlt className="navbar-icon" />
                        <span className="navbar-text">시간표</span>
                    </Link>
                </li>
                <li className="navbar-item">
                    <Link to="/file" className="navbar-link">
                        <FaFileAlt className="navbar-icon" />
                        <span className="navbar-text">파일</span>
                    </Link>
                </li>
                <li className="navbar-item">
                    <Link to="/subjects" className="navbar-link">
                        <FaBook className="navbar-icon" />
                        <span className="navbar-text">개설과목정보</span>
                    </Link>
                </li>
                <li className="navbar-item">
                    <Link to="/about" className="navbar-link">
                        <FaInfoCircle className="navbar-icon" />
                        <span className="navbar-text">About</span>
                    </Link>
                </li>
                <li className="navbar-item">
                    <span className="navbar-link" onClick={logout}>
                        <RiLogoutBoxRLine className="navbar-icon" />
                        <span className="navbar-text">로그아웃</span>
                    </span>
                </li>
            </ul>
        </nav>
    );
}

export default NavBar;
