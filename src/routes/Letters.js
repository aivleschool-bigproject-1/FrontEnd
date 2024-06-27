import React, { useState } from 'react';
import './Letters.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faFilePdf, faFileImage } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Letters = () => {
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
    };

    const handleAddClick = () => {
        // Logic to process uploaded files and generate resume or personal statement
    };

    return (
        <div className="letters-container">
            <aside className="sidebar">
                <ul>
                    <li><Link to="/letter">이력서 작성</Link></li>
                </ul>
                <ul>
                    <li><Link to="/analysis">이력서 분석</Link></li>
                </ul>
            </aside>
            <main className="main-content">
                <form className="letters-form">
                    <div className="form-group">
                        <label>학력</label>
                        <input type="text" placeholder="업로드한 이미지를 기반으로 작성됩니다." />
                    </div>
                    <div className="form-group">
                        <label>업무 경험</label>
                        <input type="text" />
                    </div>
                    <div className="form-group">
                        <label>활동 내역</label>
                        <input type="text" />
                    </div>
                    <div className="form-group">
                        <label>수상 내역</label>
                        <input type="text" placeholder="업로드한 이미지를 기반으로 작성됩니다." />
                    </div>
                    <div className="form-group">
                        <label>자격증</label>
                        <input type="text" placeholder="업로드한 이미지를 기반으로 작성됩니다." />
                    </div>
                    <div className="form-group">
                        <label>어학</label>
                        <input type="text" placeholder="업로드한 이미지를 기반으로 작성됩니다." />
                    </div>
                </form>
                <div className="uploaded-files">
                    {uploadedFiles.map((file, index) => (
                        <div key={index} className="file-item">
                            <FontAwesomeIcon icon={file.type === 'application/pdf' ? faFilePdf : faFileImage} />
                            <p>{file.name}</p>
                        </div>
                    ))}
                </div>
                <input
                    type="file"
                    accept=".pdf, .png"
                    multiple
                    onChange={handleFileUpload}
                    className="file-input"
                />
                <button className="add-button" onClick={handleAddClick}>
                    <FontAwesomeIcon icon={faUpload} />
                    이력 추가하기
                </button>
                <div className="spacing"></div>
            </main>
        </div>
    );
};

export default Letters;
