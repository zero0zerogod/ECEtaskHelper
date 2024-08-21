// src/main/frontend/src/pages/schedule/utils/scheduleAPI.js
import axios from 'axios';

const API_BASE_URL = '/api/schedule';

const handleError = (error, message) => {
    console.error(message, error);
    alert("An error occurred. Please try again later.");
    throw error;
};

/**
 * 검색어를 기반으로 과목을 검색하는 함수
 * @param {string} searchTerm - 검색할 과목명
 * @returns {Promise<Array>} - 검색된 과목들의 배열을 반환
 */
export const searchSubjects = async (searchTerm) => {
    if (!searchTerm) return [];
    try {
        const response = await axios.get(`/api/subjects/search?name=${searchTerm}`);
        return response.data;
    } catch (error) {
        handleError(error, "Error searching subjects");
    }
};

/**
 * 현재 사용자의 시간표를 불러오는 함수
 * @returns {Promise<Array>} - 사용자가 담은 과목들의 배열을 반환
 */
export const getUserSchedule = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/user-schedule`);
        return response.data;
    } catch (error) {
        handleError(error, "Error fetching user schedule");
    }
};

/**
 * 사용자의 시간표에 새로운 과목을 담는 함수
 * @param {string} subjectId - 추가할 과목의 ID
 * @returns {Promise<string>} - 서버로부터의 응답 메시지 반환
 */
export const addSubjectToSchedule = async (subjectId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/add`, { subjectId });
        return response.data;
    } catch (error) {
        handleError(error, "Error adding subject to schedule");
    }
};

/**
 * 특정 과목의 선택 상태를 업데이트하는 함수
 * @param {number} scheduleId - 업데이트할 시간표 항목의 ID
 * @param {boolean} selected - 업데이트할 선택 상태
 */
export const updateSelectedStatus = async (scheduleId, selected) => {
    try {
        await axios.put(`${API_BASE_URL}/update-selected`, { scheduleId: scheduleId.toString(), selected });
    } catch (error) {
        handleError(error, "Error updating subject selection");
    }
};

/**
 * 사용자의 시간표에서 특정 과목을 삭제하는 함수
 * @param {number} scheduleId - 삭제할 시간표 항목의 ID
 */
export const deleteSubjectFromSchedule = async (scheduleId) => {
    try {
        await axios.delete(`${API_BASE_URL}/delete/${scheduleId}`);
    } catch (error) {
        handleError(error, "Error deleting subject from schedule");
    }
};
