import React, { useRef } from 'react';
import './Home.css';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import Footer from '../components/Footer';

const images = [
  "images/1.jpg",
  "images/2.jpg",
  "images/3.jpg"
];

const Home = () => {
  const containerRef = useRef(null);

  const splitText = (text) => {
    return text.split('').map((char, index) => (
      <motion.span
        key={index}
        className="char"
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: index * 0.2 }}
        whileHover={{ color: "#FDBD40" }}
        whileInView={{ color: "#000", transition: { delay: index * 0.1, duration: 0.3 } }}
      >
        {char}
      </motion.span>
    ));
  };

  return (
    <div id="home-container" ref={containerRef} >
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
          BODA는 공사장의 외근 및 내근 업무를 최첨단 솔루션을 통해 철저히 감시하여 여러분의 안전을 보장합니다.
        </motion.p>
        <motion.p
          className="paragraph"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          BODA와 함께 안전하고 효율적인 작업 환경을 구축하세요.
        </motion.p>
      </div>
      {images.map((image, index) => (
        <motion.div
          key={index}
          id={`image${index}`}
          className="image-section"
          style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/${index + 1}.jpg)` }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 1.5,
            delay: index * 0.5
          }}
          viewport={{ once: true, amount: 0.5 }}
        />
      ))}
      <Footer />
    </div>
  );
};

export default Home;
