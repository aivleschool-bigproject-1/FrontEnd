/*import React, { useState, useEffect, useRef } from 'react';
import './CCTVGrid.css';

const CCTVGrid = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [webcamStream, setWebcamStream] = useState(null);
  const webcamRef = useRef(null);

  const videoSources = [
    { src: 'cctv_feed1.mp4' },
    { src: 'cctv_feed2.mp4' },
    { src: 'cctv_feed3.mp4' }
  ];

  useEffect(() => {
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          setWebcamStream(stream);
          if (webcamRef.current) {
            webcamRef.current.srcObject = stream;
            webcamRef.current.muted = true;
          }
        })
        .catch((error) => {
          console.error("Error accessing webcam: ", error);
        });
    }
    return () => {
      if (webcamStream) {
        webcamStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [webcamStream]);

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
          <div className="grid-item" onClick={() => handleVideoClick({ src: 'webcam' })}>
            <video ref={webcamRef} autoPlay muted></video>
          </div>
        </div>
      )}
    </div>
  );
};

export default CCTVGrid;*/
