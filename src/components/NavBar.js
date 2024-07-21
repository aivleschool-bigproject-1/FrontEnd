import React, { useEffect, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';
import './NavBar.css';

const Navbar = () => {
    const { isLoggedIn, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem('Username');
        logout();
        navigate('/');
    };

    const fetchUser = async () => {
        const token = localStorage.getItem('Authorization');
        try {
            const response = await axios.get('/user', {
                headers: {
                    'Authorization': `${token}`
                }
            });
            setUser(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchUser();
        } else {
            setUser(null);
        }
    }, [isLoggedIn]);

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">BODA
                    <img src={`${process.env.PUBLIC_URL}/images/boda.png`} alt="Hat" className="boda-image"/>
                </Link>
            </div>
            <div className="navbar-links">
                <Link to="/">홈</Link>
                <Link to="/external">현장</Link>
                <Link to="/internal">사무실</Link>
                <Link to="/posts">게시판</Link>
            </div>
            <div className="navbar-actions">
                {isLoggedIn ? (
                    <>
                        {user && user.role === 'ROLE_ADMIN' ? (
                            <button className="navbar-admin">Admin</button>
                        ) : (
                            <Link className="navbar-username">{user && `${user.name}님`}</Link>
                        )}
                        <Link onClick={handleLogout} className="navbar-logout">Logout</Link>
                        <Link to="/profile" className="navbar-profile">My Profile</Link>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="navbar-login">Login</Link>
                        <Link to="/signup" className="navbar-signup">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
