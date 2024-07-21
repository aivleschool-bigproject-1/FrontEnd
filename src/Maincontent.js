import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Home from './routes/Home';
import External from './routes/External/External';
import External1 from './routes/External/External1';
import External2 from './routes/External/External2';
import Internal from './routes/Internal/Internal';
import Login from './routes/Login';
import SignUp from './routes/SignUp';
import Loading from './components/Loading';
import PasswordReset from './routes/Forgot';
import Posts from './routes/Board/Post';
import Profile from './routes/Profile';
import CCTVGrid_profile from './components/CCTVGrid_profile';
import NewPassword from './routes/PasswordReset';
import Dashboard from './routes/DashBoard';
import CCTVGrid_in from './components/CCTVGrid_in';
import AccountDeletion from './routes/AccountDeletion';
import BorderDetail from './routes/Board/BoardDetail'
import Internal2 from './routes/Internal/Internal2';
import CreatePostForm from './routes/Board/CreatePostForm';
import './App.css';
import './Transitions.css';

const AnimatedRoutes = ({ currentUser }) => {
  const location = useLocation();
  return (
    <TransitionGroup>
      <CSSTransition key={location.key} classNames="fade" timeout={500}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/boards" element={<Posts currentUser={currentUser} />} />
          <Route path="/create-post" element={<CreatePostForm />} />
          <Route path="/internal/dashboard/:username" element={<Dashboard />} />
          <Route path="/external/*" element={<External />}>
            <Route path="section1" element={<External1 />} />
            <Route path="section2" element={<External2 />} />
          </Route>
          <Route path="/internal/*" element={<Internal />}>
            <Route path="section1" element={<CCTVGrid_in />} />
            <Route path="section2" element={<Internal2 />} />
          </Route>
          <Route path="/articles/:id" element={<BorderDetail />} />
          <Route path="/forgot-password" element={<PasswordReset />} />
          <Route path="/delete" element={<AccountDeletion />} />
          <Route path="/password-reset" element={<NewPassword />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
};

const MainContent = ({ isLoading, currentUser }) => {
  const location = useLocation();
  const isMainContent = location.pathname.startsWith('/internal') || location.pathname.startsWith('/external');

  return (
    <div className={isMainContent ? 'main-content' : ''}>
      <div className="content-container">
        {isLoading ? <Loading /> : <AnimatedRoutes currentUser={currentUser} />}
      </div>
    </div>
  );
};

export default MainContent;
