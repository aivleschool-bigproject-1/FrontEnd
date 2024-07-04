import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './Internal.css';

const Internal = () => {
    const location = useLocation();
    const isSection1 = location.pathname === '/internal/section1';
    const isSection2 = location.pathname === '/internal/section2';
    const descriptions = [
      {
        icon: "🔍",  
        title: "현재 상태 감지",
        description: ["아이트래킹, 심장박동을 통해", "직원의 과로, 스트레스, 피로 상태를", "모니터링합니다."]
      },
      {
        icon: "📵",  
        title: "보행중 휴대폰 사용 감지",
        description: ["직원이 이동 중에 휴대폰을", "사용하는 것을 감지하고", "관리자에게 경고 알림 전송합니다."]
      },
      {
        icon: "🧘",  
        title: "거북목 감지​",
        description: ["작업장 내에서 올바르지 못한 자세를", "감지합니다."]
      },
    ];
  
    return (
      <div className="internal-container">
        <Sidebar />
        <div className="content">
          {!(isSection1 || isSection2) && (
            <div className="card-container-in">
              {descriptions.map((item, index) => (
                <Card 
                  key={index}
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>
          )}
          <Outlet />
        </div>
      </div>
    );
  };
  
  const Card = ({ icon, title, description }) => {
    return (
      <div className="card-in">
        <div className="icon">{icon}</div>
        <h3>{title}</h3>
        {description.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    );
  }
  
  export default Internal;
