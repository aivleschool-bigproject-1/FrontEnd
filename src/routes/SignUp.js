import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

const SignUpForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        password: '',
        repassword: ''
    });

    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.repassword) {
            setErrorMessage('비밀번호가 일치하지 않습니다');
            return;
        }

        try {
            const response = await axios.post('/join', {
                username: formData.username,
                name: formData.name,
                email: formData.email,
                password: formData.password
            }, {
                withCredentials: true
            });
            console.log('Registration successful:', response.data);
            setErrorMessage('');
            setFormData({
                username: '',
                name:'',
                email: '',
                password: '',
                repassword: ''
            });
            navigate('/login', { state: { message: '회원가입이 완료되었습니다!' } });
        } catch (error) {
            if (error.response) {
                if (error.response.status === 409) {
                    setErrorMessage('이미 가입된 사용자입니다.');
                } 
                else if (error.response.status === 422) {
                    setErrorMessage('중복된 이메일입니다.');
                }
                else {
                    setErrorMessage('Internal server error');
                }
            } else {
                setErrorMessage('Registration failed: ' + error.message);
            }
        }
    };

    return (
        <div className="signup-container">
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit} className="signup-form">
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <div className="form-group">
                    <label htmlFor="username">아이디</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="아이디를 입력해주세요"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="name">이름</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="이름을 입력해주세요"
                        value={formData.name}
                        onChange={handleChange}
                        required
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
