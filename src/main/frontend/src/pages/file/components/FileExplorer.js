import React, { useState, useEffect } from 'react';
import './FileExplorer.css';

const FileExplorer = ({ refreshFlag }) => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const refreshFiles = () => {
            // 파일 업로드 후에만 캐시 무효화를 위해 cache-busting 파라미터 추가
            const url = refreshFlag
                ? `/api/files/list?cb=${new Date().getTime()}`
                : '/api/files/list';

            fetch(url, {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                },
            })
                .then(response => response.json())
                .then(data => setItems(data))
                .catch(error => console.error('Error fetching files:', error));
        };

        refreshFiles(); // 파일 목록 로드
    }, [refreshFlag]); // refreshFlag가 변경될 때마다 파일 목록 새로고침

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatSize = (size) => {
        const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
        return size === 0 ? '0 B' : (size / Math.pow(1024, i)).toFixed(2) + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i];
    };

    const getFileExtension = (fileName) => {
        return fileName.split('.').pop();
    };

    return (
        <div className="file-explorer">
            <h2>File Explorer</h2>
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Last Modified</th>
                    <th>Type</th>
                    <th>Size</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {items.map((item, index) => (
                    <tr key={index}>
                        <td>{item.name}</td>
                        <td>{formatDate(item.modifiedTime)}</td>
                        <td>{getFileExtension(item.name)}</td>
                        <td>{formatSize(item.size)}</td>
                        <td>
                            {!item.isFolder && (
                                <a href={item.downloadLink} className="download-button" target="_blank" rel="noopener noreferrer">
                                    Download
                                </a>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default FileExplorer;
