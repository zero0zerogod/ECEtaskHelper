import React, { useState } from 'react';

const FileUploader = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!file) {
            setUploadStatus('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/files/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setUploadStatus('File uploaded successfully!');
                setFile(null); // Clear the selected file
                onUploadSuccess(); // 파일 업로드 성공 후 캐시 무효화 및 파일 목록 새로고침
            } else {
                setUploadStatus('File upload failed. Please try again.');
            }
        } catch (error) {
            setUploadStatus('Error uploading file. Please try again.');
        }
    };

    return (
        <div>
            <h2>Upload a File</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleFileUpload}>Upload</button>
            {uploadStatus && <p>{uploadStatus}</p>}
        </div>
    );
};

export default FileUploader;
