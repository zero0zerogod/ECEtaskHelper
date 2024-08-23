import React, { useState, useEffect } from 'react';

const FileExplorer = () => {
    const [currentFolderId, setCurrentFolderId] = useState('root'); // Root folder by default
    const [items, setItems] = useState([]);
    const [path, setPath] = useState([]);

    useEffect(() => {
        fetch(`/api/files/list?folderId=${currentFolderId}`)
            .then(response => response.json())
            .then(data => setItems(data))
            .catch(error => console.error('Error fetching files:', error));
    }, [currentFolderId]);

    const handleFolderClick = (folderId, folderName) => {
        setCurrentFolderId(folderId);
        setPath(prev => [...prev, { id: folderId, name: folderName }]);
    };

    const handleBreadcrumbClick = (index) => {
        const newPath = path.slice(0, index + 1);
        setCurrentFolderId(newPath[index].id);
        setPath(newPath);
    };

    return (
        <div>
            <h2>File Explorer</h2>
            <div>
                {path.map((folder, index) => (
                    <span key={folder.id} onClick={() => handleBreadcrumbClick(index)}>
                        {folder.name} /
                    </span>
                ))}
            </div>
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {items.map((item, index) => (
                    <tr key={index}>
                        <td>
                            {item.isFolder ? (
                                <span onDoubleClick={() => handleFolderClick(item.id, item.name)}>
                                        {item.name}
                                    </span>
                            ) : (
                                <a href={item.downloadLink} target="_blank" rel="noopener noreferrer">
                                    {item.name}
                                </a>
                            )}
                        </td>
                        <td>{item.isFolder ? 'Folder' : 'File'}</td>
                        <td>
                            {!item.isFolder && (
                                <a href={item.downloadLink} target="_blank" rel="noopener noreferrer">
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
