import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import Navbar from './components/NavBar';
import Sidebar from './components/Sidebar';
import './App.css';
import './Transitions.css';
import axios from 'axios';
import AuthProvider from './Context/AuthContext';
import MainContent from './Maincontent';

axios.defaults.baseURL = 'http://localhost:8080';

const App = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchCurrentUser = () => {
            const username = localStorage.getItem('username');
            if (username) {
                setCurrentUser({name: username});
            }
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        };

        fetchCurrentUser();
    }, []);

    return (
        <AuthProvider>
            <Router>
                <Navbar/>
                <div className="app-container">
                    <Sidebar/>
                    <MainContent isLoading={isLoading} currentUser={currentUser}/>
                
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
