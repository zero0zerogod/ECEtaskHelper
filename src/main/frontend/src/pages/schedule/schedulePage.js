// src/main/frontend/src/pages/schedule/schedulePage.js
import React, {useEffect, useState} from 'react';
import './schedulePage.css'; // CSS 파일을 import
import {useAuth} from '../../context/AuthContext';
import {
    handleCheckboxChange,
    handleDeleteSubject,
    handleInputChange,
    handleSearch,
    handleSelectSubject
} from './utils/scheduleHandlers'; // 핸들러 import
import {getUserSchedule} from './utils/scheduleAPI';
import ScheduleTable from "./components/scheduleTable";

function SchedulePage() {
    const {userInfo} = useAuth();
    const [subjects, setSubjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSchedules, setSelectedSchedules] = useState([]);

    useEffect(() => { // 로그인된 계정의 담은 과목 불러오기
        if (userInfo) {
            getUserSchedule()
                .then(data => setSelectedSchedules(data))
                .catch(error => console.log(error));
        }
    }, [userInfo]);

    // 과목명 기준으로 선택된 과목들을 그룹화
    const groupedSubjects = selectedSchedules.reduce((groups, schedule) => {
        const {subjectName} = schedule.subject;
        if (!groups[subjectName]) {
            groups[subjectName] = [];
        }
        groups[subjectName].push(schedule);
        return groups;
    }, {});

    return (
        <div className="schedule-page">
            <div className="page-layout">
                <div className="left-section">
                    <input
                        type="text"
                        id="searchSubject"
                        name="searchSubject"
                        placeholder="과목명을 검색하세요"
                        value={searchTerm}
                        onChange={(event) => handleInputChange(event, setSearchTerm)}
                        style={{
                            width: '40%',
                            fontSize: '12px',
                            verticalAlign: 'middle',
                            outline: 'none'
                        }}
                    />
                    <button onClick={() => handleSearch(searchTerm, setSubjects)} style={{width: '45px', verticalAlign: 'middle', outline: 'none'}}>검색</button>
                    {/* 검색 버튼 추가 */}
                    <div className="subjects-table-container">
                        <table className="subjects-table">
                            <thead>
                            <tr>
                                <th>수강번호</th>
                                <th>과목명</th>
                                <th>교수명</th>
                                <th>강의시간</th>
                                <th>강의실</th>
                                <th>담기</th>
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
                                    <td>
                                        <button
                                            onClick={() => handleSelectSubject(subject, selectedSchedules, setSelectedSchedules)}>담기
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    {Object.keys(groupedSubjects).length > 0 && (
                        <div className="selected-subjects-container">
                            {Object.entries(groupedSubjects).map(([subjectName, schedules]) => (
                                <div key={subjectName} className="subject-group">
                                    <table className="selected-subjects-table">
                                        <thead>
                                        <tr>
                                            <th colSpan="5">{subjectName}</th>
                                        </tr>
                                        <tr>
                                            <th>수강번호</th>
                                            <th>교수명</th>
                                            <th>강의시간</th>
                                            <th>강의실</th>
                                            <th>추가/삭제</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {schedules.map(schedule => (
                                            <tr key={schedule.id}>
                                                <td>{schedule.subject.subjectId}</td>
                                                <td>{schedule.subject.professor}</td>
                                                <td>{schedule.subject.time}</td>
                                                <td>{schedule.subject.location}</td>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        id={`scheduleCheckbox-${schedule.id}`}
                                                        name={`scheduleCheckbox-${schedule.id}`}
                                                        checked={schedule.selected}
                                                        onChange={(e) => handleCheckboxChange(schedule.id, e.target.checked, setSelectedSchedules, groupedSubjects, subjectName)}
                                                    />
                                                    <button
                                                        onClick={() => handleDeleteSubject(schedule.id, setSelectedSchedules)}>삭제
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="right-section">
                    <ScheduleTable schedules={selectedSchedules}/> {/* 시간표 컴포넌트를 추가 */}
                </div>
            </div>
        </div>
    );
}

export default SchedulePage;