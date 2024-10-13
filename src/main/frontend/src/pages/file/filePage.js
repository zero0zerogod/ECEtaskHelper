import React, { useState } from 'react';
import FileUploader from "./components/FileUploader";
import FileExplorer from "./components/FileExplorer";


const FilePage = () => {
    const [refreshFlag, setRefreshFlag] = useState(false);

    const handleUploadSuccess = () => {
        // 파일 업로드가 성공적으로 완료되면 refreshFlag를 토글하여 상태를 갱신합니다.
        setRefreshFlag(!refreshFlag);
    };

    return (
        <div>
            <h1>File Management</h1>
            <FileUploader onUploadSuccess={handleUploadSuccess} />
            <FileExplorer refreshFlag={refreshFlag} />
        </div>
    );
};

export default FilePage;
