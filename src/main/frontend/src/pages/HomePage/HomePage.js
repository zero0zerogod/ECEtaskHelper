// src/main/frontend/src/pages/HomePage.js

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './HomePage.css'

function HomePage() {
    const { userInfo, fetchUserInfo } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // 공지사항 상태 정의
    const [notices, setNotices] = useState([]);

    // 환경 변수에서 서버 URL을 가져옴
    const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:8080';

    console.log("HomePage UserInfo: ", userInfo); // 디버깅 로그 추가

    // OAuth 리디렉션 처리
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        const oauthProvider = location.pathname.split('/').pop(); // URL 경로에서 OAuth 제공자 정보 추출

        if (code) {
            handleOAuthLogin(oauthProvider, code).then(() => {
                fetchUserInfo(); // 로그인 후 사용자 정보 업데이트
            });
        }
    }, [location]);

    useEffect(() => {
        // 공지사항 데이터 가져오기
        fetchNotices().then(r => {});
    });

    const handleOAuthLogin = async (oauthProvider, code) => {
        try {
            const response = await axios.get(`${serverUrl}/oauth/login/${oauthProvider}?code=${code}`);
            navigate("/home", { replace: true }); // URL을 /home으로 변경
            alert("로그인되었습니다.");

        } catch (error) {
            console.error("로그인 또는 사용자 정보 조회 중 오류 발생:", error);
            alert("로그인 실패");
            navigate("/fail", { replace: true });
        }
    };

    // 공지사항 데이터 가져오는 함수
    const fetchNotices = async () => {
        try {
            const response = await axios.get(`${serverUrl}/api/notices`);
            setNotices(response.data);
        } catch (error) {
            console.error("공지사항 조회 중 오류 발생:", error);
        }
    };

    return (
        <div className="home-page">
            <table className="notice-table">
                <thead>
                <tr>
                    <th>분류</th>
                    <th>제목</th>
                    <th>공지부서</th>
                    <th>작성일</th>
                </tr>
                </thead>
                <tbody>
                {notices.map((notice, index) => (
                    <tr key={index}>
                        <td>{notice.category}</td>
                        <td>
                            <a href={notice.link} target="_blank" rel="noopener noreferrer">
                                {notice.title}
                            </a>
                        </td>
                        <td>{notice.department}</td>
                        <td>{notice.date}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default HomePage;
