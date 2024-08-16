// src/main/frontend/src/pages/HomePage.js

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './HomePage.css'
import NoticeTable from "./components/NoticeTable";

function HomePage() {
    const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:8080';
    const { userInfo, fetchUserInfo } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // 공지사항 데이터를 저장할 상태 변수 정의
    const [generalNotices, setGeneralNotices] = useState([]);
    const [scholarshipNotices, setScholarshipNotices] = useState([]);
    const [departmentNotices, setDepartmentNotices] = useState([]);

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

    // 컴포넌트가 마운트될 때 공지사항 데이터를 서버로부터 가져오는 함수 호출
    useEffect(() => {
        fetchNotices('general-notices', setGeneralNotices).then(r => {});
        fetchNotices('scholarship-notices', setScholarshipNotices).then(r => {});
        fetchNotices('department-notices', setDepartmentNotices).then(r => {});
    }, []);
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

    const fetchNotices = async (endpoint, setNotices) => {
        try {
            const response = await axios.get(`${serverUrl}/api/${endpoint}`);
            setNotices(response.data);
        } catch (error) {
            console.error(`${endpoint} 조회 중 오류 발생:`, error);
        }
    };

    return (
        <div className="home-page">
            <NoticeTable title="일반공지" notices={generalNotices} />
            <NoticeTable title="장학공지" notices={scholarshipNotices} />
            <NoticeTable title="전자공학과 공지" notices={departmentNotices} />
        </div>
    );
}

export default HomePage;
