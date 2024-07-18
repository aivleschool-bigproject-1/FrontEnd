import React, { useRef } from 'react';
import './Home.css';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';

const images1 = [
  "images/1.jpg",
  "images/2.jpg",
  "images/3.jpg"
];

const images2 = [
  "images/4.jpg",
  "images/5.jpg",
  "images/6.jpg"
];

const Home = () => {
  const containerRef = useRef(null);

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
    <div id="home-container" ref={containerRef} style={{ overflow: 'hidden' }}>
      <div
        className="background-section"
        style={{
          background: `url(${process.env.PUBLIC_URL}/images/10.jpg) no-repeat center center`,
          backgroundSize: 'cover',
          width: '100%',
          height: '110vh',
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
            BODA는 공사장의 외근 및 내근 업무를 최첨단 솔루션을 통해 철저히 감시하여 여러분의 안전을 보장합니다
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
            철저한 현장 감시 CCTV
          </motion.h3>
          <motion.p
            className="second"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            실시간 현장 감시를 통해 사고 발견 시간을 줄입니다
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
                <img src={`${process.env.PUBLIC_URL}/${image}`} alt={`Card ${index + 1}`} className="card-image" />
                <motion.div
                  className="card-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.5, delay: index * 0.6 }}
                >
                </motion.div>
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
            사무실 내 안전을 위한 솔루션을 제공합니다
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
                <img src={`${process.env.PUBLIC_URL}/${image}`} alt={`Card ${index + 4}`} className="card-image" />
                <motion.div
                  className="card-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.5, delay: index * 0.6 }}
                >
                </motion.div>
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
