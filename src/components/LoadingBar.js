import React, { useEffect, useState } from 'react';

const LoadingBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + 1 : 0));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container}>
      <div style={{ ...styles.progress, width: `${progress}%` }}></div>
    </div>
  );
};

const styles = {
  container: {
    width: '10%',
    height: '10px',
    backgroundColor: '#FDBD40',
    borderRadius: '5px',
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#1C3554',
    transition: 'width 0.03s ease-in-out',
  }
};

export default LoadingBar;
