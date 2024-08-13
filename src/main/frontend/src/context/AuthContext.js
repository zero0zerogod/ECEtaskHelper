// src/main/frontend/src/context/AuthContext.js

import React, {createContext, useContext, useEffect, useState} from 'react';
import axios from 'axios';

const AuthContext = createContext(undefined);

export const AuthProvider = ({children}) => {
    // 환경 변수에서 서버 URL을 가져옴
    const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:8080';

    const [userInfo, setUserInfo] = useState(null);

    // 새로고침 없이 바로 로그인 정보 반영하기 위해 추가
    useEffect(() => {
        fetchUserInfo().then(() => {}); // 페이지 로드 시 사용자 정보 가져오기
    }, []);

    // 사용자 정보를 가져오는 함수
    const fetchUserInfo = async () => {
        try {
            const response = await axios.get(`${serverUrl}/oauth/user-info`);
            setUserInfo(response.data);
            console.log("UserInfo updated: ", response.data); // 디버깅 로그 추가
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // 401 에러일 경우 로그아웃 상태로 처리
                console.log("사용자가 로그인되어 있지 않습니다.");
            } else {
                console.error("사용자 정보 조회 중 오류 발생:", error);
            }
            setUserInfo(null); // 로그아웃 상태로 설정
        }
    };

    const logout = async () => {
        try {
            await axios.get(`${serverUrl}/oauth/logout`);
            setUserInfo(null);
            alert("로그아웃되었습니다.");
        } catch (error) {
            console.error('로그아웃 중 오류 발생:', error);
        }
    };

    return (
        <AuthContext.Provider value={{userInfo, fetchUserInfo, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
