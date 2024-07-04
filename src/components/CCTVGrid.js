import React, { useState } from 'react';
import './CCTVGrid.css';

const CCTVGrid = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const videoSources = [
    { src: 'cctv_feed1.mp4'},
    { src: 'cctv_feed2.mp4' },
    { src: 'cctv_feed3.mp4'},
    { src: 'http://your-live-stream-url' }
  ];

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
  };

  const handleBackClick = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="cctv-container">
      {selectedVideo ? (
        <div className="enlarged-video">
          <video src={selectedVideo.src} controls autoPlay loop muted></video>
          <button onClick={handleBackClick} className="back-button">전체보기</button>
        </div>
      ) : (
        <div className="grid-container">
          {videoSources.map((video, index) => (
            <div className="grid-item" key={index} onClick={() => handleVideoClick(video)}>
              <video src={video.src} controls autoPlay loop muted></video>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CCTVGrid;
