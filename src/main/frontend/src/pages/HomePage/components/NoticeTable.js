// src/main/frontend/src/pages/HomePage/components/NoticeTable.js

function NoticeTable({ title, notices }) {
    return (
        <>
            <div className="table-name">{title}</div>
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
        </>
    );
}

export default NoticeTable