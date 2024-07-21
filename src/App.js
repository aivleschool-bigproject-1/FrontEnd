import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar';
import Home from './routes/Home';
import External from './routes/External/External';
import External1 from './routes/External/External1';
import External2 from './routes/External/External2';
import Internal from './routes/Internal/Internal';
import Login from './routes/Login';
import SignUp from './routes/SignUp';
import Loading from './components/Loading';
import Sidebar from './components/Sidebar';
import PasswordReset from './routes/Forgot';
import Posts from './routes/Board/Post';
import './App.css';
import './Transitions.css';
import Profile from './routes/Profile';
import CCTVGrid_profile from './components/CCTVGrid_profile';
import axios from 'axios';
import NewPassword from './routes/PasswordReset';
import Dashboard from './routes/DashBoard';
import CCTVGrid_in from './components/CCTVGrid_in';
import AccountDeletion from './routes/AccountDeletion';
import AuthProvider from './Context/AuthContext';
import BorderDetail from './routes/Board/BoardDetail'
import Internal2 from './routes/Internal/Internal2';
import CreatePostForm from './routes/Board/CreatePostForm';
import MainContent from './Maincontent';

axios.defaults.baseURL = 'http://localhost:8080';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = () => {
      const username = localStorage.getItem('username');
      if (username) {
        setCurrentUser({ name: username });
      }
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    };

    fetchCurrentUser();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="app-container">
          <Sidebar />
          <MainContent isLoading={isLoading} currentUser={currentUser} />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
