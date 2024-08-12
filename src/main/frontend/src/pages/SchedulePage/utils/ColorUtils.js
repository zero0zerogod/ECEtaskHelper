// src/main/frontend/src/SchedulePage/utils/ColorUtils.js
import { useState } from 'react';

// 색상 팔레트 정의: 일정표에서 과목을 구분하기 위한 색상 목록
const colorPalette = [
    '#58ACFA',
    '#58FAD0',
    '#FA5858',
    '#FACC2E',
    '#AC58FA',
    '#A9D0F5',
];

/**
 * useColorManager 훅: 과목별로 고유한 색상을 관리하는 훅
 * @returns {Object} getColor와 releaseColor 함수를 반환
 */
export const useColorManager = () => {
    // 사용된 색상 목록을 관리하는 상태
    const [usedColors, setUsedColors] = useState([]);
    // 과목 이름과 할당된 색상 매핑을 관리하는 상태
    const [colorMap, setColorMap] = useState({});

    /**
     * getColor: 과목 이름에 따라 색상을 반환하는 함수
     * @param {string} subjectName - 색상을 할당할 과목 이름
     * @returns {string} 할당된 색상
     */
    const getColor = (subjectName) => {
        // 이미 과목에 색상이 할당되어 있다면 반환
        if (colorMap[subjectName]) {
            return colorMap[subjectName];
        }

        // 사용되지 않은 색상 찾기
        const availableColor = colorPalette.find(color => !usedColors.includes(color));
        if (!availableColor) {
            // 모든 색상이 사용 중인 경우, 순환적으로 다시 사용
            const nextColor = colorPalette[usedColors.length % colorPalette.length];
            setUsedColors([...usedColors, nextColor]);
            setColorMap({ ...colorMap, [subjectName]: nextColor });
            return nextColor;
        }

        // 사용 가능한 색상 할당
        setUsedColors([...usedColors, availableColor]);
        setColorMap({ ...colorMap, [subjectName]: availableColor });

        return availableColor;
    };

    /**
     * releaseColor: 과목이 삭제될 때 색상을 반환하는 함수
     * @param {string} subjectName - 색상을 반환할 과목 이름
     */
    const releaseColor = (subjectName) => {
        const color = colorMap[subjectName];
        if (!color) return;

        // 사용된 색상 목록에서 제거
        setUsedColors(usedColors.filter(c => c !== color));
        const newColorMap = { ...colorMap };
        delete newColorMap[subjectName];
        setColorMap(newColorMap);
    };

    return { getColor, releaseColor };
};
