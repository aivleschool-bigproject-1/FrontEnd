import React, { useRef, useEffect, useState } from 'react';
import './Home.css';
import { motion } from 'framer-motion';
import Modal from 'react-modal';
import Footer from '../components/Footer';

const images1 = [
  { src: "images/1.jpg", description: ["24/7 실시간 모니터링", "사고 발생 시 즉각 알림"] },
  { src: "images/2.jpg", description: ["인원수 위반 감시", "근무 시간 체크", "작업 효율성 분석"] },
  { src: "images/3.jpg", description: ["안전모 착용 감시", "현장 감시 CCTV 설치", "작업 환경 분석"] }
];

const images2 = [
  { src: "images/4.jpg", description: ["개인별 사무실 CCTV", "개인 공간 보호", "업무 집중도 향상"] },
  { src: "images/5.jpg", description: ["공동 작업 공간 모니터링", "협업 효율성 증가", "안전 관리 강화"] },
  { src: "images/6.jpg", description: ["사무실 내 건강 관리", "스트레스 모니터링", "피로도 측정"] }
];


const Home = () => {
  const containerRef = useRef(null);
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = queryParams.get('token');
    const usernameFromUrl = queryParams.get('username');
    console.log('Token from URL:', tokenFromUrl);
    console.log('Username from URL:', usernameFromUrl);
    if (tokenFromUrl && usernameFromUrl) {
      localStorage.setItem('Authorization', tokenFromUrl);
      localStorage.setItem('Username', usernameFromUrl);
      setToken(tokenFromUrl);
      setUsername(usernameFromUrl);
    }

    const timer = setTimeout(() => {
      setModalIsOpen(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);


  const splitText = (text) => {
    return text.split('').map((char, index) => (
      <motion.span
        key={index}
        className="char"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: index * 0.1 }}
        whileHover={{ color: "#FDBD40", scale: 1.1 }}
        whileInView={{ color: "#1C3554", transition: { delay: index * 0.05, duration: 0.3 } }}
      >
        {char}
      </motion.span>
    ));
  };

  return (
    <div id="home-container" style={{ overflow: 'hidden' }}>
      <div
        className="background-section"
        style={{
          backgroundSize: 'cover',
          width: '100%',
          height: '100vh',
          position: 'relative'
        }}
      >
        <div className="content" style={{ position: 'relative' }}>
          <h1 className="title">{splitText("BODA")}</h1>
          <motion.h2
            className="subtitle"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Building Oversight & Detection Analysis
          </motion.h2>
          <motion.p
            className="paragraph"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            BODA는 외근 및 내근 업무를 최첨단 솔루션을 통해 철저히 감시하여 여러분의 안전을 보장합니다
          </motion.p>
          <motion.p
            className="paragraph"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            BODA와 함께 안전하고 효율적인 작업 환경을 구축하세요
          </motion.p>
        </div>
      </div>
      <div className="white-background">
        <div className="section">
          <motion.h3
            className="section-title"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            철저한 현장 CCTV
          </motion.h3>
          <motion.p
            className="second"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            실시간 현장 감시를 통해 사고 발견 시간을 줄여 직원들의 안전을 책임집니다
          </motion.p>
          <div className="cards-container">
            {images1.map((image, index) => (
              <motion.div
                key={index}
                className="card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.5,
                  delay: index * 0.5
                }}
                viewport={{ once: true, amount: 0.5 }}
              >
                <img src={`${process.env.PUBLIC_URL}/${image.src}`} alt={`Card ${index + 1}`} className="card-image" />
                <div className="card-content">
                  {image.description.map((desc, i) => (
                    <div key={i} className="card-description">{desc}</div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="banner" style={{ background: `url(${process.env.PUBLIC_URL}/images/9.jpg) no-repeat center center`, backgroundSize: 'cover', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <motion.h2
              className="banner-title"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1 }}
            >
              지금 바로 BODA 커뮤니티에 참여해
            </motion.h2>
            <motion.p
              className="banner-text"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              같은 분야의 사람들과 함께 고민을 나누고 성장해요
            </motion.p>
          </div>
        </div>
        <div className="section">
          <motion.h3
            className="section-title"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            개인별 사무실 CCTV
          </motion.h3>
          <motion.p
            className="second"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            사무실 내 안전과 근무자의 건강을 위한 솔루션을 제공합니다
          </motion.p>
          <div className="cards-container">
            {images2.map((image, index) => (
              <motion.div
                key={index}
                className="card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.5,
                  delay: index * 0.5
                }}
                viewport={{ once: true, amount: 0.5 }}
              >
                <img src={`${process.env.PUBLIC_URL}/${image.src}`} alt={`Card ${index + 4}`} className="card-image" />
                <div className="card-content">
                  {image.description.map((desc, i) => (
                    <div key={i} className="card-description">{desc}</div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Home;