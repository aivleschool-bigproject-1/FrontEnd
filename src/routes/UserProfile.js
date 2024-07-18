import React from 'react';
import './UserProfile.css';

const UserProfile = ({ data }) => (
    <div className="user-profile-container">
        <div className="profile-header">
            <div className="user-details">
                <h2 className="user-name">Karina</h2>
                <p className="user-info">Sectoin7 worker - Austin, TX</p>
            </div>
        </div>
    </div>
);

export default UserProfile;
