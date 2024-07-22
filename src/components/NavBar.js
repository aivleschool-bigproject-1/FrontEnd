import React, { useEffect, useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';
import './NavBar.css';

const Navbar = () => {
    const { isLoggedIn, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        localStorage.removeItem('Username');
        localStorage.removeItem('Authorization');
        await logout();
        navigate('/BigProject');
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

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/BigProject">
                    <img src={`${process.env.PUBLIC_URL}/images/icon.png`} className="boda-image" />
                </Link>
            </div>
            <div className={`navbar-menu ${isMenuOpen ? 'open' : ''}`}>
                {isMenuOpen && <span className="close-icon" onClick={toggleMenu}>&times;</span>}
                <div className="navbar-links">
                    <NavLink to="/BigProject" onClick={toggleMenu}>홈</NavLink>
                    <NavLink to="/external" onClick={toggleMenu}>현장</NavLink>
                    <NavLink to="/internal" onClick={toggleMenu}>사무실</NavLink>
                    <NavLink to="/posts" onClick={toggleMenu}>게시판</NavLink>
                </div>
                <div className="navbar-actions">
                    {isLoggedIn ? (
                        <>
                            {user && user.role === 'ROLE_ADMIN' && (
                                <button className="navbar-admin" onClick={toggleMenu}>Admin</button>
                            )}
                            {user && (
                                <button className="navbar-username" onClick={toggleMenu}>
                                    {`${user.name}님`}
                                </button>
                            )}
                            <Link onClick={() => { handleLogout(); toggleMenu(); }} className="navbar-logout">Logout</Link>
                            <NavLink to="/profile" onClick={toggleMenu} className="navbar-profile">My Profile</NavLink> 
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" onClick={toggleMenu} className="navbar-login">Login</NavLink>
                            <NavLink to="/signup" onClick={toggleMenu} className="navbar-signup">Sign Up</NavLink>
                        </>
                    )}
                </div>
            </div>
            <button className={`hamburger-menu ${isMenuOpen ? 'hidden' : ''}`} onClick={toggleMenu}>
                <span></span>
                <span></span>
                <span></span>
            </button>
        </nav>
    );
};

export default Navbar;
