import React, { useEffect, useState } from 'react';
import './LoadingBar.css';

const LoadingBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + 1 : 0));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loader">
      <div className="load"></div>
    </div>
  );
};

export default LoadingBar;
