// src/main/frontend/src/pages/HomePage/components/NoticeTable.js

import React, { useState } from 'react';
import './NoticeTable.css';

function NoticeTable({ title, notices }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const dateColumnTitle = title.includes("학과") ? "공지 마감일" : "작성일";

    const displayedNotices = isExpanded ? notices : notices.slice(0, 5);
    const shouldShowToggle = notices.length > 5;

    // 각 열의 너비를 지정하는 스타일 객체
    const columnStyles = {
        number: { width: '5%' },
        category: { width: '10%' },
        title: { width: '55%' },
        department: { width: '15%' },
        date: { width: '8%' },
        state: { width: '7%' },
    };

    return (
        <div className="notice-table-container">
            <div className="table-name">{title}</div>
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
                                    {color: 'white',
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
