// src/main/frontend/src/pages/home/components/noticeTable.js

import React, {useState} from 'react';
import './noticeTable.css';

function NoticeTable({title, notices}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const dateColumnTitle = title.includes("학과") ? "공지 마감일" : "작성일";

    const displayedNotices = isExpanded ? notices : notices.slice(0, 5);
    const shouldShowToggle = notices.length > 5;

    // 현재 날짜 가져오기
    const currentDate = new Date();

    // 3일 전 날짜 계산
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(currentDate.getDate() - 3);

    // 최근 10개의 공지 중에서 3일 이내 공지가 있는지 확인
    const recentNotices = notices.slice(0, 10).filter(notice => {
        const noticeDate = new Date(notice.date);
        return noticeDate >= oneWeekAgo && noticeDate <= currentDate;
    });
    const hasRecentNotice = recentNotices.length > 0;

    // 각 열의 너비를 지정하는 스타일 객체
    const columnStyles = {
        number: {width: '5%'},
        category: {width: '10%'},
        title: {width: '55%'},
        department: {width: '15%'},
        date: {width: '8%'},
        state: {width: '7%'},
    };

    return (
        <div className="notice-table-container">
            <div className="table-name">{title} </div>
            {hasRecentNotice && <span className="new-badge" style={{
                animation: 'blink 1s infinite alternate',
                color: '#ff0000',
                fontWeight: 'bold',
                fontSize: '0.9em',
                backgroundColor: '#ffffe0',
                padding: '2px 6px',
                borderRadius: '4px',
                boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)'
            }}>new</span>}
            <table className="notice-table">
                <thead>
                <tr>
                    <th style={columnStyles.number}>번호</th>
                    <th style={columnStyles.category}>분류</th>
                    <th style={columnStyles.title}>제목</th>
                    <th style={columnStyles.department}>공지부서</th>
                    <th style={columnStyles.date}>{dateColumnTitle}</th>
                    <th style={columnStyles.state}></th>
                </tr>
                </thead>
                <tbody>
                {displayedNotices.map((notice, index) => (
                    <tr key={index}>
                        <td style={columnStyles.number}>
                            {notice.number === "공지" ? (
                                <span style={
                                    {
                                        color: 'white',
                                        fontWeight: 'bold',
                                        backgroundColor: '#007bff',
                                        padding: '3px 5px',
                                        borderRadius: '4px'
                                    }}>
                                        {notice.number}
                                    </span>
                            ) : (
                                notice.number
                            )}
                        </td>
                        <td style={columnStyles.category}>{notice.category}</td>
                        <td style={columnStyles.title} className="notice-title">
                            <a href={notice.link} target="_blank" rel="noopener noreferrer">
                                {notice.title}
                            </a>
                        </td>
                        <td style={columnStyles.department}>{notice.department}</td>
                        <td style={columnStyles.date}>{notice.date}</td>
                        {index === 4 && shouldShowToggle ? (
                            <td className="toggle-button-cell" style={columnStyles.state}>
                                <button
                                    className="toggle-button"
                                    onClick={() => setIsExpanded(!isExpanded)}
                                >
                                    {isExpanded ? '접기 ▲' : '펼치기 ▼'}
                                </button>
                            </td>
                        ) : (
                            <td></td> // 나머지 행에서는 빈 셀로 유지
                        )}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default NoticeTable;
