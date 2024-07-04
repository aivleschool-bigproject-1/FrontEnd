import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const isInternal = location.pathname.startsWith('/internal');
  const isExternal = location.pathname.startsWith('/external');

  if (!isInternal && !isExternal) {
    return null; // 외부 및 내부 경로가 아닌 경우 사이드바를 렌더링하지 않음
  }

  return (
    <div className={isInternal ? "sidebar-in" : "sidebar"}>
      {isInternal && (
        <>
          <Link to="/internal/section1" className="sidebar-link">전체 CCTV</Link>
          <Link to="/internal/section2" className="sidebar-link">개인별 모니터링</Link>
        </>
      )}
      {isExternal && (
        <>
          <Link to="/external/section1" className="sidebar-link">전체 CCTV</Link>
          <Link to="/external/section2" className="sidebar-link">저장된 CCTV</Link>
        </>
      )}
    </div>
  );
};

export default Sidebar;
