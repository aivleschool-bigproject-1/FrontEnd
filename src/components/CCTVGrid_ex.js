import React from 'react';
import './CCTVGrid_ex.css';
import VideoPlayer from './VideoPlayer';
import EventLogs from './Eventlogs_ex';

const CCTVGrid_ex = () => {
  const videoSource = 'https://boda-ts-bucket.s3.amazonaws.com/industrial-cctv-output/playlist.m3u8';
  const cameraId = 'industrial-cctv';

  return (
    <div className="grid-container">
      <VideoPlayer url={videoSource} />
      <EventLogs cameraId={cameraId} />
    </div>
  );
};

export default CCTVGrid_ex;
