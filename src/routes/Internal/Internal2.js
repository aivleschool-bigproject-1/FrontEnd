import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Internal2.css';

const Internal2 = () => {
    const [users, setUsers] = useState([]);
    
    const navigate = useNavigate();
    const handleRowClick = (username) => {
        navigate(`/internal/dashboard/${username}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('Authorization');
            try {
                const response = await axios.get('/users', {
                    headers: {
                        'Authorization': `${token}`
                    }
                });
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
                        <th>이름</th>
                        <th>이메일</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index} onClick={() => handleRowClick(user.username)} style={{ cursor: 'pointer' }}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Internal2;
