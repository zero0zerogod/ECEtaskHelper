// src/main/frontend/src/components/PrivateRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ element }) => {
    const { userInfo } = useAuth();

    if (!userInfo) {
        alert('로그인이 필요한 서비스입니다');
        return <Navigate to="/login" replace />;
    }

    return element;
};

export default PrivateRoute;
