// src/main/frontend/src/pages/file/filePage.js

import React from 'react';
import FileUploader from './components/FileUploader';
import FileExplorer from './components/FileExplorer';

const FilePage = () => {
    return (
        <div>
            <h1>File Management</h1>
            <FileUploader />
            <FileExplorer />
        </div>
    );
};

export default FilePage;
