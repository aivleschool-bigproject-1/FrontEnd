import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Internal2.css';

const Internal2 = () => {
    const [users, setUsers] = useState([]);

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
                        <th>이메일</th>
                        <th>닉네임</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index}>
                            <td>{user.email}</td>
                            <td>
                                <Link to={`/dashboard/${user.username}`} className="link-to-dashboard">
                                    {user.username}
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Internal2;
