import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SubjectInfoPage.css'; // CSS 파일을 import

function SubjectInfoPage() {
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        axios.get('/api/subjects')
            .then(response => {
                setSubjects(response.data);
            })
            .catch(error => console.log(error));
    }, []);

    return (
        <div className="subjectInfo-page">
            <h1>개설과목정보</h1>
            <table className="subjectInfo-table">
                <thead>
                <tr>
                    <th>수강번호</th>
                    <th>과목명</th>
                    <th>교수명</th>
                    <th>강의시간</th>
                    <th>강의실</th>
                </tr>
                </thead>
                <tbody>
                {subjects.map(subject => (
                    <tr key={subject.subjectId}>
                        <td>{subject.subjectId}</td>
                        <td>{subject.subjectName}</td>
                        <td>{subject.professor}</td>
                        <td>{subject.time}</td>
                        <td>{subject.location}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default SubjectInfoPage;
