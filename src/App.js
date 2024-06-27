import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Navbar from './components/NavBar';
import Article from './routes/Article';
import Home from './routes/Home';
import Interview from './routes/Interview';
import Letter from './routes/Letters';
import Login from './routes/Login';
import SignUp from './routes/SignUp';
import './App.css';
import './Transitions.css'; 

const AnimatedRoutes = () => {
    const location = useLocation();
    return (
        <TransitionGroup>
            <CSSTransition key={location.key} classNames="fade" timeout={500}>
                <Routes location={location}>
                    <Route path="/" element={<Home />} />
                    <Route path="/article" element={<Article />} />
                    <Route path="/letter" element={<Letter />} />
                    <Route path="/interview" element={<Interview />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                </Routes>
            </CSSTransition>
        </TransitionGroup>
    );
};

function App() {
    return (
        <Router basename={process.env.PUBLIC_URL}>
            <Navbar />
            <div className="container">
                <AnimatedRoutes />
            </div>
        </Router>
    );
}

export default App;
