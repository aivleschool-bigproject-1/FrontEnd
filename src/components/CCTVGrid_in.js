import React from 'react';
import './CCTVGrid_ex.css';
import VideoPlayer from './VideoPlayer';
import EventLogs_in from './Eventlogs';

const CCTVGrid_in = () => {
  const videoSource = 'https://boda-ts-bucket.s3.amazonaws.com/office-cctv-output/playlist.m3u8';
  const cameraId = 'office-cctv';

  return (
    
    <div className="grid-container">
      <div className="video-player">
        <VideoPlayer url={videoSource} />
      </div>
  </div>
  );
};

export default CCTVGrid_in;
