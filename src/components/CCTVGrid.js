import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import './CCTVGrid.css';

const SingleWebcam = ({ id, isExpanded, onClick }) => {
  const webcamRef = useRef(null);

  return (
    <div 
      className={`grid-item ${isExpanded ? 'expanded' : ''}`} 
      onClick={() => onClick(id)}
    >
      <Webcam
        audio={false}
        ref={webcamRef}
        className="webcam-video"
      />
    </div>
  );
};

const WebcamComponent = () => {
  const [expandedWebcam, setExpandedWebcam] = useState(null);

  const handleExpand = (id) => {
    setExpandedWebcam(id);
  };

  const handleClose = () => {
    setExpandedWebcam(null);
  };

  return (
    <div className="container">
      {expandedWebcam === null ? (
        <div className="grid-container">
          {[1, 2, 3, 4].map(id => (
            <SingleWebcam 
              key={id} 
              id={id} 
              isExpanded={false} 
              onClick={handleExpand} 
            />
          ))}
        </div>
      ) : (
        <div className="fullscreen">
          <div className="webcam-video-container">
            <Webcam
              audio={false}
              className="webcam-video"
            />
          </div>
          <button className="close-button" onClick={handleClose}>전체보기</button>
        </div>
      )}
    </div>
  );
};

export default WebcamComponent;
