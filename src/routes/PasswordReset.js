import React, { useState } from 'react';
import axios from 'axios';
import './PasswordReset.css';

const PasswordReset = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        changedPassword: '',
        confirmChangedPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (formData.changedPassword !== formData.confirmChangedPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const jwt = localStorage.getItem('Authorization');
            if (!jwt) {
                setError('JWT token not found');
                setLoading(false);
                return;
            }

            const requestData = {
                currentPassword: formData.currentPassword,
                changedPassword: formData.changedPassword,
                jwt: jwt
            };

            console.log('Sending request with data:', JSON.stringify(requestData));

            const response = await axios.post('/edit', requestData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${jwt}`
                },
                withCredentials: true,
            });

            setSuccess('Password changed successfully');
            console.log('Password changed successfully:', response.data);
        } catch (error) {
            if (error.response && error.response.data) {
                setError(`Error: ${JSON.stringify(error.response.data)}`); // Log detailed error
            } else {
                setError('Failed to change password. Please check your input and try again.');
            }
            console.error('Failed to change password:', error.response ? error.response.data : error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="password-reset-container">
            <h1>비밀번호 수정</h1>
            <form onSubmit={handleSubmit} className="password-reset-form">
                <div className="form-group">
                    <label htmlFor="currentPassword">현재 비밀번호</label>
                    <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        placeholder="현재 비밀번호를 입력해주세요"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="changedPassword">새로운 비밀번호</label>
                    <input
                        type="password"
                        id="changedPassword"
                        name="changedPassword"
                        placeholder="새로운 비밀번호를 입력해주세요"
                        value={formData.changedPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmChangedPassword">비밀번호 확인</label>
                    <input
                        type="password"
                        id="confirmChangedPassword"
                        name="confirmChangedPassword"
                        placeholder="새로운 비밀번호를 다시 입력해주세요"
                        value={formData.confirmChangedPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                <button type="submit" className="password-reset-button" disabled={loading}>
                    {loading ? '수정중...' : '수정'}
                </button>
            </form>
        </div>
    );
};

export default PasswordReset;
