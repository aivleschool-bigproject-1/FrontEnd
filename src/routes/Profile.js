import React from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
    return (
        <div className="container">
            <div className="profile-container">
                <h1>회원정보 수정</h1>
                <div className="link">
                    <Link to="/password-reset" className="password-reset-link">비밀번호 수정</Link>
                    <Link to="/delete" className="account-deletion-link">회원탈퇴</Link>
                </div>
            </div>
        </div>
    );
};

export default Profile;
