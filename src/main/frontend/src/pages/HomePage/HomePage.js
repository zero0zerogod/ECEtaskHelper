// src/main/frontend/src/pages/HomePage.js

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './HomePage.css'

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
        fetchGeneralNotices().then(r => {}); // 일반 공지사항 데이터를 가져오는 함수 호출
        fetchScholarshipNotices().then(r => {}); // 장학 공지사항 데이터를 가져오는 함수 호출
        fetchDepartmentNotices().then(r => {}); // 학과 공지사항 데이터를 가져오는 함수 호출
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

    // 일반 공지사항 데이터를 서버에서 가져오는 함수
    const fetchGeneralNotices = async () => {
        try {
            // 서버의 API 엔드포인트에 GET 요청을 보내 공지사항 데이터를 가져옴
            const response = await axios.get(`${serverUrl}/api/general-notices`);
            setGeneralNotices(response.data); // 가져온 데이터를 상태에 저장
        } catch (error) {
            // 데이터 가져오는 중 오류 발생 시 처리
            console.error("공지사항 조회 중 오류 발생:", error);
        }
    };

    // 장학 공지사항 데이터를 서버에서 가져오는 함수
    const fetchScholarshipNotices = async () => {
        try {
            // 서버의 API 엔드포인트에 GET 요청을 보내 공지사항 데이터를 가져옴
            const response = await axios.get(`${serverUrl}/api/scholarship-notices`);
            setScholarshipNotices(response.data); // 가져온 데이터를 상태에 저장
        } catch (error) {
            // 데이터 가져오는 중 오류 발생 시 처리
            console.error("공지사항 조회 중 오류 발생:", error);
        }
    };

    // 학과 공지사항 데이터를 서버에서 가져오는 함수
    const fetchDepartmentNotices = async () => {
        try {
            // 서버의 API 엔드포인트에 GET 요청을 보내 공지사항 데이터를 가져옴
            const response = await axios.get(`${serverUrl}/api/department-notices`);
            setDepartmentNotices(response.data); // 가져온 데이터를 상태에 저장
        } catch (error) {
            // 데이터 가져오는 중 오류 발생 시 처리
            console.error("공지사항 조회 중 오류 발생:", error);
        }
    };

    return (
        <div className="home-page">
            <div className="table-name">
                일반공지
            </div>
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
                {/* notices 배열을 순회하여 각 공지사항을 테이블 행으로 렌더링 */}
                {generalNotices.map((notice, index) => (
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
            <div className="table-name">
                장학공지
            </div>
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
                {scholarshipNotices.map((notice, index) => (
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
            <div className="table-name">
                전자공학과 공지
            </div>
            <table className="notice-table">
                <thead>
                <tr>
                    <th>분류</th>
                    <th>제목</th>
                    <th>공지부서</th>
                    <th>공지마감일</th>
                </tr>
                </thead>
                <tbody>
                {departmentNotices.map((notice, index) => (
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
