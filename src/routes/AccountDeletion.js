import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import './AccountDeletion.css';

const AccountDeletion = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const handleDeleteAccount = async () => {
        if (!window.confirm('정말로 회원 탈퇴를 진행하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const jwt = localStorage.getItem('Authorization');
            if (!jwt) {
                setError('JWT token not found');
                setLoading(false);
                return;
            }

            const response = await axios.delete('/delete', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${jwt}`
                }
            });

            console.log('Account deletion successful:', response.data);
            await logout();
            localStorage.removeItem('Authorization');
            navigate('/BigProject', { replace: true });  // Only navigate after successful deletion
        } catch (error) {
            setError('Failed to delete account.');
            console.error('Failed to delete account:', error.response ? error.response.data : error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="account-deletion-container">
            <h1>회원 탈퇴</h1>
            <p>회원 탈퇴를 진행하시겠습니까?</p>
            {error && <p className="error">{error}</p>}

            <button onClick={handleDeleteAccount} disabled={loading} className="delete-button">
                {loading ? '탈퇴 중...' : '회원 탈퇴'}
            </button>
        </div>
    );
};

export default AccountDeletion;
