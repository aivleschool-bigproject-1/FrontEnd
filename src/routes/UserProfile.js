import React from 'react';
import './UserProfile.css';

const UserProfile = ({ data }) => (
    <div className="profile-container">
        <div className="profile-header">
            <img className="avatar" src="images/profile.png" alt="User Avatar" />
            <div className="user-details">
                <h2 className="user-name">Bessie Cooper</h2>
                <p className="user-info">UI/UX Designer - Austin, TX</p>
            </div>
        </div>
    </div>
);

export default UserProfile;
