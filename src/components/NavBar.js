import React, {useContext} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {AuthContext} from '../Context/AuthContext';
import './NavBar.css';

const Navbar = () => {
    const {isLoggedIn, logout} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('Username');
        logout();
        navigate('/');
    };

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
                        <button onClick={handleLogout} className="navbar-logout">Logout</button>
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
