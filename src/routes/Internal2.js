import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Internal2.css'; 

const Internal2 = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://example.com/api/users'); // 실제 API URL로 변경해야 합니다.
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="section-user">
            <table>
                <thead>
                    <tr>
                        <th>사원명</th>
                        <th>집중도</th>
                        <th>차트</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index}>
                            <td>{user.name} <br /><small>{user.location}</small></td>
                            <td>{user.focus}</td>
                            <td>
                                {user.chart === 'up' ? (
                                    <span className="chart-up">⬆</span>
                                ) : (
                                    <span className="chart-down">⬇</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Internal2;
