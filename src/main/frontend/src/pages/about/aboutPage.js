// src/main/frontend/src/pages/about/aboutPage.js

import './aboutPage.css'

import React from 'react';

function AboutPage() {
    return (
        <div className="about-page">
            <h1>개발자 소개</h1>
            <p>
                <b>이름 </b>
                | 정영신<br/>
                <b>소속 </b>
                | 아주대학교 전자공학과 23학번 2학년 <br/>
                <b>E-mail </b>
                | kyn008116@gmail.com <br/>
                <b>instagram </b>
                | zerogod.ai.dev<br/></p>
            <p>이 사이트는 단순히 "이런 기능이 있으면 좋겠다." 라고 생각한 기능들을 만들어둔 사이트입니다. </p>
        </div>
    );
}

export default AboutPage;
