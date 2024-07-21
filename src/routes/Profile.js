import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';
import StarRating from '../components/Rating';

const Profile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('Authorization');
            try {
                const response = await axios.get('/user', {
                    headers: {
                        'Authorization': `${token}`
                    }
                });
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUser();
    }, []);

    return (
        <div className="container">
            <div className="profile-container">
                <h1>회원정보</h1>
                {user ? (
                    <div className="profile-info">
                        <p><strong>아이디:</strong> {user.username}</p>
                        <p><strong>이름:</strong> {user.name}</p>
                        <p><strong>이메일:</strong> {user.email}</p>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
                <div className="link">
                    <Link to="/password-reset" className="password-reset-link">비밀번호 수정</Link>
                    <Link to="/delete" className="account-deletion-link">회원탈퇴</Link>
                </div>
            </div>
        </div>
    );
};

export default Profile;
