import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import './External.css';

const External = () => {
  const location = useLocation();
  const isSection1 = location.pathname === '/external/section1';
  const isSection2 = location.pathname === '/external/section2';

  const descriptions = [
    {
      icon: "🚧",
      title: "낙상 감지",
      description: ["작업자의 낙상을 즉시 감지하고", "관리자에게 알림을 보냅니다."]
    },
    {
      icon: "⚠️",
      title: "위험 감지",
      description: ["작업자를 인식하는", "위험을 감지합니다."]
    },
    {
      icon: "🦺",
      title: "안전장비 감지",
      description: ["안전장비 착용 여부를 감지합니다."]
    },
    {
      icon: "👥",
      title: "인원수 감지",
      description: ["2인 1조 원칙을 위반했는지 감시하고", "관리자에게 보고합니다."]
    },
    {
      icon: "🔥",
      title: "화재 감지",
      description: ["작업장 내의 화재를 감지합니다."]
    }
  ];

  return (
    <div className="external-container">
      <Sidebar />
      <div className="external-content">
        {!(isSection1 || isSection2) && (
          <div className="external-card-container">
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
    <div className="external-card">
      <div className="external-icon">{icon}</div>
      <h3 className="external-card-title">{title}</h3>
      {description.map((line, index) => (
        <p key={index} className="external-card-description">{line}</p>
      ))}
    </div>
  );
}

export default External;
