import React, { useState } from 'react';
import './Forgot.css';

const PasswordReset = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // 여기에 이메일로 비밀번호 재설정 링크를 보내는 로직을 추가하세요.
        console.log(email);
        setMessage('비밀번호 재설정 링크가 이메일로 전송되었습니다.');
        // 필요한 경우 제출 후 폼 초기화
        setEmail('');
    };

    return (
        <div className="password-reset-container">
            <h1>비밀번호 찾기</h1>
            <form onSubmit={handleSubmit} className="password-reset-form">
                <div className="form-group">
                    <label htmlFor="email">이메일</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="이메일을 입력해주세요"
                        value={email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="password-reset-button">비밀번호 재설정 링크 보내기</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default PasswordReset;
