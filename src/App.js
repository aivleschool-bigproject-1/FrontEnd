import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Navbar from './components/NavBar';
import Home from './routes/Home';
import External from './routes/External/External';
import External1 from './routes/External/External1';
import External2 from './routes/External/External2';
import Internal2 from './routes/Internal/Internal2';
import Internal from './routes/Internal/Internal';
import Login from './routes/Login';
import SignUp from './routes/SignUp';
import Loading from './components/Loading';
import CCTVGrid from './components/CCTVGrid';
import Sidebar from './components/Sidebar';
import PasswordReset from './routes/Forgot';
import Board from './routes/Board/Board';
import './App.css';
import './Transitions.css';
import Dashboard from './routes/DashBoard';
import axios from 'axios';
import AuthProvider from './Context/AuthContext';

axios.defaults.baseURL = 'http://localhost:8080';

const AnimatedRoutes = ({ currentUser }) => {
  return (
    <TransitionGroup>
      <CSSTransition classNames="fade" timeout={500}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/board" element={<Board currentUser={currentUser} />} />
          <Route path="/forgot-password" element={<PasswordReset />} />
          <Route path="/external/*" element={<External />}>
            <Route path="section1" element={<External1 />} />
            <Route path="section2" element={<External2 />} />
          </Route>
          <Route path="/internal/*" element={<Internal />}>
            <Route path="section1" element={<CCTVGrid />} />
            <Route path="section2" element={<Internal2 />} />
          </Route>
          <Route path="/profile" element={<Dashboard />} />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        // 하드코딩된 사용자 데이터
        const user = {
          id: 1,
          name: '박현빈'
        };
        setCurrentUser(user);
      } catch (error) {
        console.error('Failed to fetch current user:', error);
      } finally {
        // 로딩 시간 3초로 설정
        setTimeout(() => {
          setIsLoading(false);
        }, 3000);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <AuthProvider>
      <Router basename={process.env.PUBLIC_URL}>
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
