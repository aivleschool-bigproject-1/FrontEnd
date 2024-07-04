import React, { useState } from 'react';
import './SignUp.css';

const SignUpForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        repassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here (e.g., API call)
        console.log(formData);
        // Reset form after submission
        setFormData({
            username: '',
            email: '',
            password: '',
            repassword: ''
        });
    };

    return (
        <div className="signup-container">
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit} className="signup-form">
                <div className="form-group">
                    <label htmlFor="username">회사</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="회사명을 입력해주세요"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">이메일</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="이메일을 입력해주세요"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">비밀번호</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="비밀번호를 입력해주세요"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="repassword">비밀번호 확인</label>
                    <input
                        type="password"
                        id="repassword"
                        name="repassword"
                        placeholder="비밀번호를 다시 입력해주세요"
                        value={formData.repassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="signup-button">회원가입</button>
            </form>
        </div>
    );
};

export default SignUpForm;
