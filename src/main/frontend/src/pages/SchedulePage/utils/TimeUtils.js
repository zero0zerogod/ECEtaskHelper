// src/main/frontend/src/pages/SchedulePage/utils/TimeUtils.js

// 요일 배열을 정의
export const days = ['월', '화', '수', '목', '금'];

/**
 * 시작 시간과 종료 시간 사이의 모든 시간을 15분 단위로 생성하여 반환.
 * @param {number} startHour - 시작 시간 (시간 단위)
 * @param {number} endHour - 종료 시간 (시간 단위)
 * @returns {Array<string>} - 15분 단위로 생성된 시간 문자열 배열
 */
export const generateTimes = (startHour, endHour) => {
    const times = [];
    for (let hour = startHour; hour <= endHour; hour++) {
        times.push(`${hour.toString().padStart(2, '0')}:00`); // 정각 시간 추가
        times.push(`${hour.toString().padStart(2, '0')}:15`); // 15분 추가
        times.push(`${hour.toString().padStart(2, '0')}:30`); // 30분 추가
        times.push(`${hour.toString().padStart(2, '0')}:45`); // 45분 추가
    }
    return times;
};

/**
 * 주어진 시간 문자열을 요일과 시간 범위로 파싱.
 * @param {string} timeString - 요일과 시간 범위를 나타내는 문자열 (예: '월A', '목B', '금7' 등)
 * @returns {Object} - 요일, 시작 시간, 종료 시간을 포함하는 객체
 */
export const parseTime = (timeString) => {
    const day = timeString.charAt(0); // 첫 글자는 요일을 나타냄
    const period = timeString.slice(1); // 나머지는 시간대를 나타냄
    const isAlphabetic = isNaN(period); // 알파벳 시간대인지 여부를 판별

    if (isAlphabetic) {
        const startTimes = { 'A': '09:00', 'B': '10:30', 'C': '12:00', 'D': '13:30', 'E': '15:00', 'F': '16:30', 'G': '18:00', 'H': '19:30', 'I': '21:00', 'J': '22:30' };
        const endTimes = { 'A': '10:15', 'B': '11:45', 'C': '13:15', 'D': '14:45', 'E': '16:15', 'F': '17:45', 'G': '19:15', 'H': '20:45', 'I': '22:15', 'J': '23:45' };
        return { day, start: startTimes[period], end: endTimes[period] }; // 알파벳 시간대에 따른 시작과 종료 시간 반환
    } else {
        const periodNumber = parseFloat(period); // 숫자 시간대 처리
        const startHour = 8 + Math.floor(periodNumber); // 시작 시간 계산
        const startMinute = (periodNumber % 1) * 60; // 시작 분 계산
        const startTime = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`; // 시작 시간 문자열 생성

        const endHour = startHour + 1; // 종료 시간은 1시간 뒤
        const endTime = `${endHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`; // 종료 시간 문자열 생성

        return { day, start: startTime, end: endTime }; // 숫자 시간대에 따른 시작과 종료 시간 반환
    }
};

/**
 * 시작 시간과 종료 시간 사이의 기간을 15분 단위로 계산.
 * @param {string} start - 시작 시간 (HH:mm 형식)
 * @param {string} end - 종료 시간 (HH:mm 형식)
 * @returns {number} - 15분 단위로 계산된 기간
 */
export const calculateDuration = (start, end) => {
    const [startHour, startMinute] = start.split(':').map(Number); // 시작 시간 분리
    const [endHour, endMinute] = end.split(':').map(Number); // 종료 시간 분리
    return ((endHour - startHour) * 60 + (endMinute - startMinute)) / 15; // 15분 단위로 기간 계산
};
