import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './External2.css'; 
import { FaTrash } from 'react-icons/fa';

const External2 = () => {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://example.com/api/videos'); // 실제 API URL로 변경해야 합니다.
                setVideos(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const deleteVideo = (index) => {
        const newVideos = [...videos];
        newVideos.splice(index, 1);
        setVideos(newVideos);
    };

    return (
        <div className="section-video">
            <table>
                <thead>
                    <tr>
                        <th>시간</th>
                        <th>유형</th>
                        <th>상태</th>
                    </tr>
                </thead>
                <tbody>
                    {videos.map((video, index) => (
                        <tr key={index}>
                            <td>{video.title}</td>
                            <td>{new Date(video.uploadDate).toLocaleDateString()}</td>
                            <td>
                                {video.status === 'active' ? (
                                    <span className="status-active">활성</span>
                                ) : (
                                    <span className="status-inactive">비활성</span>
                                )}
                            </td>
                            <td>
                                <button onClick={() => deleteVideo(index)} className="delete-button">
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default External2;
