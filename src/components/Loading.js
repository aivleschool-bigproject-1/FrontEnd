import React from 'react';
import LoadingBar from './LoadingBar';

const Loading = () => {
  return (
    <div style={styles.container}>
      <img src={`${process.env.PUBLIC_URL}/images/loading.gif`} alt="Loading..." style={styles.gif} />
      <LoadingBar />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: 'white',
  },
  gif: {
    width: '150px',
    height: '150px',
  }
};

export default Loading;
