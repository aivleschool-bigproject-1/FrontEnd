import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';
import './Login.css';

const LOGIN_URL = '/login';
const NAVER_AUTH_URL = 'http://localhost:8080/oauth2/authorization/naver';
const GOOGLE_AUTH_URL = 'http://localhost:8080/oauth2/authorization/google';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
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
            const response = await axios.post(LOGIN_URL, formData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true,
            });

            console.log('로그인 성공:', response.data);
            // 서버 응답 헤더에서 Authorization 값과 Username 값 추출
            const token = response.headers['authorization'];
            const username = response.headers['username'];
            console.log('추출한 토큰:', token);
            console.log('추출한 사용자 이름:', username);

            if (token) {
                localStorage.setItem('Authorization', token);
                localStorage.setItem('Username', username);
                console.log('토큰 저장 확인:', localStorage.getItem('Authorization'));
                console.log('사용자 이름 저장 확인:', localStorage.getItem('Username'));
                login();
                navigate('/');
            } else {
                throw new Error('Token or username not found in response headers');
            }
        } catch (error) {
            console.error('로그인 실패:', error);
            setError('아이디 또는 비밀번호가 올바르지 않습니다.');
        } finally {
            setFormData({
                username: '',
                password: ''
            });
        }
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
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="login-button">로그인</button>
                <div className="login-buttons-container">
                    <div className="login-button-naver" style={{ backgroundImage: `url(${process.env.PUBLIC_URL + '/images/naver.png'})` }}>
                        <a href={NAVER_AUTH_URL}></a> 
                    </div>
                    <div className="login-button-google" style={{ backgroundImage: `url(${process.env.PUBLIC_URL + '/images/google.png'})` }}>
                        <a href={GOOGLE_AUTH_URL}></a>
                    </div>
                </div>
                <div>
                    <Link to="/forgot-password" className="forgot-password-link">비밀번호 찾기</Link>
                </div>
            </form>
        </div>
    );
};

export default Login;
