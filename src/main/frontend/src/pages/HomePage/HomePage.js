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

    const [notices, setNotices] = useState({
        general: [],
        scholarship: [],
        department: []
    });

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        const oauthProvider = location.pathname.split('/').pop();

        if (code) {
            handleOAuthLogin(oauthProvider, code).then(() => {
                // handleOAuthLogin 성공 후 추가 작업이 필요하다면 여기에 작성
            }).catch((error) => {
                console.error('Error during OAuth login:', error);
            });
        }
    }, [location]);

    useEffect(() => {
        fetchAllNotices().then(() => {
            // fetchAllNotices 성공 후 추가 작업이 필요하다면 여기에 작성
        }).catch((error) => {
            console.error('Error fetching notices:', error);
        });
    }, []);


    const handleOAuthLogin = async (oauthProvider, code) => {
        try {
            await axios.get(`${serverUrl}/oauth/login/${oauthProvider}?code=${code}`);
            await fetchUserInfo();
            console.log(userInfo?.nickname); // fetchUserInfo 후에 userInfo 사용
            alert(`로그인 성공`);
            navigate("/home", { replace: true });
        } catch (error) {
            console.error("로그인 또는 사용자 정보 조회 중 오류 발생:", error);
            alert("로그인 실패");
            navigate("/fail", { replace: true });
        }
    };

    const fetchAllNotices = async () => {
        try {
            const [general, scholarship, department] = await Promise.all([
                fetchNotices('general-notices'),
                fetchNotices('scholarship-notices'),
                fetchNotices('department-notices')
            ]);

            setNotices({
                general,
                scholarship,
                department
            });

            console.log("모든 공지사항 데이터를 성공적으로 가져왔습니다.");
        } catch (error) {
            console.error("공지사항 조회 중 오류 발생:", error);
        }
    };

    const fetchNotices = async (endpoint) => {
        const response = await axios.get(`${serverUrl}/api/${endpoint}`);
        return response.data;
    };

    return (
        <div className="home-page">
            <NoticeTable title="일반공지" notices={notices.general} />
            <NoticeTable title="장학공지" notices={notices.scholarship} />
            <NoticeTable title="전자공학과 공지" notices={notices.department} />
        </div>
    );
}

export default HomePage;