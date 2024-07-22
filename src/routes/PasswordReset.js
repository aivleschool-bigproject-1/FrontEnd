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

    const validatePassword = (password) => {
        const lengthCheck = password.length >= 8;
        const mixCheck = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/.test(password);
        const noRepeatsCheck = !/(.)\1{2}/.test(password);

        if (!lengthCheck) {
            return '비밀번호는 8자 이상이어야 합니다.';
        }
        if (!mixCheck) {
            return '비밀번호는 숫자와 알파벳을 모두 포함해야 합니다.';
        }
        if (!noRepeatsCheck) {
            return '비밀번호에 연속된 3개 이상의 동일 문자가 포함될 수 없습니다.';
        }

        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (formData.changedPassword !== formData.confirmChangedPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.currentPassword === formData.changedPassword) {
            setError('기존 비밀번호와 다르게 설정해주세요.');
            return;
        }

        // 비밀번호 유효성 검사
        const passwordError = validatePassword(formData.changedPassword);

        if (passwordError) {
            setError(passwordError);
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

            // console.log('Sending request with data:', JSON.stringify(requestData));

            const response = await axios.post('/edit', requestData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${jwt}`
                },
                withCredentials: true,
            });

            setSuccess('Password changed successfully');
        } catch (error) {
            if (error.response && error.response.data) {
                setError(`Error: ${JSON.stringify(error.response.data)}`); // Log detailed error
            } else if(error.response.status === 401){
                setError('현재 비밀번호를 확인해주세요.');
            }
            else {
                setError('Internal Server Error');
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
                <div className="done-message">
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}
                </div>
                <button type="submit" className="password-reset-button" disabled={loading}>
                    {loading ? '수정중...' : '수정'}
                </button>
            </form>
        </div>
    );
};

export default PasswordReset;
