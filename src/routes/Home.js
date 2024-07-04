import React, { useEffect, useRef } from 'react';
import './Home.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '../components/Footer';

gsap.registerPlugin(ScrollTrigger);

const images = [
  "images/1.jpg",
  "images/2.jpg",
  "images/3.jpg"
];

const Home = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const chars = document.querySelectorAll('#home-container .char');

    // 애니메이션 적용
    gsap.from(chars, {
      duration: 3, 
      x: -30, 
      rotation: 180,
      opacity: 0,
      ease: "power3.out", // 차분한 ease 효과
      stagger: 0.05, // 각 글자가 순차적으로 애니메이션 되도록 설정
      onStart: function() {
        // 애니메이션 시작 시 색상 변경
        gsap.to(chars, { color: "#FDBD40", duration: 0.5 });
      },
      onComplete: function() {
        gsap.to(chars, {
          duration: 0.5,
          color: "#1C3554", // 원래 색상으로 변경
        });
      }
    });

    gsap.from("#home-container .subtitle", { 
      duration: 1, 
      y: 30, 
      opacity: 0, 
      ease: "power3.out" 
    });

    gsap.from("#home-container .paragraph", { 
      duration: 1, 
      y: 30, 
      opacity: 0, 
      ease: "power3.out", 
    });

    images.forEach((_, index) => {
      gsap.fromTo(`#image${index}`, 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.5, scrollTrigger: {
          trigger: `#image${index}`,
          start: "top 100%",
          toggleActions: "play none none none"
        }});
    });

  }, []);

  const splitText = (text) => {
    return text.split('').map((char, index) => (
      <span key={index} className="char">{char}</span>
    ));
  };

  return (
    <div id="home-container" ref={containerRef} >
      <div className="content">
        <h1 className="title">{splitText("BODA")}</h1>
        <h2 className="subtitle">Building Oversight & Detection Analysis</h2>
        <p className="paragraph">BODA는 공사장의 외근 및 내근 업무를 최첨단 솔루션을 통해 철저히 감시하여 여러분의 안전을 보장합니다.</p>
        <p className="paragraph">BODA와 함께 안전하고 효율적인 작업 환경을 구축하세요.</p>
      </div>
      {images.map((image, index) => (
        <div
          key={index}
          id={`image${index}`}
          className="image-section"
          style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/${image})` }}
        />
      ))}
      <Footer />
    </div>
  );
};

export default Home;
