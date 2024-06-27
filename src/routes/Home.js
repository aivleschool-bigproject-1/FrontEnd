import React, { useEffect } from 'react';
import './Home.css';
import { gsap } from 'gsap';

const Home = () => {
    useEffect(() => {
        gsap.from("#home-container .title", { duration: 1.5, y: -50, opacity: 0, ease: "bounce" });
        gsap.from("#home-container .paragraph", { duration: 1.5, y: 50, opacity: 0, ease: "power1", stagger: 0.3 });
    }, []);

    return (
        <div id="home-container">
            <h1 className="title"> 당신의 성공을 위한 첫 걸음, [프로그램 이름]</h1>
            <p className="paragraph">취업 준비의 모든 단계에서 여러분과 함께합니다. 이력서 작성부터 자기소개서, 모의 면접까지, 성공적인 취업을 위한 맞춤형 솔루션을 제공합니다.</p>
            <p className="paragraph">[프로그램 이름]과 함께 하며 함께 여정을 펼쳐보세요</p>
        </div>
    );
};

export default Home;
