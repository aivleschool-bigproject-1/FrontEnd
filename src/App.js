import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
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
import Board from './routes/Board/Board';
import './App.css';
import './Transitions.css';
import Profile from './routes/Profile';
import axios from 'axios';
import NewPassword from './routes/PasswordReset';
import Dashboard from './routes/DashBoard';
import CCTVGrid_in from './components/CCTVGrid_in';
import AccountDeletion from './routes/AccountDeletion';
import AuthProvider from './Context/AuthContext';
import BorderDetail from './routes/Board/BoardDetail'
import EditArticle from './routes/Board/EditArticle';
import Internal2 from './routes/Internal/Internal2';
import ChartDetail from './routes/ChartDetail';
axios.defaults.baseURL = 'http://localhost:8080';

const AnimatedRoutes = ({ currentUser }) => {
  return (
    <TransitionGroup>
      <CSSTransition classNames="fade" timeout={500}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/boards" element={<Board currentUser={currentUser} />} />
          <Route path="/dashboard/:username" element={<Dashboard />} />
          <Route path="/dashboarddetail" element={<ChartDetail />} />
          <Route path="/articles/:id" element={<BorderDetail />} />
          <Route path="/articles/:id/edit" element={<EditArticle />} />
          <Route path="/forgot-password" element={<PasswordReset />} />
          <Route path="/delete" element={<AccountDeletion />} />
          <Route path="/password-reset" element={<NewPassword />} />
          <Route path="/external/*" element={<External />}>
            <Route path="section1" element={<External1 />} />
            <Route path="section2" element={<External2 />} />
          </Route>
          <Route path="/internal/*" element={<Internal />}>
            <Route path="section1" element={<CCTVGrid_in />} />
            <Route path="section2" element={<Internal2 />} />
          </Route>
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
};

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
          <div className="content-container">
            {isLoading ? <Loading /> : <AnimatedRoutes currentUser={currentUser} />}
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
