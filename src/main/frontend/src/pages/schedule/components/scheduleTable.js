// src/main/frontend/src/pages/schedule/components/scheduleTable.js

import React, { useMemo, useCallback, useEffect } from 'react';
import './ScheduleTable.css';
import { days, generateTimes, parseTime, calculateDuration } from '../utils/timeUtils';
import { useColorManager } from '../utils/colorUtils';

function ScheduleTable({ schedules }) {
    const { getColor, releaseColor } = useColorManager();

    // 사용자가 선택한 스케줄이 변경될 때마다 실행됨
    // 선택되지 않은 과목은 releaseColor를 호출하여 할당된 색상을 반환
    useEffect(() => {
        schedules.forEach(schedule => {
            if (!schedule.selected) {
                releaseColor(schedule.subject.subjectName);
            }
        });
    }, [schedules]);

    /**
     * @description 선택된 과목들만 필터링하여 배열로 반환
     * @param {Array} schedules - 모든 스케줄 데이터
     * @returns {Array} 선택된 과목들의 배열
     */
    const filteredSchedules = useMemo(() => schedules.filter(schedule => schedule.selected), [schedules]);

    /**
     * @description 과목들의 종료 시간을 바탕으로 필요한 시간대를 계산하여 배열로 반환
     * @returns {Array} 시간대 배열
     */
    const getFilteredTimes = useCallback(() => {
        let lastEndTime = "09:00"; // 초기 값으로 09:00 설정

        // 각 과목의 종료 시간을 계산하여 가장 늦은 종료 시간을 찾음
        filteredSchedules.forEach(schedule => {
            const times = schedule.subject.time.split(', '); // 여러 시간대가 있을 경우 분리
            times.forEach(time => {
                const { end } = parseTime(time); // 종료 시간을 파싱
                if (end > lastEndTime) { // 현재 종료 시간보다 늦은 시간일 경우 업데이트
                    lastEndTime = end;
                }
            });
        });

        // 종료 시간을 기준으로 다음 시간대를 계산
        const [lastHour, lastMinute] = lastEndTime.split(':').map(Number); // 종료 시간을 시, 분으로 분리
        let nextHour = lastHour; // 다음 시간의 시(hour)를 초기화
        if (lastMinute > 0) {
            nextHour += 1; // 분이 존재하면 다음 시(hour)로 설정
        }

        const startHour = 9; // 시작 시간은 9시로 고정

        // 시작 시간부터 마지막 시간까지 15분 단위로 시간대를 생성
        return generateTimes(startHour, nextHour - 1);
    }, [filteredSchedules]);

    /**
     * @description getFilteredTimes 함수의 결과를 메모이제이션하여 반환
     * @returns {Array} 필터링된 시간대 배열
     */
    const filteredTimes = useMemo(() => getFilteredTimes(), [getFilteredTimes]);

    /**
     * @description 시간표 테이블을 렌더링하는 함수
     * @returns {JSX.Element} 시간표 테이블 JSX
     */
    const renderScheduleTable = () => {
        const cells = {}; // 각 셀의 위치를 추적하는 객체
        const occupiedCells = {}; // 병합된 셀을 추적하여 중복 병합을 방지

        filteredSchedules.forEach(schedule => {
            const times = schedule.subject.time.split(', '); // 여러 시간대가 있을 경우 분리
            let firstTimeIndex = null; // 병합된 셀의 첫 번째 시간대의 인덱스
            let lastTimeIndex = null; // 병합된 셀의 마지막 시간대의 인덱스
            let dayIndex = null; // 요일의 인덱스
            let duration = 0; // 병합된 셀의 지속 시간 (rowspan)
            let savedDay = ''; // 저장된 요일

            const bgColor = getColor(schedule.subject.subjectName); // 과목별 색상 할당

            times.forEach((time) => {
                const { day, start, end } = parseTime(time); // 시간대 정보를 파싱
                savedDay = day; // 요일 저장
                const dayIndexCurrent = days.indexOf(day) + 1; // 요일의 인덱스 계산 (+1 for header)
                const timeIndex = filteredTimes.indexOf(start) + 1; // 시작 시간의 인덱스 계산 (+1 for header)
                const durationCurrent = calculateDuration(start, end); // 시작 시간과 종료 시간을 바탕으로 지속 시간 계산

                // 셀이 이미 병합된 상태인지 확인하고, 병합된 셀은 건너뜀
                for (let i = 0; i < durationCurrent; i++) {
                    if (occupiedCells[timeIndex + i] && occupiedCells[timeIndex + i][dayIndexCurrent]) {
                        return; // 이미 병합된 셀은 건너뜀
                    }
                }

                if (firstTimeIndex === null) {
                    firstTimeIndex = timeIndex; // 첫 번째 시간대 인덱스 설정
                    lastTimeIndex = timeIndex + durationCurrent - 1; // 마지막 시간대 인덱스 설정
                    duration = durationCurrent; // 병합된 셀의 지속 시간 설정
                    dayIndex = dayIndexCurrent; // 요일 인덱스 설정
                } else {
                    // 연속된 셀이면, rowspan을 늘림
                    if (dayIndex === dayIndexCurrent && timeIndex === lastTimeIndex + 1) {
                        lastTimeIndex += durationCurrent; // 마지막 시간대 인덱스 확장
                        duration += durationCurrent; // 지속 시간 확장
                    } else {
                        // 연속되지 않은 셀의 경우 현재까지 병합된 셀을 설정
                        if (!cells[firstTimeIndex]) cells[firstTimeIndex] = {};
                        cells[firstTimeIndex][dayIndex] = {
                            content: (
                                <div className="schedule-item" key={`${savedDay}-${firstTimeIndex}`} style={{ backgroundColor: bgColor }}>
                                    <div className="subject-name">{schedule.subject.subjectName}</div>
                                    <div className="subject-info">{schedule.subject.professor} <br /> {schedule.subject.location}</div>
                                </div>
                            ),
                            rowspan: duration // 병합된 셀의 rowspan 설정
                        };
                        firstTimeIndex = timeIndex; // 새로운 첫 번째 시간대 인덱스 설정
                        lastTimeIndex = timeIndex + durationCurrent - 1; // 새로운 마지막 시간대 인덱스 설정
                        duration = durationCurrent; // 새로운 지속 시간 설정
                        dayIndex = dayIndexCurrent; // 새로운 요일 인덱스 설정
                    }
                }

                // 병합된 셀의 범위를 추적하여 중복 병합 방지
                for (let i = 0; i < durationCurrent; i++) {
                    if (!occupiedCells[timeIndex + i]) occupiedCells[timeIndex + i] = {};
                    occupiedCells[timeIndex + i][dayIndexCurrent] = true;
                }
            });

            // 마지막 셀 병합 처리
            if (firstTimeIndex !== null) {
                if (!cells[firstTimeIndex]) cells[firstTimeIndex] = {};
                cells[firstTimeIndex][dayIndex] = {
                    content: (
                        <div className="schedule-item" key={`${savedDay}-${firstTimeIndex}`} style={{ backgroundColor: bgColor }}>
                            <div className="subject-name">{schedule.subject.subjectName}</div>
                            <div className="subject-info">{schedule.subject.professor} <br /> {schedule.subject.location}</div>
                        </div>
                    ),
                    rowspan: duration // 병합된 셀의 rowspan 설정
                };
            }
        });

        // 렌더링된 시간표 테이블 반환
        return (
            <table className="schedule-table">
                <thead>
                <tr>
                    <th>시간</th>
                    {days.map(day => (
                        <th key={day}>{day}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {filteredTimes.map((time, rowIndex) => (
                    <tr key={time}>
                        <td>{time}</td>
                        {days.map((day, colIndex) => {
                            const cellData = cells[rowIndex + 1] && cells[rowIndex + 1][colIndex + 1];
                            if (cellData && cellData.rowspan) {
                                return (
                                    <td key={`${day}-${time}`} rowSpan={cellData.rowspan}>
                                        {cellData.content}
                                    </td>
                                );
                            } else if (occupiedCells[rowIndex + 1] && occupiedCells[rowIndex + 1][colIndex + 1]) {
                                return null; // 병합된 셀 위치는 비워둠
                            }
                            return <td key={`${day}-${time}`}></td>;
                        })}
                    </tr>
                ))}
                </tbody>
            </table>
        );
    };

    /**
     * @description 시간 테이블을 렌더링하는 함수
     * @returns {JSX.Element} 시간 테이블 JSX
     */
    const renderTimeTable = () => {
        const convertTimeFormat = (time) => {
            const [hour] = time.split(':').map(Number);
            const formattedHour = hour > 12 ? hour - 12 : hour; // 12시간제로 변환
            return formattedHour.toString(); // 형식을 "9, 10, 11, ..."으로 변환
        };

        // 렌더링된 시간 테이블 반환
        return (
            <table className="time-table">
                <tbody>
                <tr>
                    <th>&nbsp;</th> {/* 첫 번째 셀 - 비워둠 */}
                </tr>
                {filteredTimes.map((time, index) => (
                    <tr key={index}>
                        <td>
                            {time.endsWith(':00') ? convertTimeFormat(time) : '\u00A0'} {/* 정각이면 시간 표시, 아니면 공백 */}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        );
    };

    // 전체 시간표 컴포넌트 반환
    return (
        <div className="schedule-container">
            {renderTimeTable()}
            {renderScheduleTable()}
        </div>
    );
}

export default ScheduleTable;
