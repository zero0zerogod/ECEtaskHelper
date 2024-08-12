// src/main/frontend/src/pages/LoginPage.js

import React from 'react';
import './LoginPage.css'; // CSS 파일 import
import { RiKakaoTalkFill } from 'react-icons/ri';
import {SiNaver} from "react-icons/si";
import {FcGoogle} from "react-icons/fc";
import {FaUnlockAlt} from "react-icons/fa";


const LoginPage = () => {
    // 환경 변수에서 서버 URL을 가져옴
    const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:8080';

    const handleOAuthLogin = async (provider) => {
        try {
            // OAuth 인증 URL을 호출하여 사용자에게 인증을 요청
            // OAuth 인증 URL을 환경 변수에서 가져온 서버 URL로 구성
            window.location.href = `${serverUrl}/oauth/${provider}`;
        } catch (error) {
            console.error("로그인 요청 중 오류 발생:", error);
            alert("로그인 요청 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <FaUnlockAlt className="user-icon"/>
                    <p>소셜 계정으로 로그인</p>
                </div>
                <button
                    className="login-button kakao"
                    onClick={() => handleOAuthLogin('kakao').then(r => {
                    })}
                >
                    <RiKakaoTalkFill className="login-icon"/>
                    <span className="login-text">카카오 계정으로 로그인</span>
                </button>
                <button
                    className="login-button naver"
                    onClick={() => handleOAuthLogin('naver')}
                >
                    <SiNaver className="login-icon"/>
                    <span className="login-text">네이버 계정으로 로그인</span>
                </button>
                <button
                    className="login-button google"
                    onClick={() => handleOAuthLogin('google')}
                >
                    <FcGoogle className="login-icon"/>
                    <span className="login-text">구글 계정으로 로그인</span>
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
