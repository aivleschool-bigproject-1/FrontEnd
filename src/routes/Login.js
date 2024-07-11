import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/login', formData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true,
            });

            console.log('로그인 성공:', response.data);
            localStorage.setItem('token', response.data.token);
            login();
            navigate('/');
        } catch (error) {
            console.error('로그인 실패:', error);
        }
        setFormData({
            username: '',
            password: ''
        });
    };

    return (
        <div className="login-container">
            <h1>로그인</h1>
            <form onSubmit={handleSubmit} className="login-form">
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
                <button type="submit" className="login-button">로그인</button>
            </form>
            <Link to="/forgot-password" className="forgot-password-link">비밀번호 찾기</Link>
            <div className="login-buttons-container">
                <div className="login-button-naver" style={{ backgroundImage: `url(${process.env.PUBLIC_URL + '/images/naver.png'})` }}>
                    <a href="http://localhost:8080/oauth2/authorization/naver"></a> 
                </div>
                <div className="login-button-google" style={{ backgroundImage: `url(${process.env.PUBLIC_URL + '/images/google.png'})` }}>
                    <a href="http://localhost:8080/oauth2/authorization/google"></a>
                </div>
            </div>
        </div>
    );
};

export default Login;
