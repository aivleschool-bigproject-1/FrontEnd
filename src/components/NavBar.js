import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogout = () => {
        // Implement your logout logic here
        setIsLoggedIn(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">LogoIpsum</Link>
            </div>
            <div className="navbar-links">
                <Link to="/letter">이력서관리</Link>
                <Link to="/interview">모의면접</Link>
                <Link to="/article">면접대비</Link>
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
