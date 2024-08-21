// src/main/frontend/src/pages/schedule/utils/scheduleHandlers.js

import { searchSubjects, getUserSchedule, addSubjectToSchedule, updateSelectedStatus, deleteSubjectFromSchedule } from './scheduleAPI';
import {parseTime} from "./timeUtils";

const updateSchedules = async (setSelectedSchedules) => {
    try {
        const data = await getUserSchedule();
        setSelectedSchedules(data);
    } catch (error) {
        console.error("Error fetching updated schedules:", error);
        alert("시간표를 갱신하는 중 오류가 발생했습니다.");
    }
};

/**
 * 과목 검색을 처리하는 함수
 * @param {string} searchTerm - 검색할 과목명
 * @param {function} setSubjects - 검색된 과목 리스트를 업데이트하는 상태 설정 함수
 */
export const handleSearch = async (searchTerm, setSubjects) => {
    try {
        const data = await searchSubjects(searchTerm);
        setSubjects(data || []); // 검색 결과가 없으면 빈 배열로 설정
    } catch (error) {
        console.error("Error searching subjects:", error);
        setSubjects([]); // 에러 발생 시 빈 배열로 상태 업데이트
    }
};

/**
 * 검색어 입력 시 상태를 업데이트하는 함수
 * @param {object} event - 입력 이벤트 객체
 * @param {function} setSearchTerm - 검색어 상태를 업데이트하는 함수
 */
export const handleInputChange = (event, setSearchTerm) => {
    setSearchTerm(event.target.value);
};

/**
 * 사용자가 과목을 선택할 때 호출되는 함수
 * @param {object} subject - 선택된 과목 객체
 * @param {array} selectedSchedules - 사용자가 이미 선택한 과목 리스트
 * @param {function} setSelectedSchedules - 선택된 과목 리스트를 업데이트하는 상태 설정 함수
 */
export const handleSelectSubject = async (subject, selectedSchedules, setSelectedSchedules) => {
    const selectedSubjectIds = new Set(selectedSchedules.map(schedule => schedule.subject.subjectId));

    if (selectedSubjectIds.has(subject.subjectId)) {
        alert("이미 담은 과목입니다");
        return;
    }

    try {
        const message = await addSubjectToSchedule(subject.subjectId);
        alert(message);
        await updateSchedules(setSelectedSchedules);
    } catch (error) {
        console.error("Error adding subject to schedule:", error);
        alert("과목을 추가하는 중 오류가 발생했습니다.");
    }
};

/**
 * 주어진 시간표가 이미 선택된 시간표들과 시간대가 겹치는지 확인하는 함수
 * @param {object} scheduleToCheck - 확인할 시간표 객체
 * @param {Array} selectedSchedules - 이미 선택된 시간표들의 배열
 * @returns {boolean} - 시간대가 겹치면 true, 그렇지 않으면 false
 */
const isTimeOverlapping = (scheduleToCheck, selectedSchedules) => {
    // 확인할 시간표의 시간대 배열을 생성 (요일, 시작 시간, 종료 시간을 포함)
    const scheduleTimesToCheck = scheduleToCheck.subject.time.split(', ').map(parseTime);

    // 선택된 시간표들 중 하나라도 겹치는 시간이 있는지 확인
    return selectedSchedules.some(selectedSchedule => {
        // 이미 선택된 시간표의 시간대 배열을 생성 (요일, 시작 시간, 종료 시간을 포함)
        const selectedScheduleTimes = selectedSchedule.subject.time.split(', ').map(parseTime);

        // 각 시간대의 요일과 시간이 겹치는지 확인
        return scheduleTimesToCheck.some(({ day: day1, start: startTime1, end: endTime1 }) => {
            return selectedScheduleTimes.some(({ day: day2, start: startTime2, end: endTime2 }) => {
                // 같은 요일(day1 === day2)에 있고, 시간대가 겹치면 true를 반환
                return day1 === day2 &&
                    !(endTime1 <= startTime2 || startTime1 >= endTime2);
            });
        });
    });
};

/**
 * 체크박스 변경 시 호출되는 함수
 * 그룹 내에서 하나의 과목만 선택할 수 있도록 제한함
 * @param {number} scheduleId - 변경할 시간표 항목의 ID
 * @param {boolean} selected - 체크박스 선택 여부
 * @param {function} setSelectedSchedules - 선택된 과목 리스트를 업데이트하는 상태 설정 함수
 * @param {object} groupedSubjects - 과목들을 그룹으로 묶은 객체
 * @param {string} groupName - 현재 그룹의 이름
 */
export const handleCheckboxChange = async (scheduleId, selected, setSelectedSchedules, groupedSubjects, groupName) => {
    if (!groupedSubjects || !groupName) {
        console.error("Invalid parameters for handleCheckboxChange");
        return;
    }

    // 이미 선택된 과목인지 확인
    if (groupedSubjects[groupName].some(schedule => schedule.selected) && selected) {
        alert("이미 추가한 과목입니다");
        return;
    }

    // 시간대 겹침 확인
    const scheduleToCheck = groupedSubjects[groupName].find(schedule => schedule.id === scheduleId);
    const selectedSchedules = Object.values(groupedSubjects).flat().filter(schedule => schedule.selected);

    const overlappingSchedule = selectedSchedules.find(selectedSchedule => isTimeOverlapping(scheduleToCheck, [selectedSchedule]));

    if (selected && overlappingSchedule) {
        alert(`${overlappingSchedule.subject.subjectName}와 시간이 겹칩니다.`);
        return;
    }

    try {
        await updateSelectedStatus(scheduleId, selected);
        setSelectedSchedules(prevSchedules =>
            prevSchedules.map(schedule =>
                schedule.id === scheduleId ? { ...schedule, selected } : schedule
            )
        );
    } catch (error) {
        console.error("Error updating subject selection:", error);
        alert("선택 상태를 업데이트하는 중 오류가 발생했습니다.");
    }
};

/**
 * 사용자가 과목을 삭제할 때 호출되는 함수
 * @param {number} scheduleId - 삭제할 시간표 항목의 ID
 * @param {function} setSelectedSchedules - 선택된 과목 리스트를 업데이트하는 상태 설정 함수
 */
export const handleDeleteSubject = async (scheduleId, setSelectedSchedules) => {
    try {
        await deleteSubjectFromSchedule(scheduleId);
        setSelectedSchedules(prevSchedules => {
            const updatedSchedules = prevSchedules.filter(schedule => schedule.id !== scheduleId);
            alert("삭제 완료");
            return updatedSchedules;
        });
    } catch (error) {
        console.error("Error deleting subject from schedule:", error);
        alert("과목을 삭제하는 중 오류가 발생했습니다.");
    }
};
