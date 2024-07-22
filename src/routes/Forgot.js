import React, { useState } from 'react';
import axios from 'axios';
import './Forgot.css';

const PasswordReset = () => {
    const [email, setEmail] = useState('');
    const [notification, setNotification] = useState('');

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setNotification('비밀번호 재설정 링크가 이메일로 전송되었습니다.');
        
        try {
            const response = await axios.post('/password', { email }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // console.log('Server response:', response.data);
        } catch (error) {
            // console.error('Failed to send password reset link:', error);
            setNotification('비밀번호 재설정 링크 전송에 실패했습니다.');
        }
        
        // 필요한 경우 제출 후 폼 초기화
        setEmail('');
    };

    return (
        <div className="password-reset-container">
            <h1>비밀번호 찾기</h1>
            <form onSubmit={handleFormSubmit} className="password-reset-form">
                <div className="form-group">
                    <label htmlFor="email">이메일</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="이메일을 입력해주세요"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="password-reset-button">비밀번호 재설정 링크 보내기</button>
            </form>
            {notification && <p className="message">{notification}</p>}
        </div>
    );
};

export default PasswordReset;
